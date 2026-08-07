import { useCallback, useEffect, useRef, useState } from 'react';
import PlayerIcon from '../../components/PlayerIcon';
import ScenarioCharts from '../../components/ScenarioCharts';
import ShowcaseScene from '../../components/ShowcaseScene';
import type { Trajectory } from '../../engine/types';
import { metricValueAt } from '../../metrics/live';
import { scenarioById } from '../../scenarios/registry';
import { formatMetric } from '../format';
import { showcaseScenes } from '../scenes';
import { usePlayback } from '../usePlayback';
import InfluenceDiagram from './InfluenceDiagram';
import { getTrajectory, resolveRunSpec } from './trajectoryCache';
import type { ScrollSegment } from './types';

interface Staging {
  tick: number;
  playTo?: number;
  speed?: number;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface Props {
  segment: ScrollSegment;
  /** The active step id, handed down from the scroll essay. */
  state: string;
}

/** The sticky figure of one scroll segment. Same staging semantics as
    ChapterStage (apply preset, cut to tick, autoplay to playTo) but driven
    by the scroll position instead of beat tabs, with no transport — the
    reader clicks nothing. Trajectories come from the shared precomputed
    cache, so a step change is a playback cut, not a run. */
export default function ScrollStage({ segment, state }: Props) {
  const definition = segment.scenario ? scenarioById[segment.scenario] : undefined;
  const step = segment.steps.find((candidate) => candidate.id === state) ?? segment.steps[0];
  const stage = step.stage;

  const [trajectory, setTrajectory] = useState<Trajectory | null>(null);
  const [status, setStatus] = useState<'running' | 'ready' | 'error'>('running');
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const figureRef = useRef<HTMLElement>(null);
  const trajectoryRef = useRef<Trajectory | null>(null);
  const specKeyRef = useRef('');
  const startedRef = useRef(false);
  /** Re-applies the active step's staging; kept current by the staging
      effect so scrolling back into a segment restarts its run. */
  const replayRef = useRef<() => void>(() => {});
  const { tick, fraction, playing, setPlayhead, setPlaying, setSpeed, setPlayTarget } =
    usePlayback(trajectory);

  const metric =
    segment.headlineMetric && definition
      ? definition.metrics.find((candidate) => candidate.key === segment.headlineMetric)
      : undefined;

  useEffect(() => {
    const node = figureRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      startedRef.current = true;
      setStarted(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (!visible) {
          setPlaying(false);
          return;
        }
        if (startedRef.current) {
          // Returning to a segment that already ran: the exit paused it and
          // no step change will fire, so restage the active step here.
          replayRef.current();
        } else {
          startedRef.current = true;
          setStarted(true);
        }
      },
      { rootMargin: '160px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [setPlaying]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const respectMotionPreference = (event: MediaQueryListEvent) => {
      if (event.matches) setPlaying(false);
    };
    reducedMotion.addEventListener('change', respectMotionPreference);
    return () => reducedMotion.removeEventListener('change', respectMotionPreference);
  }, [setPlaying]);

  const applyStaging = useCallback(
    (staging: Staging, lastTick: number) => {
      const target = staging.playTo !== undefined ? Math.min(staging.playTo, lastTick) : null;
      if (prefersReducedMotion()) {
        // Reduced motion communicates the step by its final frame.
        setPlayhead(target ?? Math.min(staging.tick, lastTick));
        setPlayTarget(null);
        setPlaying(false);
        return;
      }
      setPlayhead(Math.min(staging.tick, lastTick));
      setPlayTarget(target);
      if (staging.speed) setSpeed(staging.speed);
      setPlaying(target !== null);
    },
    [setPlayhead, setPlayTarget, setPlaying, setSpeed]
  );

  useEffect(() => {
    if (!started) return;
    if (stage.kind !== 'run' || !definition) {
      replayRef.current = () => {};
      setPlaying(false);
      return;
    }
    const staging: Staging = { tick: stage.tick, playTo: stage.playTo, speed: stage.speed };
    const spec = resolveRunSpec(definition, stage);
    if (spec.key === specKeyRef.current && trajectoryRef.current) {
      const lastTick = trajectoryRef.current.meta.T - 1;
      replayRef.current = () => applyStaging(staging, lastTick);
      applyStaging(staging, lastTick);
      return;
    }
    let cancelled = false;
    setStatus('running');
    setError('');
    getTrajectory(definition, stage)
      .then((result) => {
        if (cancelled) return;
        specKeyRef.current = spec.key;
        trajectoryRef.current = result;
        setTrajectory(result);
        setStatus('ready');
        const lastTick = result.meta.T - 1;
        replayRef.current = () => applyStaging(staging, lastTick);
        applyStaging(staging, lastTick);
      })
      .catch((reason: Error) => {
        if (cancelled) return;
        setStatus('error');
        setError(reason.message);
      });
    return () => {
      cancelled = true;
    };
  }, [applyStaging, definition, setPlaying, stage, started]);

  /** The manual backup (owner direction 2026-08-07): autoplay on view stays
      the default, but every run stage carries play/pause so a stalled stage
      can always be started by hand. Play resumes toward the step's target,
      or replays the step from its cut when it already finished; an explicit
      gesture also overrides reduced-motion stillness. */
  const togglePlay = useCallback(() => {
    if (playing) {
      setPlaying(false);
      return;
    }
    const current = trajectoryRef.current;
    if (stage.kind !== 'run' || !current) return;
    const lastTick = current.meta.T - 1;
    const target = stage.playTo !== undefined ? Math.min(stage.playTo, lastTick) : lastTick;
    if (tick >= target) setPlayhead(Math.min(stage.tick, lastTick));
    if (stage.speed) setSpeed(stage.speed);
    setPlayTarget(target);
    setPlaying(true);
  }, [playing, setPlayhead, setPlaying, setPlayTarget, setSpeed, stage, tick]);

  return (
    <figure className="showcase-stage scroll-stage" ref={figureRef}>
      <div className={stage.kind === 'diagram' ? 'stage-frame stage-frame-diagram' : 'stage-frame'}>
        {stage.kind === 'diagram' && <InfluenceDiagram />}
        {stage.kind === 'placeholder' && (
          <div aria-label={stage.label} className="scroll-placeholder" role="img">
            <strong>{stage.label}</strong>
            <span>{stage.note}</span>
          </div>
        )}
        {stage.kind === 'run' && status === 'error' && <p className="run-error">{error}</p>}
        {stage.kind === 'run' && !trajectory && status !== 'error' && definition && (
          <div className="stage-loading">
            <i /> Solving {definition.shortLabel.toLowerCase()}…
          </div>
        )}
        {stage.kind === 'run' && trajectory && definition && (
          <ShowcaseScene
            catalog={showcaseScenes}
            fraction={fraction}
            key={`${definition.id}-${stage.view}-${trajectory.meta.seed}`}
            scenario={definition.id}
            tick={tick}
            trajectory={trajectory}
            view={stage.view}
          />
        )}
        {stage.kind === 'run' && trajectory && (
          <button
            aria-label={playing ? 'Pause the run' : 'Play the run'}
            className="transport-button scroll-play"
            onClick={togglePlay}
            type="button"
          >
            <PlayerIcon name={playing ? 'pause' : 'play'} />
          </button>
        )}
      </div>

      {stage.kind === 'run' && metric && trajectory && definition && (
        <p className="showcase-metric">
          <span>{metric.label}</span>
          <strong>
            {formatMetric(metricValueAt(definition.id, trajectory, metric, tick), metric)}
          </strong>
        </p>
      )}

      {stage.kind === 'run' && segment.charts && trajectory && definition && (
        <ScenarioCharts scenario={definition.id} tick={tick} trajectory={trajectory} />
      )}
    </figure>
  );
}
