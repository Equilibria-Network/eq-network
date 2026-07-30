import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PipelineView from './components/PipelineView';
import ScenarioCharts from './components/ScenarioCharts';
import ShowcaseScene from './components/ShowcaseScene';
import { SimulationClient } from './engine/simulationClient';
import type { MetricDefinition, NumericParams, ScenarioId, Trajectory } from './engine/types';
import { metricValueAt } from './metrics/live';
import { scenarioScenes } from './rendering/scenes';
import { scenarioById, scenarios } from './scenarios/registry';

interface Snapshot {
  scenario: ScenarioId;
  params: NumericParams;
  seed: number;
  trajectory: Trajectory;
}

function scenarioFromLocation(): ScenarioId {
  if (typeof window === 'undefined') return 'combined';
  const queryId = new URLSearchParams(window.location.search).get('scenario');
  const id = (queryId ?? window.location.hash.replace('#', '')) as ScenarioId;
  return id in scenarioById ? id : 'combined';
}

function initialParameters(): Record<ScenarioId, NumericParams> {
  const defaults = Object.fromEntries(
    scenarios.map((scenario) => [scenario.id, { ...scenario.defaults }])
  ) as Record<ScenarioId, NumericParams>;
  if (typeof window === 'undefined') return defaults;
  const query = new URLSearchParams(window.location.search);
  const scenario = scenarioFromLocation();
  const encoded = query.get('p');
  if (!encoded) return defaults;
  try {
    const parsed = JSON.parse(atob(encoded)) as NumericParams;
    defaults[scenario] = { ...defaults[scenario], ...parsed };
  } catch {
    // Invalid shared state falls back to the documented model defaults.
  }
  return defaults;
}

function initialSeeds(): Record<ScenarioId, number> {
  const values = Object.fromEntries(
    scenarios.map((scenario) => [scenario.id, scenario.seed])
  ) as Record<ScenarioId, number>;
  if (typeof window === 'undefined') return values;
  const sharedSeed = Number(new URLSearchParams(window.location.search).get('seed'));
  if (Number.isFinite(sharedSeed) && sharedSeed > 0) values[scenarioFromLocation()] = sharedSeed;
  return values;
}

function formatMetric(value: number, metric: MetricDefinition): string {
  if (!Number.isFinite(value)) return '—';
  if (metric.format === 'percent') return `${Math.round(value * 100)}%`;
  if (metric.format === 'integer') return Math.round(value).toLocaleString();
  if (metric.format === 'points') return `${(value * 100).toFixed(1)} pt`;
  return value.toFixed(3);
}

function metricDelta(value: number, baseline: number, metric: MetricDefinition): string {
  const delta = value - baseline;
  const scaled = metric.format === 'percent' || metric.format === 'points' ? delta * 100 : delta;
  const suffix = metric.format === 'percent' || metric.format === 'points' ? ' pt' : '';
  return `${scaled >= 0 ? '+' : ''}${scaled.toFixed(metric.format === 'integer' ? 0 : 1)}${suffix}`;
}

export default function App() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('combined');
  const definition = scenarioById[scenarioId];
  const [paramsByScenario, setParamsByScenario] =
    useState<Record<ScenarioId, NumericParams>>(initialParameters);
  const [seeds, setSeeds] = useState<Record<ScenarioId, number>>(initialSeeds);
  const params = paramsByScenario[scenarioId];
  const seed = seeds[scenarioId];
  const [runResult, setRunResult] = useState<{
    scenario: ScenarioId;
    trajectory: Trajectory;
    durationMs: number;
  } | null>(null);
  const [status, setStatus] = useState<'running' | 'ready' | 'error'>('running');
  const [error, setError] = useState('');
  const [view, setView] = useState(() => scenarioScenes[scenarioId][0].key);
  const [playhead, setPlayhead] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [baseline, setBaseline] = useState<Snapshot | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  const clientRef = useRef<SimulationClient | null>(null);
  const settingsButtonRef = useRef<HTMLButtonElement | null>(null);
  const settingsHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const trajectory = runResult?.scenario === scenarioId ? runResult.trajectory : null;
  const durationMs = runResult?.scenario === scenarioId ? runResult.durationMs : null;
  const displayStatus = runResult?.scenario === scenarioId ? status : 'running';
  const tick = Math.min(Math.floor(playhead), Math.max(0, (trajectory?.meta.T ?? 1) - 1));
  const fraction = playhead - tick;

  useEffect(() => {
    const client = new SimulationClient();
    clientRef.current = client;
    setScenarioId(scenarioFromLocation());
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const respectMotionPreference = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) setPlaying(false);
    };
    respectMotionPreference(reducedMotion);
    reducedMotion.addEventListener('change', respectMotionPreference);
    return () => {
      reducedMotion.removeEventListener('change', respectMotionPreference);
      client.dispose();
    };
  }, []);

  useEffect(() => {
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#${scenarioId}`
    );
    setPlayhead(0);
    setView(scenarioScenes[scenarioId][0].key);
    setBaseline((current) => (current?.scenario === scenarioId ? current : null));
  }, [scenarioId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStatus('running');
      setError('');
      clientRef.current
        ?.run(scenarioId, params, seed)
        .then((result) => {
          setRunResult({
            scenario: result.scenario,
            trajectory: result.trajectory,
            durationMs: result.durationMs,
          });
          setPlayhead((current) => Math.min(current, result.trajectory.meta.T - 1));
          setStatus('ready');
        })
        .catch((reason: Error) => {
          if (reason.message.includes('terminated')) return;
          setStatus('error');
          setError(reason.message);
        });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [params, scenarioId, seed]);

  useEffect(() => {
    if (!playing || !trajectory) return;
    let request = 0;
    let previous = performance.now();
    let lastDraw = 0;
    const animate = (now: number) => {
      const elapsed = Math.min(0.25, (now - previous) / 1000);
      previous = now;
      if (now - lastDraw >= 40) {
        lastDraw = now;
        setPlayhead((current) => {
          const next = Math.min(current + elapsed * speed * 20, trajectory.meta.T - 1);
          if (next >= trajectory.meta.T - 1) setPlaying(false);
          return next;
        });
      }
      request = window.requestAnimationFrame(animate);
    };
    request = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(request);
  }, [playing, speed, trajectory]);

  useEffect(() => {
    if (!settingsOpen) return;
    settingsHeadingRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSettingsOpen(false);
        window.requestAnimationFrame(() => settingsButtonRef.current?.focus());
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [settingsOpen]);

  const setParameter = useCallback(
    (key: string, value: number | boolean) => {
      setParamsByScenario((current) => ({
        ...current,
        [scenarioId]: { ...current[scenarioId], [key]: value },
      }));
    },
    [scenarioId]
  );

  const applyPreset = useCallback(
    (values: NumericParams) => {
      setParamsByScenario((current) => ({
        ...current,
        [scenarioId]: { ...definition.defaults, ...values },
      }));
    },
    [definition.defaults, scenarioId]
  );

  const groups = useMemo(() => ['world', 'dynamics', 'institutions', 'schedule'] as const, []);
  const activePresetId = useMemo(() => {
    return definition.presets.find((preset) => {
      const candidate = { ...definition.defaults, ...preset.values };
      const keys = new Set([...Object.keys(candidate), ...Object.keys(params)]);
      return [...keys].every((key) => Object.is(candidate[key], params[key]));
    })?.id;
  }, [definition.defaults, definition.presets, params]);

  const closeSettings = useCallback(() => {
    setSettingsOpen(false);
    window.requestAnimationFrame(() => settingsButtonRef.current?.focus());
  }, []);

  const share = async () => {
    const payload = new URLSearchParams({
      scenario: scenarioId,
      seed: String(seed),
      p: btoa(JSON.stringify(params)),
    });
    const url = `${window.location.origin}${window.location.pathname}?${payload}#${scenarioId}`;
    await navigator.clipboard.writeText(url);
    setShareState('copied');
    window.setTimeout(() => setShareState('idle'), 1800);
  };

  const settingsPanel = (
    <section aria-label="Model parameters" className="control-panel details-settings">
      <div className="control-heading">
        <div>
          <p className="eyebrow">Configuration</p>
          <h3 ref={settingsHeadingRef} tabIndex={-1}>
            Model settings
          </h3>
        </div>
        <div className="drawer-actions">
          <button onClick={share} type="button">
            {shareState === 'copied' ? 'Copied' : 'Share run'}
          </button>
          <button aria-label="Return to scenario story" onClick={closeSettings} type="button">
            Story
          </button>
        </div>
      </div>

      <div className="settings-scope">
        <span>Model scope</span>
        <p>{definition.assumption}</p>
        <p>
          This is an explanatory simulation, not a forecast. Results are conditional on these
          assumptions.
        </p>
      </div>

      {groups.map((group) => {
        const controls = definition.parameters.filter((parameter) => parameter.group === group);
        if (!controls.length) return null;
        return (
          <fieldset className="parameter-group" key={group}>
            <legend>{group}</legend>
            {controls.map((parameter) => (
              <div className={`parameter ${parameter.kind}`} key={parameter.key}>
                <div className="parameter-copy">
                  <label htmlFor={`${scenarioId}-${parameter.key}`}>{parameter.label}</label>
                  <span>{parameter.description}</span>
                </div>
                {parameter.kind === 'toggle' ? (
                  <button
                    aria-pressed={Boolean(params[parameter.key])}
                    className="toggle-control"
                    id={`${scenarioId}-${parameter.key}`}
                    onClick={() => setParameter(parameter.key, !params[parameter.key])}
                    type="button"
                  >
                    <i />
                    {params[parameter.key] ? 'ON' : 'OFF'}
                  </button>
                ) : (
                  <div className="range-control">
                    <output htmlFor={`${scenarioId}-${parameter.key}`}>
                      {Number(params[parameter.key]).toFixed(
                        parameter.step && parameter.step < 0.1 ? 2 : 1
                      )}
                      {parameter.unit}
                    </output>
                    <input
                      id={`${scenarioId}-${parameter.key}`}
                      max={parameter.max}
                      min={parameter.min}
                      onChange={(event) => setParameter(parameter.key, Number(event.target.value))}
                      step={parameter.step}
                      type="range"
                      value={Number(params[parameter.key])}
                    />
                  </div>
                )}
              </div>
            ))}
          </fieldset>
        );
      })}

      <div className="run-tools">
        <label>
          Seed
          <input
            inputMode="numeric"
            onChange={(event) =>
              setSeeds((current) => ({
                ...current,
                [scenarioId]: Number(event.target.value) || 1,
              }))
            }
            type="number"
            value={seed}
          />
        </label>
        <button
          onClick={() =>
            setSeeds((current) => ({
              ...current,
              [scenarioId]: Math.floor(Math.random() * 9999) + 1,
            }))
          }
          type="button"
        >
          Reroll
        </button>
      </div>

      <div className="comparison-tools">
        <span>A/B COMPARISON</span>
        {!baseline && (
          <button
            disabled={!trajectory}
            onClick={() =>
              trajectory &&
              setBaseline({ scenario: scenarioId, params: { ...params }, seed, trajectory })
            }
            type="button"
          >
            Pin current run as A
          </button>
        )}
        {baseline && (
          <>
            <p>A is pinned. Every metric now shows the change in B.</p>
            <button onClick={() => setBaseline(null)} type="button">
              Clear comparison
            </button>
          </>
        )}
      </div>
    </section>
  );

  return (
    <div className="playground-shell">
      <section className="simulation-reader" aria-label="Simulation explorer">
        <header className="scenario-header">
          <div>
            <p className="eyebrow">
              {definition.index} / {definition.engine}
            </p>
            <h2>{definition.title}</h2>
            <p className="scenario-question">{definition.question}</p>
          </div>
        </header>

        <nav className="scenario-tabs" aria-label="Scenario chapters">
          <div className="rail-heading">
            <span>Chapters</span>
            <strong>Five pressures</strong>
          </div>
          {scenarios.map((scenario) => (
            <button
              className={scenario.id === scenarioId ? 'active' : ''}
              key={scenario.id}
              onClick={() => setScenarioId(scenario.id)}
              type="button"
            >
              <span>{scenario.index}</span>
              {scenario.shortLabel}
            </button>
          ))}
          <p className="rail-note">
            Read the scenario first. Open settings when you want to inspect the model.
          </p>
        </nav>

        <section className="stage-panel" aria-label="Simulation output">
          <div className="view-tabs" role="tablist" aria-label="Model views">
            {[
              ...scenarioScenes[scenarioId].map(({ key, label }) => ({ key, label })),
              {
                key: 'pipeline',
                label: 'Pipeline',
              },
            ].map((item) => (
              <button
                aria-selected={view === item.key}
                className={view === item.key ? 'active' : ''}
                key={item.key}
                onClick={() => setView(item.key)}
                role="tab"
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="condition-bar" aria-label="Scenario conditions">
            <span>Scenario</span>
            <div className="condition-options">
              {definition.presets.map((preset) => (
                <button
                  aria-pressed={activePresetId === preset.id}
                  className={activePresetId === preset.id ? 'active' : ''}
                  key={preset.id}
                  onClick={() => applyPreset(preset.values)}
                  title={preset.note}
                  type="button"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="transport">
            <div className={`engine-status ${displayStatus}`} aria-live="polite">
              <i />
              <span>
                {displayStatus === 'running' && 'Computing'}
                {displayStatus === 'ready' && `Ready · ${durationMs?.toFixed(0)} ms`}
                {displayStatus === 'error' && 'Run failed'}
              </span>
            </div>
            <div className="transport-cluster">
              <button
                aria-label="Rewind 10 timesteps"
                className="transport-skip"
                disabled={!trajectory}
                onClick={() => setPlayhead((current) => Math.max(0, Math.floor(current) - 10))}
                title="Rewind 10 timesteps"
                type="button"
              >
                −10
              </button>
              <button
                aria-label={playing ? 'Pause simulation' : 'Play simulation'}
                className="transport-button"
                disabled={!trajectory}
                onClick={() => {
                  if (!playing && trajectory && playhead >= trajectory.meta.T - 1) setPlayhead(0);
                  setPlaying((current) => !current);
                }}
                type="button"
              >
                {playing ? 'Ⅱ' : '▶'}
              </button>
              <button
                aria-label="Forward 10 timesteps"
                className="transport-skip"
                disabled={!trajectory}
                onClick={() =>
                  setPlayhead((current) =>
                    Math.min((trajectory?.meta.T ?? 1) - 1, Math.floor(current) + 10)
                  )
                }
                title="Forward 10 timesteps"
                type="button"
              >
                +10
              </button>
            </div>
            <input
              aria-label="Simulation tick"
              max={Math.max(0, (trajectory?.meta.T ?? 1) - 1)}
              min="0"
              onChange={(event) => setPlayhead(Number(event.target.value))}
              type="range"
              value={tick}
            />
            <output className="tick-readout">t = {tick.toString().padStart(3, '0')}</output>
            <label>
              speed
              <select onChange={(event) => setSpeed(Number(event.target.value))} value={speed}>
                <option value="0.5">0.5×</option>
                <option value="1">1×</option>
                <option value="2">2×</option>
                <option value="4">4×</option>
              </select>
            </label>
            <button
              aria-expanded={settingsOpen}
              aria-label={settingsOpen ? 'Return to scenario story' : 'Open model settings'}
              className="settings-trigger player-settings"
              onClick={() => (settingsOpen ? closeSettings() : setSettingsOpen(true))}
              ref={settingsButtonRef}
              title={settingsOpen ? 'Return to scenario story' : 'Model settings'}
              type="button"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path
                  d={
                    settingsOpen
                      ? 'M4 5h6a3 3 0 0 1 3 3v11a3 3 0 0 0-3-3H4zM20 5h-6a3 3 0 0 0-3 3v11a3 3 0 0 1 3-3h6z'
                      : 'M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M7 14v6'
                  }
                />
              </svg>
              <span>{settingsOpen ? 'Story' : 'Settings'}</span>
            </button>
          </div>

          <div className="metric-grid" aria-label="Live outcome metrics">
            {definition.metrics.map((metric) => {
              const value = trajectory
                ? metricValueAt(scenarioId, trajectory, metric, tick)
                : Number.NaN;
              const comparableBaseline = baseline?.scenario === scenarioId ? baseline : null;
              const baselineValue = comparableBaseline
                ? metricValueAt(
                    scenarioId,
                    comparableBaseline.trajectory,
                    metric,
                    Math.min(tick, comparableBaseline.trajectory.meta.T - 1)
                  )
                : Number.NaN;
              return (
                <article className="metric-card" key={metric.key}>
                  <p>{metric.label}</p>
                  <strong data-metric={metric.key}>{formatMetric(value, metric)}</strong>
                  {comparableBaseline && Number.isFinite(baselineValue) && (
                    <span className="metric-delta">
                      vs A {metricDelta(value, baselineValue, metric)}
                    </span>
                  )}
                </article>
              );
            })}
          </div>

          <div className="stage-frame">
            {status === 'error' && <p className="run-error">{error}</p>}
            {!trajectory && status !== 'error' && (
              <div className="stage-loading">
                <i /> Solving {definition.shortLabel.toLowerCase()}…
              </div>
            )}
            {trajectory && view === 'pipeline' && <PipelineView trajectory={trajectory} />}
            {trajectory && view !== 'pipeline' && (
              <ShowcaseScene
                fraction={fraction}
                key={`${scenarioId}-${view}-${trajectory.meta.seed}`}
                scenario={scenarioId}
                tick={tick}
                trajectory={trajectory}
                view={view}
              />
            )}
          </div>

          {trajectory && (
            <ScenarioCharts scenario={scenarioId} tick={tick} trajectory={trajectory} />
          )}
        </section>

        <aside
          className="details-panel story-panel"
          aria-label={settingsOpen ? 'Model settings' : `${definition.title} explanation`}
        >
          {settingsOpen ? (
            settingsPanel
          ) : (
            <>
              <header>
                <p className="eyebrow">Scenario guide</p>
                <h3>What is happening?</h3>
                <p>{definition.description}</p>
              </header>
              <div className="story-beats" aria-label="Scenario interpretation">
                <article>
                  <span>01 · Set-up</span>
                  <p>{definition.story.setup}</p>
                </article>
                <article>
                  <span>02 · Pressure</span>
                  <p>{definition.story.pressure}</p>
                </article>
                <article>
                  <span>03 · Intervention</span>
                  <p>{definition.story.intervention}</p>
                </article>
                <article>
                  <span>04 · Read the result</span>
                  <p>{definition.story.reading}</p>
                </article>
              </div>
            </>
          )}
        </aside>
      </section>
    </div>
  );
}
