import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import PipelineView from './components/PipelineView';
import ResizableRailHandle from './components/ResizableRailHandle';
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

type DetailsMode = 'settings' | 'closed';

function PlayerIcon({ name }: { name: string }) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className="player-icon"
      src={`/img/icons/playground/${name}.svg`}
    />
  );
}

function scenarioFromLocation(): ScenarioId {
  if (typeof window === 'undefined') return 'commons';
  const queryId = new URLSearchParams(window.location.search).get('scenario');
  const id = (queryId ?? window.location.hash.replace('#', '')) as ScenarioId;
  return id in scenarioById ? id : 'commons';
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
  const [scenarioId, setScenarioId] = useState<ScenarioId>('commons');
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
  const [playTarget, setPlayTarget] = useState<number | null>(null);
  const [baseline, setBaseline] = useState<Snapshot | null>(null);
  const [detailsMode, setDetailsMode] = useState<DetailsMode>('closed');
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [leftRailWidth, setLeftRailWidth] = useState(480);
  const [rightRailWidth, setRightRailWidth] = useState(340);
  const clientRef = useRef<SimulationClient | null>(null);
  const settingsButtonRef = useRef<HTMLButtonElement | null>(null);
  const settingsHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const trajectory = runResult?.scenario === scenarioId ? runResult.trajectory : null;
  const durationMs = runResult?.scenario === scenarioId ? runResult.durationMs : null;
  const displayStatus = runResult?.scenario === scenarioId ? status : 'running';
  const tick = Math.min(Math.floor(playhead), Math.max(0, (trajectory?.meta.T ?? 1) - 1));
  const fraction = playhead - tick;
  const readerStyle = {
    '--pg-left-rail-width': `${leftRailWidth}px`,
    '--pg-right-rail-width': `${rightRailWidth}px`,
  } as CSSProperties;

  useEffect(() => {
    const client = new SimulationClient();
    clientRef.current = client;
    const syncScenarioFromLocation = () => setScenarioId(scenarioFromLocation());
    syncScenarioFromLocation();
    window.addEventListener('hashchange', syncScenarioFromLocation);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const respectMotionPreference = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) setPlaying(false);
    };
    respectMotionPreference(reducedMotion);
    reducedMotion.addEventListener('change', respectMotionPreference);
    return () => {
      window.removeEventListener('hashchange', syncScenarioFromLocation);
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
    setPlayTarget(null);
    setPlaying(false);
    setActiveStoryIndex(0);
    setView(definition.story[0]?.view ?? scenarioScenes[scenarioId][0].key);
    setBaseline((current) => (current?.scenario === scenarioId ? current : null));
  }, [definition.story, scenarioId]);

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
          const end = Math.min(playTarget ?? trajectory.meta.T - 1, trajectory.meta.T - 1);
          const next = Math.min(current + elapsed * speed * 20, end);
          if (next >= end) {
            setPlaying(false);
            setPlayTarget(null);
          }
          return next;
        });
      }
      request = window.requestAnimationFrame(animate);
    };
    request = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(request);
  }, [playTarget, playing, speed, trajectory]);

  useEffect(() => {
    if (detailsMode === 'closed') return;
    if (detailsMode === 'settings') settingsHeadingRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDetailsMode('closed');
        window.requestAnimationFrame(() => settingsButtonRef.current?.focus());
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [detailsMode]);

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

  const closeDetails = useCallback(() => {
    setDetailsMode('closed');
    window.requestAnimationFrame(() => settingsButtonRef.current?.focus());
  }, []);

  const activateStoryStep = useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(index, definition.story.length - 1));
      const step = definition.story[nextIndex];
      if (!step) return;
      const preset = definition.presets.find((candidate) => candidate.id === step.preset);
      if (preset) applyPreset(preset.values);
      setActiveStoryIndex(nextIndex);
      setView(step.view);
      setPlayhead(step.tick);
      setPlayTarget(step.playTo ?? null);
      if (step.speed) setSpeed(step.speed);
      setPlaying(
        Boolean(step.playTo) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    },
    [applyPreset, definition.presets, definition.story]
  );

  const settingsPanel = (
    <section aria-label="Model parameters" className="control-panel details-settings">
      <div className="control-heading">
        <div>
          <p className="eyebrow">Configuration</p>
          <h3 ref={settingsHeadingRef} tabIndex={-1}>
            Model settings
          </h3>
        </div>
        <button
          aria-label="Close model settings"
          className="panel-close"
          onClick={closeDetails}
          title="Close panel"
          type="button"
        >
          <PlayerIcon name="close" />
        </button>
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
          <PlayerIcon name="reset" />
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

      <div className="configuration-notes">
        <section>
          <span>Evidence anchor</span>
          <p>{definition.evidence}</p>
        </section>
        <section>
          <span>Modelling assumptions</span>
          <p>{definition.assumption}</p>
          <ul>
            {definition.modellingNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <p>
            Fixed-rule agents; hand-set parameters; no empirical fit. This is an explanatory
            simulation, not a forecast.
          </p>
        </section>
      </div>
    </section>
  );

  return (
    <div className="playground-shell">
      <section
        className={`simulation-reader ${detailsMode === 'closed' ? 'details-closed' : ''}`}
        aria-label="Simulation explorer"
        style={readerStyle}
      >
        <header className="scenario-header">
          <div>
            <p className="eyebrow">
              {definition.index} / {definition.engine}
            </p>
            <h2>{definition.title}</h2>
            <p className="scenario-question">{definition.question}</p>
          </div>
        </header>

        <nav className="scenario-tabs" aria-label="Scenarios and story sections">
          <div className="rail-heading">
            <strong>Scenario Guide</strong>
          </div>
          <ol className="scenario-list">
            {scenarios.map((scenario, scenarioIndex) => {
              const expanded = scenario.id === scenarioId;
              return (
                <li className={expanded ? 'active' : ''} key={scenario.id}>
                  <button
                    aria-expanded={expanded}
                    className="scenario-toggle"
                    onClick={() => setScenarioId(scenario.id)}
                    type="button"
                  >
                    <span>{scenarioIndex + 1}</span>
                    <strong>{scenario.shortLabel}</strong>
                  </button>
                  {expanded && (
                    <div className="scenario-story">
                      <p>{scenario.description}</p>
                      <ol>
                        {scenario.story.map((step, storyIndex) => {
                          const active = storyIndex === activeStoryIndex;
                          return (
                            <li className={active ? 'active' : ''} key={step.id}>
                              <button
                                aria-expanded={active}
                                aria-current={active ? 'step' : undefined}
                                onClick={() => activateStoryStep(storyIndex)}
                                type="button"
                              >
                                <span>
                                  {scenarioIndex + 1}.{storyIndex + 1}
                                </span>
                                <strong>{step.title}</strong>
                              </button>
                              {active && <p aria-live="polite">{step.body}</p>}
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
          <p className="rail-note">Choose a section to stage and play that part of the model.</p>
        </nav>

        <ResizableRailHandle
          label="Resize scenario guide"
          max={480}
          min={320}
          onChange={setLeftRailWidth}
          resetValue={480}
          side="left"
          value={leftRailWidth}
        />

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
                onClick={() => {
                  setPlayTarget(null);
                  setPlayhead((current) => Math.max(0, Math.floor(current) - 10));
                }}
                title="Rewind 10 timesteps"
                type="button"
              >
                <PlayerIcon name="rewind-10" />
              </button>
              <button
                aria-label={playing ? 'Pause simulation' : 'Play simulation'}
                className="transport-button"
                disabled={!trajectory}
                onClick={() => {
                  setPlayTarget(null);
                  if (!playing && trajectory && playhead >= trajectory.meta.T - 1) setPlayhead(0);
                  setPlaying((current) => !current);
                }}
                type="button"
              >
                <PlayerIcon name={playing ? 'pause' : 'play'} />
              </button>
              <button
                aria-label="Forward 10 timesteps"
                className="transport-skip"
                disabled={!trajectory}
                onClick={() => {
                  setPlayTarget(null);
                  setPlayhead((current) =>
                    Math.min((trajectory?.meta.T ?? 1) - 1, Math.floor(current) + 10)
                  );
                }}
                title="Forward 10 timesteps"
                type="button"
              >
                <PlayerIcon name="forward-10" />
              </button>
            </div>
            <input
              aria-label="Simulation tick"
              max={Math.max(0, (trajectory?.meta.T ?? 1) - 1)}
              min="0"
              onChange={(event) => {
                setPlayTarget(null);
                setPlayhead(Number(event.target.value));
              }}
              type="range"
              value={tick}
            />
            <output className="tick-readout">t = {tick.toString().padStart(3, '0')}</output>
            <label className="speed-control">
              <PlayerIcon name="speed" />
              <span className="visually-hidden">Playback speed</span>
              <select onChange={(event) => setSpeed(Number(event.target.value))} value={speed}>
                <option value="0.5">0.5×</option>
                <option value="1">1×</option>
                <option value="2">2×</option>
                <option value="4">4×</option>
              </select>
            </label>
            <button
              aria-expanded={detailsMode === 'settings'}
              aria-pressed={detailsMode === 'settings'}
              aria-label="Open model settings"
              className="settings-trigger player-settings"
              onClick={() => setDetailsMode(detailsMode === 'settings' ? 'closed' : 'settings')}
              ref={settingsButtonRef}
              title="Model settings"
              type="button"
            >
              <PlayerIcon name="settings" />
              <span>Settings</span>
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

        {detailsMode === 'settings' && (
          <>
            <ResizableRailHandle
              label="Resize model settings"
              max={420}
              min={300}
              onChange={setRightRailWidth}
              resetValue={340}
              side="right"
              value={rightRailWidth}
            />
            <aside className="details-panel" aria-label="Model settings">
              {settingsPanel}
            </aside>
          </>
        )}
      </section>

      <section className="model-reading-guide" aria-labelledby="model-reading-title">
        <div className="reading-guide-intro">
          <p className="eyebrow">Reading the laboratory</p>
          <h2 id="model-reading-title">These are toy models, not forecasts.</h2>
          <p>
            Twenty to forty agents, a handful of equations each, and numbers set by hand: nothing
            here is fitted to data. A run can show direction and ordering inside one small world we
            wrote down — whether a defense helps, and which of two helps more.
          </p>
          <p>
            Nothing here pushes back. Every agent follows a fixed rule for all 500 ticks. A quota is
            broken by a coin flip, not by someone who found its loophole; a sanction confiscates but
            never teaches; a tax is paid and never restructured around. Real systems doing the
            disempowering may actively optimize around limits. This build has no such agent yet.
          </p>
        </div>
        <div className="reading-principles">
          <article>
            <span>01</span>
            <h3>A defense that fails here really fails.</h3>
            <p>
              It lost to opponents that never once tried to route around it. Failures are the strong
              result.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>A defense that holds has passed the easy test.</h3>
            <p>
              Quotas, caps, sanctions, and taxes are the first limits an optimizer would probe.
              Treat every defended run as an upper bound on how well that defense might work.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>The floors are ours, not the world’s.</h3>
            <p>
              A share stops falling because of a rule we wrote — a reversion rate, a frozen
              listening pattern, or another fixed mechanism. Each scenario names its floor; the
              sliders let you test it.
            </p>
          </article>
          <article>
            <span>04</span>
            <h3>Nothing here is a point of no return.</h3>
            <p>
              Every quantity is a rate or a level. Move a slider back and the modeled world returns.
              Irreversible change is part of the story this version does not yet model.
            </p>
          </article>
          <article>
            <span>05</span>
            <h3>Adaptive agents are the next hard test.</h3>
            <p>
              The library has a learnable policy, but no scenario uses it yet. Until defenses face
              agents that adapt to them, this laboratory presents the optimistic case.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
