import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ScenarioCharts from '../components/ScenarioCharts';
import ShowcaseScene from '../components/ShowcaseScene';
import { SimulationClient } from '../engine/simulationClient';
import type { NumericParams, ScenarioDefinition, Trajectory } from '../engine/types';
import { metricValueAt } from '../metrics/live';
import { formatMetric } from './format';
import { showcaseScenes } from './scenes';
import ShowcaseTransport from './ShowcaseTransport';
import type { ShowcaseChapter } from './types';
import { usePlayback } from './usePlayback';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface Props {
  chapter: ShowcaseChapter;
  definition: ScenarioDefinition;
}

/** The playable ending: the coupled world with a reduced tray — the
    chapter's three dial groups of four registry parameters each, preset
    chips as starting points, run-on-change. Seed and horizon stay fixed;
    the full playground is linked below for everything else. */
export default function PlaygroundLite({ chapter, definition }: Props) {
  const chips = useMemo(
    () =>
      (chapter.presetChips ?? [])
        .map((id) => definition.presets.find((preset) => preset.id === id))
        .filter((preset) => preset !== undefined),
    [chapter.presetChips, definition.presets]
  );
  const dials = useMemo(
    () =>
      (chapter.dialGroups ?? []).map((group) => ({
        ...group,
        controls: group.params
          .map((key) => definition.parameters.find((parameter) => parameter.key === key))
          .filter((parameter) => parameter !== undefined),
      })),
    [chapter.dialGroups, definition.parameters]
  );
  const [params, setParams] = useState<NumericParams>(() => ({
    ...definition.defaults,
    ...(chips[0]?.values ?? {}),
  }));
  const [trajectory, setTrajectory] = useState<Trajectory | null>(null);
  const [status, setStatus] = useState<'running' | 'ready' | 'error'>('running');
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const firstRunRef = useRef(true);
  const clientRef = useRef<SimulationClient | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { tick, fraction, playing, setPlayhead, setPlaying, setPlayTarget } =
    usePlayback(trajectory);

  const metric = chapter.headlineMetric
    ? definition.metrics.find((candidate) => candidate.key === chapter.headlineMetric)
    : undefined;
  const view = showcaseScenes[definition.id][0].key;

  const activePresetId = useMemo(() => {
    return chips.find((preset) => {
      const candidate = { ...definition.defaults, ...preset.values };
      const keys = new Set([...Object.keys(candidate), ...Object.keys(params)]);
      return [...keys].every((key) => Object.is(candidate[key], params[key]));
    })?.id;
  }, [chips, definition.defaults, params]);

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

  useEffect(() => {
    if (!started) return;
    setStatus('running');
    setError('');
    const timer = window.setTimeout(() => {
      clientRef.current
        ?.run(definition.id, params, definition.seed)
        .then((result) => {
          setTrajectory(result.trajectory);
          setStatus('ready');
          setPlayhead((current) => Math.min(current, result.trajectory.meta.T - 1));
          if (firstRunRef.current) {
            firstRunRef.current = false;
            setPlayTarget(null);
            setPlaying(!prefersReducedMotion());
          }
        })
        .catch((reason: Error) => {
          if (reason.message.includes('terminated')) return;
          setStatus('error');
          setError(reason.message);
        });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [definition.id, definition.seed, params, setPlayhead, setPlaying, setPlayTarget, started]);

  const setParameter = useCallback((key: string, value: number) => {
    setParams((current) => ({ ...current, [key]: value }));
  }, []);

  const applyChip = useCallback(
    (values: NumericParams) => {
      setParams({ ...definition.defaults, ...values });
    },
    [definition.defaults]
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
    <figure className="showcase-stage lite-stage" ref={sectionRef}>
      <div aria-label="Starting points" className="lite-chips" role="group">
        <span>Start from</span>
        {chips.map((preset) => (
          <button
            aria-pressed={activePresetId === preset.id}
            className={activePresetId === preset.id ? 'active' : ''}
            key={preset.id}
            onClick={() => applyChip(preset.values)}
            title={preset.note}
            type="button"
          >
            {preset.label}
          </button>
        ))}
      </div>

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
            key={`lite-${definition.id}-${trajectory.meta.seed}`}
            scenario={definition.id}
            tick={tick}
            trajectory={trajectory}
            view={view}
          />
        )}
      </div>

      <ShowcaseTransport
        disabled={!trajectory}
        hideNext
        maxTick={Math.max(0, (trajectory?.meta.T ?? 1) - 1)}
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

      <div className="lite-tray">
        {dials.map((group) => (
          <fieldset className="lite-group" key={group.id}>
            <legend>{group.label}</legend>
            <p className="lite-blurb">{group.blurb}</p>
            {group.controls.map((parameter) => (
              <div className="lite-dial" key={parameter.key} title={parameter.description}>
                <label htmlFor={`lite-${parameter.key}`}>
                  {parameter.label}
                  {parameter.type && (
                    <em className={`param-type ${parameter.type}`}>{parameter.type}</em>
                  )}
                </label>
                <div className="range-control">
                  <output htmlFor={`lite-${parameter.key}`}>
                    {Number(params[parameter.key]).toFixed(
                      parameter.step && parameter.step < 0.1 ? 2 : 1
                    )}
                    {parameter.unit}
                  </output>
                  <input
                    id={`lite-${parameter.key}`}
                    max={parameter.max}
                    min={parameter.min}
                    onChange={(event) => setParameter(parameter.key, Number(event.target.value))}
                    step={parameter.step}
                    type="range"
                    value={Number(params[parameter.key])}
                  />
                </div>
              </div>
            ))}
          </fieldset>
        ))}
      </div>

      {chapter.charts && trajectory && (
        <ScenarioCharts scenario={definition.id} tick={tick} trajectory={trajectory} />
      )}
    </figure>
  );
}
