import { useCallback, useEffect, useRef, useState } from 'react';
import ScenarioCharts from '../components/ScenarioCharts';
import ShowcaseScene from '../components/ShowcaseScene';
import { SimulationClient } from '../engine/simulationClient';
import type { NumericParams, ScenarioDefinition, Trajectory } from '../engine/types';
import { metricValueAt } from '../metrics/live';
import { formatMetric } from './format';
import { showcaseScenes } from './scenes';
import ShowcaseTransport from './ShowcaseTransport';
import type { ShowcaseBeat, ShowcaseChapter } from './types';
import { usePlayback } from './usePlayback';

interface Staging {
  tick: number;
  playTo?: number;
  speed?: number;
}

interface RunSpec {
  params: NumericParams;
  seed: number;
}

function beatParams(definition: ScenarioDefinition, beat: ShowcaseBeat): NumericParams {
  const preset = definition.presets.find((candidate) => candidate.id === beat.preset);
  return { ...definition.defaults, ...(preset?.values ?? {}) };
}

function beatSpec(definition: ScenarioDefinition, beat: ShowcaseBeat): RunSpec {
  return { params: beatParams(definition, beat), seed: beat.seed ?? definition.seed };
}

function sameParams(left: NumericParams, right: NumericParams): boolean {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  return [...keys].every((key) => Object.is(left[key], right[key]));
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface Props {
  chapter: ShowcaseChapter;
  definition: ScenarioDefinition;
}

/** One chapter's live stage: owns a SimulationClient, starts its first run
    when scrolled into view, and restages the run as the reader steps
    through beats. Watch-only — no parameter access anywhere. */
export default function ChapterStage({ chapter, definition }: Props) {
  const firstBeat = chapter.beats[0];
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const [runSpec, setRunSpec] = useState<RunSpec>(() => beatSpec(definition, firstBeat));
  const [trajectory, setTrajectory] = useState<Trajectory | null>(null);
  const [status, setStatus] = useState<'running' | 'ready' | 'error'>('running');
  const [error, setError] = useState('');
  const [view, setView] = useState(firstBeat.view);
  const [started, setStarted] = useState(false);
  const clientRef = useRef<SimulationClient | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const specRef = useRef<RunSpec>(runSpec);
  const stagedRef = useRef<Staging | null>({
    tick: firstBeat.tick,
    playTo: firstBeat.playTo,
    speed: firstBeat.speed,
  });
  const { tick, fraction, playing, setPlayhead, setPlaying, setSpeed, setPlayTarget } =
    usePlayback(trajectory);

  const activeBeat = chapter.beats[activeBeatIndex];
  const metric = chapter.headlineMetric
    ? definition.metrics.find((candidate) => candidate.key === chapter.headlineMetric)
    : undefined;

  useEffect(() => {
    const client = new SimulationClient();
    clientRef.current = client;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const respectMotionPreference = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) setPlaying(false);
    };
    reducedMotion.addEventListener('change', respectMotionPreference);
    return () => {
      reducedMotion.removeEventListener('change', respectMotionPreference);
      client.dispose();
    };
  }, [setPlaying]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setStarted(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible) setStarted(true);
        else setPlaying(false);
      },
      { rootMargin: '160px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [setPlaying]);

  const applyStaging = useCallback(
    (staging: Staging, lastTick: number) => {
      setPlayhead(Math.min(staging.tick, lastTick));
      setPlayTarget(staging.playTo ?? null);
      if (staging.speed) setSpeed(staging.speed);
      setPlaying(Boolean(staging.playTo) && !prefersReducedMotion());
    },
    [setPlayhead, setPlayTarget, setPlaying, setSpeed]
  );

  useEffect(() => {
    if (!started) return;
    setStatus('running');
    setError('');
    const timer = window.setTimeout(() => {
      clientRef.current
        ?.run(definition.id, runSpec.params, runSpec.seed)
        .then((result) => {
          setTrajectory(result.trajectory);
          setStatus('ready');
          const staged = stagedRef.current;
          stagedRef.current = null;
          if (staged) {
            applyStaging(staged, result.trajectory.meta.T - 1);
          } else {
            setPlayhead((current) => Math.min(current, result.trajectory.meta.T - 1));
          }
        })
        .catch((reason: Error) => {
          if (reason.message.includes('terminated')) return;
          setStatus('error');
          setError(reason.message);
        });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [applyStaging, definition.id, runSpec, setPlayhead, started]);

  const activateBeat = useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(index, chapter.beats.length - 1));
      const beat = chapter.beats[nextIndex];
      if (!beat) return;
      setActiveBeatIndex(nextIndex);
      setView(beat.view);
      const staging: Staging = { tick: beat.tick, playTo: beat.playTo, speed: beat.speed };
      const nextSpec = beatSpec(definition, beat);
      const unchanged =
        specRef.current.seed === nextSpec.seed &&
        sameParams(specRef.current.params, nextSpec.params);
      if (unchanged && trajectory) {
        applyStaging(staging, trajectory.meta.T - 1);
      } else {
        stagedRef.current = staging;
        if (!unchanged) {
          specRef.current = nextSpec;
          setRunSpec(nextSpec);
        }
      }
    },
    [applyStaging, chapter.beats, definition, trajectory]
  );

  const togglePlay = useCallback(() => {
    setPlayTarget(null);
    if (!playing && trajectory && tick >= trajectory.meta.T - 1) setPlayhead(0);
    setPlaying((current) => !current);
  }, [playing, setPlayhead, setPlaying, setPlayTarget, tick, trajectory]);

  const scrub = useCallback(
    (nextTick: number) => {
      setPlayTarget(null);
      setPlayhead(nextTick);
    },
    [setPlayhead, setPlayTarget]
  );

  return (
    <figure className="showcase-stage" ref={sectionRef}>
      <ol aria-label="Steps in this chapter" className="beat-list">
        {chapter.beats.map((beat, index) => {
          const active = index === activeBeatIndex;
          return (
            <li className={active ? 'active' : ''} key={beat.id}>
              <button
                aria-current={active ? 'step' : undefined}
                onClick={() => activateBeat(index)}
                type="button"
              >
                <span>{index + 1}</span>
                <strong>{beat.title}</strong>
              </button>
            </li>
          );
        })}
      </ol>
      <p aria-live="polite" className="beat-body">
        {activeBeat.body}
      </p>

      <div className="stage-frame">
        {status === 'error' && <p className="run-error">{error}</p>}
        {!trajectory && status !== 'error' && (
          <div className="stage-loading">
            <i /> Solving {definition.shortLabel.toLowerCase()}…
          </div>
        )}
        {trajectory && (
          <ShowcaseScene
            catalog={showcaseScenes}
            fraction={fraction}
            key={`${definition.id}-${view}-${trajectory.meta.seed}`}
            scenario={definition.id}
            tick={tick}
            trajectory={trajectory}
            view={view}
          />
        )}
      </div>

      <ShowcaseTransport
        disabled={!trajectory}
        maxTick={Math.max(0, (trajectory?.meta.T ?? 1) - 1)}
        nextDisabled={activeBeatIndex >= chapter.beats.length - 1}
        onNext={() => activateBeat(activeBeatIndex + 1)}
        onScrub={scrub}
        onTogglePlay={togglePlay}
        playing={playing}
        tick={tick}
      />

      {metric && trajectory && (
        <p className="showcase-metric">
          <span>{metric.label}</span>
          <strong>
            {formatMetric(metricValueAt(definition.id, trajectory, metric, tick), metric)}
          </strong>
        </p>
      )}

      {chapter.charts && trajectory && (
        <ScenarioCharts scenario={definition.id} tick={tick} trajectory={trajectory} />
      )}
    </figure>
  );
}
