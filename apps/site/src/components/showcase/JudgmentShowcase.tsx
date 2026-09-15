// /showcase/judgment — the WP4 model replayed from an engine-exported
// bundle. The page never simulates: it fetches manifest.json, scalars.json,
// and the playback cells the script names from
// /lab/runs/delegated-judgment-erosion-v1/, then selects and draws
// (docs/dial-lattice-design.md in the library: "the web page is SELECTION
// over real runs, never computation"). Copy is in content/judgment.ts; cell
// coordinates and step timings are the script below.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { VisualEssayDocument, VisualEssayRendererProps } from '@components/visual-essay/types';
import VisualEssay from '@components/visual-essay/VisualEssay';
import {
  judgmentClosing,
  judgmentIntro,
  judgmentLinks,
  judgmentRules,
} from '@content/judgment';
// The playground's showcase-scroll entry carries the shell styles every
// showcase page shares (eyebrow, showcase-column, link cards); nothing from
// its simulation side is used here.
import '@eq-network/playground/showcase-scroll';
import styles from './JudgmentShowcase.module.css';

// --- the bundle on the wire (schema_version 2, contract 1.1) ---------------

const BUNDLE = '/lab/runs/delegated-judgment-erosion-v1';

interface Axis {
  name: string;
  label: string;
  values: number[];
  param_type: string;
  anchor?: string;
}

interface MetricSpec {
  id: string;
  label: string;
  direction: 'up_good' | 'down_good' | 'neutral';
}

interface Overlay {
  id: string;
  kind: string;
  label: string;
  x_axis?: string;
  y_axis?: string;
  points?: number[][];
}

interface Manifest {
  bundle_id: string;
  T: number;
  n_seeds: number;
  axes: Axis[];
  default_cell: number[];
  overlays: Overlay[];
  metrics: MetricSpec[];
  playback: { cells: number[][] };
  base_config: Record<string, number | string>;
}

interface Scalars {
  shape: number[];
  metrics: Record<string, { point: number[]; lo?: number[]; hi?: number[] }>;
  has_run: number[];
}

interface Run {
  meta: { T: number; N: number; seed: number; scalars: Record<string, number> };
  global: Record<string, number[]>;
  node: Record<string, number[]>;
}

type Cell = [number, number, number];

const cellKey = (cell: Cell) => `c-${cell[0]}-${cell[1]}-${cell[2]}`;

function flatIndex(shape: number[], cell: Cell) {
  return (cell[0] * shape[1] + cell[1]) * shape[2] + cell[2];
}

const runCache = new Map<string, Promise<Run>>();

function fetchRun(cell: Cell): Promise<Run> {
  const key = cellKey(cell);
  let pending = runCache.get(key);
  if (!pending) {
    pending = fetch(`${BUNDLE}/runs/${key}.json`).then((response) => {
      if (!response.ok) throw new Error(`no run for ${key}`);
      return response.json() as Promise<Run>;
    });
    runCache.set(key, pending);
  }
  return pending;
}

function useBundle() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [scalars, setScalars] = useState<Scalars | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`${BUNDLE}/manifest.json`).then((r) => r.json() as Promise<Manifest>),
      fetch(`${BUNDLE}/scalars.json`).then((r) => r.json() as Promise<Scalars>),
    ])
      .then(([m, s]) => {
        if (cancelled) return;
        setManifest(m);
        setScalars(s);
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : String(reason));
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return { manifest, scalars, error };
}

function useRun(cell: Cell | null) {
  const [run, setRun] = useState<Run | null>(null);
  const key = cell ? cellKey(cell) : null;
  useEffect(() => {
    if (!cell) return;
    let cancelled = false;
    setRun(null);
    fetchRun(cell)
      .then((loaded) => {
        if (!cancelled) setRun(loaded);
      })
      .catch(() => {
        if (!cancelled) setRun(null);
      });
    return () => {
      cancelled = true;
    };
    // the key is the cell's identity; the tuple itself is rebuilt each render
  }, [key]);
  return run;
}

// --- playback: a playhead in ticks, auto-playing from `tick` to `playTo` -----

interface Stage {
  cell: Cell;
  tick: number;
  playTo: number;
  /** ticks per second */
  rate: number;
}

function usePlayhead(stage: Stage, T: number) {
  const [tick, setTick] = useState(stage.tick);
  const [playing, setPlaying] = useState(true);
  const stageRef = useRef(stage);
  useEffect(() => {
    stageRef.current = stage;
    setTick(stage.tick);
    setPlaying(true);
  }, [stage]);
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let previous = performance.now();
    const step = (now: number) => {
      const elapsed = Math.min(0.25, (now - previous) / 1000);
      previous = now;
      setTick((current) => {
        const end = Math.min(stageRef.current.playTo, T - 1);
        const next = Math.min(current + elapsed * stageRef.current.rate, end);
        if (next >= end) setPlaying(false);
        return next;
      });
      frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [playing, T]);
  return { tick: Math.min(Math.floor(tick), T - 1), playing, setPlaying, setTick };
}

// --- drawing --------------------------------------------------------------------

const NAVY = 'var(--pg-navy, #1f2a44)';
const BLUE = 'var(--pg-blue, #2563eb)';
const MUTED = 'var(--pg-muted, #7b8494)';
const LINE = 'var(--pg-line, #d8dce3)';
const PAPER = 'var(--pg-white, #ffffff)';
const FAULT = 'rgba(120, 126, 140, 0.16)';

/** pale paper -> navy by judgment left */
function skillFill(s: number) {
  const t = Math.max(0, Math.min(1, s));
  const r = Math.round(236 + (31 - 236) * t);
  const g = Math.round(239 + (42 - 239) * t);
  const b = Math.round(245 + (68 - 245) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function reliabilityFill(q: number) {
  const t = Math.max(0, Math.min(1, q));
  const v = Math.round(224 - 150 * t);
  return `rgb(${v}, ${v}, ${v})`;
}

interface InstitutionProps {
  run: Run;
  tick: number;
  faultOnset: number;
  faultLength: number;
}

function Institution({ run, tick, faultOnset, faultLength }: InstitutionProps) {
  const { N } = run.meta;
  const skill = run.node.skill;
  const delegation = run.node.delegation;
  const q = run.global.ai_reliability[tick] ?? 0;
  const faulted = tick >= faultOnset && tick < faultOnset + faultLength;
  const cols = 6;
  const rows = Math.ceil(N / cols);
  const x0 = 34;
  const y0 = 34;
  const dx = 46;
  const dy = 46;
  const aiX = 372;
  const aiY = y0 + ((rows - 1) * dy) / 2;
  const workers = Array.from({ length: N }, (_, i) => ({
    x: x0 + (i % cols) * dx,
    y: y0 + Math.floor(i / cols) * dy,
    // a run switch can render one frame with a stale tick: guard the lookups
    s: skill[tick * N + i] ?? 0,
    d: delegation[tick * N + i] ?? 0,
  }));
  return (
    <svg viewBox="0 0 440 260" role="img" aria-label="The institution: thirty workers and one AI system">
      <rect x="0" y="0" width="440" height="260" fill={PAPER} />
      {workers.map((w, i) => (
        <line
          key={`l${i}`}
          x1={w.x}
          y1={w.y}
          x2={aiX - 22}
          y2={aiY}
          stroke={faulted ? '#D55E00' : BLUE}
          strokeWidth={0.6 + 1.6 * w.d}
          strokeOpacity={0.06 + 0.5 * w.d}
        />
      ))}
      {workers.map((w, i) => (
        <circle
          key={`w${i}`}
          cx={w.x}
          cy={w.y}
          r={12}
          fill={skillFill(w.s)}
          stroke={NAVY}
          strokeWidth={0.8}
        />
      ))}
      <rect
        x={aiX - 22}
        y={aiY - 22}
        width={44}
        height={44}
        rx={4}
        fill={reliabilityFill(q)}
        stroke={faulted ? '#D55E00' : NAVY}
        strokeWidth={faulted ? 2.4 : 1}
      />
      <text x={aiX} y={aiY + 38} textAnchor="middle" fontSize="9" fill={MUTED} fontFamily="IBM Plex Mono, monospace">
        AI · right {Math.round(q * 100)}%
      </text>
      <text x={x0 - 12} y={y0 + rows * dy - 6} fontSize="9" fill={MUTED} fontFamily="IBM Plex Mono, monospace">
        workers · fill = judgment left · lines = decisions handed over
      </text>
    </svg>
  );
}

interface VitalProps {
  label: string;
  series: number[];
  tick: number;
  faultOnset: number;
  faultLength: number;
  domain: [number, number];
  format: (v: number) => string;
}

function Vital({ label, series, tick, faultOnset, faultLength, domain, format }: VitalProps) {
  const W = 220;
  const H = 40;
  const T = series.length;
  const sx = (t: number) => (t / (T - 1)) * W;
  const sy = (v: number) => H - ((v - domain[0]) / (domain[1] - domain[0])) * H;
  const path = (upTo: number) =>
    series
      .slice(0, upTo + 1)
      .map((v, t) => `${t === 0 ? 'M' : 'L'} ${sx(t).toFixed(1)} ${sy(v).toFixed(1)}`)
      .join(' ');
  return (
    <div className={styles.vital}>
      <span>{label}</span>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <rect x={sx(faultOnset)} y={0} width={sx(faultOnset + faultLength) - sx(faultOnset)} height={H} fill={FAULT} />
        <line x1={0} y1={H - 0.5} x2={W} y2={H - 0.5} stroke={LINE} strokeWidth={1} />
        <path d={path(T - 1)} fill="none" stroke={LINE} strokeWidth={1.2} />
        <path d={path(tick)} fill="none" stroke={NAVY} strokeWidth={1.6} />
        <line x1={sx(tick)} y1={0} x2={sx(tick)} y2={H} stroke={BLUE} strokeWidth={1} />
      </svg>
      <strong>{format(series[tick] ?? 0)}</strong>
    </div>
  );
}

const pct = (v: number) => `${Math.round(v * 100)}%`;
const signedPct = (v: number) => `${v >= 0 ? '+' : ''}${Math.round(v * 100)}%`;

interface ReplayProps {
  run: Run | null;
  tick: number;
  faultOnset: number;
  faultLength: number;
  caption: string;
}

function Replay({ run, tick, faultOnset, faultLength, caption }: ReplayProps) {
  if (!run) {
    return (
      <div className={styles.stage}>
        <p className={styles.muted}>Loading the run…</p>
      </div>
    );
  }
  return (
    <div className={styles.stage}>
      <Institution run={run} tick={tick} faultOnset={faultOnset} faultLength={faultLength} />
      <div className={styles.vitals}>
        <Vital label="judgment left" series={run.global.mean_skill} tick={tick} faultOnset={faultOnset} faultLength={faultLength} domain={[0, 1]} format={pct} />
        <Vital label="decided by people" series={run.global.human_decision_share} tick={tick} faultOnset={faultOnset} faultLength={faultLength} domain={[0, 1]} format={pct} />
        <Vital label="decisions wrong" series={run.global.error_rate_mean} tick={tick} faultOnset={faultOnset} faultLength={faultLength} domain={[0, 0.6]} format={pct} />
        <Vital label="over-trust in AI" series={run.global.over_trust} tick={tick} faultOnset={faultOnset} faultLength={faultLength} domain={[-0.1, 0.6]} format={signedPct} />
      </div>
      <div className={styles.stageNote}>
        <span>{caption}</span>
        <span>tick {tick} / {run.meta.T - 1} · seed {run.meta.seed}</span>
      </div>
    </div>
  );
}

// --- the script: scroll states over playback cells ------------------------------
//
// Lattice indices (manifest.axes): reliability [0.5, 0.6, 0.7, 0.75, 0.8, 0.85,
// 0.9, 0.95] -> 6 = 0.9, 0 = 0.5; cost_self [0.075, 0.1, 0.125, 0.15, 0.2] -> 3 = 0.15;
// floor [0, 0.15, 0.3, 0.5] -> 0 / 2 / 3. All four cells below ship playback.

const ERODED: Cell = [6, 3, 0];
const GUARDED: Cell = [6, 3, 3];
const ORGANIC: Cell = [0, 3, 0];

interface ScriptStep {
  id: string;
  stageLabel: string;
  headline: string;
  body: string;
  stage: Stage;
}

interface Segment {
  id: string;
  eyebrow: string;
  title: string;
  intro: string[];
  steps: ScriptStep[];
}

const SEGMENTS: Segment[] = [
  {
    id: 'signature',
    eyebrow: '01 · The signature',
    title: 'The AI gets good, and the judgment leaves',
    intro: [
      'One institution, thirty workers, an AI that starts out right half the time. From tick 50 it improves until it is right nine times in ten. Nothing else changes. Watch what the workers do with that, and what it does to them.',
    ],
    steps: [
      {
        id: 'people-decide',
        stageLabel: 'ticks 0–50',
        headline: 'People decide, because the AI is not worth asking',
        body: 'The AI is a coin flip and everyone knows it. Workers make their own decisions, their judgment sharpens with use, and almost nothing is handed over. The lines to the AI stay faint.',
        stage: { cell: ERODED, tick: 0, playTo: 50, rate: 20 },
      },
      {
        id: 'gets-good',
        stageLabel: 'ticks 50–150',
        headline: 'The AI improves, and delegation follows the cheaper option',
        body: 'Reliability climbs. Each worker compares deciding alone with handing the decision over, at the reliability the institution believes, and hands over what looks cheaper today. Nobody prices tomorrow’s judgment. The lines thicken.',
        stage: { cell: ERODED, tick: 50, playTo: 150, rate: 25 },
      },
      {
        id: 'drains',
        stageLabel: 'ticks 150–250',
        headline: 'Judgment drains, and trust climbs above the truth',
        body: 'Skill decays on the decisions handed away, and the less skill a worker has the worse deciding alone looks, so more is handed away. The circles fade. Watch the over-trust strip: reviewers who cannot see mistakes report few, so the institution now believes the AI is better than it is.',
        stage: { cell: ERODED, tick: 150, playTo: 250, rate: 25 },
      },
      {
        id: 'fault',
        stageLabel: 'ticks 250–310',
        headline: 'The AI breaks, and nobody is left to notice',
        body: 'For sixty ticks the AI is right only half the time. It does not say so. Half of every delegated decision now goes wrong, and the institution’s belief does not move, because the people reviewing the AI’s work have no judgment left to catch it with. The window for correction was open once. It is not open now.',
        stage: { cell: ERODED, tick: 250, playTo: 310, rate: 15 },
      },
      {
        id: 'after',
        stageLabel: 'ticks 310–400',
        headline: 'The fault passes, and nothing was learned',
        body: 'The AI recovers. Errors fall back to their eroded normal. Trust ends the run higher than it started, and every decision in the building still goes through a system nobody can check. The eroded state is a fixed point of the model at every reliability: once judgment is gone, deciding alone is hopeless whatever the AI does.',
        stage: { cell: ERODED, tick: 310, playTo: 399, rate: 30 },
      },
    ],
  },
  {
    id: 'floor',
    eyebrow: '02 · The floor',
    title: 'One rule from the horizon scan, turned on',
    intro: [
      'The scan’s panel ranked an intervention: record your own judgment before consulting the AI. In the model it is a floor, a share of every worker’s decisions that must be made alone whatever the worker prefers. Same workers, same AI, floor at one half.',
    ],
    steps: [
      {
        id: 'floor-holds',
        stageLabel: 'ticks 0–250',
        headline: 'Half the decisions stay human, and half the judgment stays',
        body: 'Delegation climbs and stops at the floor. Judgment settles where the rule says it must, at the closed-form level the model’s tests pin. The price is visible in the wrong-decisions strip: in normal times this institution makes more errors than the eroded one, because half its decisions are made by half-skilled people.',
        stage: { cell: GUARDED, tick: 0, playTo: 250, rate: 40 },
      },
      {
        id: 'floor-fault',
        stageLabel: 'ticks 250–330',
        headline: 'The same fault, half seen',
        body: 'The fault hits. This time the reviewers catch some of it, the belief drops, and the damage is smaller. The floor keeps the lights on in the review room. It does not by itself buy back control: the workers still cannot out-decide a broken AI with half their judgment, so they keep delegating through it.',
        stage: { cell: GUARDED, tick: 250, playTo: 330, rate: 15 },
      },
      {
        id: 'organic',
        stageLabel: 'the reference',
        headline: 'And the institution whose AI never got good',
        body: 'For comparison: the same workers with an AI that stays a coin flip. Nobody delegates, judgment stays at its ceiling, and the fault is a non-event. This is the model’s safe region, and it is also a corner: an institution that never uses the AI never learns it got good.',
        stage: { cell: ORGANIC, tick: 200, playTo: 340, rate: 30 },
      },
    ],
  },
];

function toDocument(segment: Segment): VisualEssayDocument<string> {
  return {
    eyebrow: segment.eyebrow,
    reference: 'showcase / judgment',
    title: segment.title,
    dek: '',
    scrollPrompt: 'Scroll',
    figureLabel: `${segment.title} — engine replay`,
    statusLabel: 'State',
    steps: segment.steps.map((step, index) => ({
      id: index + 1,
      state: step.id,
      section: segment.id,
      sectionLabel: segment.eyebrow,
      stageLabel: step.stageLabel,
      headline: step.headline,
      body: step.body,
    })),
  };
}

interface StageViewProps {
  stage: Stage;
  T: number;
  faultOnset: number;
  faultLength: number;
  caption: string;
}

function StageView({ stage, T, faultOnset, faultLength, caption }: StageViewProps) {
  const run = useRun(stage.cell);
  const { tick } = usePlayhead(stage, T);
  return <Replay run={run} tick={tick} faultOnset={faultOnset} faultLength={faultLength} caption={caption} />;
}

interface SegmentBlockProps {
  segment: Segment;
  T: number;
  faultOnset: number;
  faultLength: number;
  manifest: Manifest;
}

function SegmentBlock({ segment, T, faultOnset, faultLength, manifest }: SegmentBlockProps) {
  const document = toDocument(segment);
  const Visual = (props: VisualEssayRendererProps<string>) => {
    const step = segment.steps.find((candidate) => candidate.id === props.activeState) ?? segment.steps[0];
    const [i, j, k] = step.stage.cell;
    const caption = `AI gets to ${manifest.axes[0].values[i]} · own time cost ${manifest.axes[1].values[j]} · floor ${manifest.axes[2].values[k]}`;
    return <StageView stage={step.stage} T={T} faultOnset={faultOnset} faultLength={faultLength} caption={caption} />;
  };
  return (
    <section className="scroll-segment" id={segment.id}>
      <header className="showcase-chapter-head scroll-segment-head">
        <p className="eyebrow">{segment.eyebrow}</p>
        <h2>{segment.title}</h2>
      </header>
      <div className="showcase-intro scroll-segment-intro">
        {segment.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <VisualEssay anchorPrefix={segment.id} document={document} showHeader={false} Visual={Visual} />
    </section>
  );
}

// --- the tray: dials over the lattice, scalars with CIs, the plane -------------

interface TrayProps {
  manifest: Manifest;
  scalars: Scalars;
  faultOnset: number;
  faultLength: number;
}

function Tray({ manifest, scalars, faultOnset, faultLength }: TrayProps) {
  const [cell, setCell] = useState<Cell>(() => manifest.default_cell as Cell);
  const [replayKey, setReplayKey] = useState(0);
  const idx = flatIndex(scalars.shape, cell);
  const hasRun = scalars.has_run[idx] === 1;
  const run = useRun(hasRun ? cell : null);
  const stage = useMemo<Stage>(() => ({ cell, tick: 0, playTo: manifest.T - 1, rate: 40 }), [cell, replayKey]);
  const { tick, playing, setPlaying, setTick } = usePlayhead(stage, manifest.T);

  const setAxis = (axis: number, value: number) =>
    setCell((current) => {
      const next = [...current] as Cell;
      next[axis] = value;
      return next;
    });

  // the plane: mean skill over reliability x cost at the chosen floor, with
  // the pre-registered threshold overlay drawn in dial space
  const plane = useMemo(() => {
    const rel = manifest.axes[0].values;
    const cost = manifest.axes[1].values;
    const grid = cost.map((_, j) => rel.map((__, i) => scalars.metrics.mean_skill.point[flatIndex(scalars.shape, [i, j, cell[2]])]));
    const overlay = manifest.overlays.find((o) => o.kind === 'boundary' && o.points);
    return { rel, cost, grid, overlay };
  }, [manifest, scalars, cell[2]]);

  const W = 300;
  const H = 190;
  const cw = W / plane.rel.length;
  const ch = H / plane.cost.length;
  const xOf = (q: number) => {
    // dial value -> pixel through the axis grid (linear between grid points)
    const v = plane.rel;
    if (q <= v[0]) return cw / 2;
    if (q >= v[v.length - 1]) return W - cw / 2;
    let i = 0;
    while (v[i + 1] < q) i += 1;
    return (i + (q - v[i]) / (v[i + 1] - v[i]) + 0.5) * cw;
  };
  const yOf = (c: number) => {
    const v = plane.cost;
    if (c <= v[0]) return H - ch / 2;
    if (c >= v[v.length - 1]) return ch / 2;
    let j = 0;
    while (v[j + 1] < c) j += 1;
    return H - (j + (c - v[j]) / (v[j + 1] - v[j]) + 0.5) * ch;
  };
  const overlayPath = plane.overlay?.points
    ? plane.overlay.points
        .filter(([, q]) => q <= plane.rel[plane.rel.length - 1] + 0.05)
        .map(([c, q], n) => `${n === 0 ? 'M' : 'L'} ${xOf(q).toFixed(1)} ${yOf(c).toFixed(1)}`)
        .join(' ')
    : '';

  const format = (id: string, v: number) => (id === 'detection_lag' ? `${Math.round(v)} ticks` : id === 'skill_gini' ? v.toFixed(2) : pct(v));

  return (
    <div className={styles.tray}>
      <div className={styles.dials}>
        {manifest.axes.map((axis, a) => (
          <div className={styles.dial} key={axis.name}>
            <span>{axis.label} · {axis.param_type}</span>
            <div className={styles.chips}>
              {axis.values.map((value, v) => (
                <button
                  className={`${styles.chip} ${cell[a] === v ? styles.chipActive : ''}`}
                  key={value}
                  onClick={() => setAxis(a, v)}
                  type="button"
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.readout}>
        <div className={styles.tiles}>
          {manifest.metrics.map((metric) => {
            const m = scalars.metrics[metric.id];
            const lo = m.lo?.[idx];
            const hi = m.hi?.[idx];
            return (
              <div className={styles.tile} key={metric.id}>
                <span>{metric.label}</span>
                <strong>{format(metric.id, m.point[idx])}</strong>
                {lo !== undefined && hi !== undefined && (
                  <em>
                    {format(metric.id, lo)} – {format(metric.id, hi)} · {manifest.n_seeds} seeds
                  </em>
                )}
              </div>
            );
          })}
        </div>
        <div className={styles.plane}>
          <span>judgment left, late in the run · floor {manifest.axes[2].values[cell[2]]} · click a cell</span>
          <svg viewBox={`0 0 ${W + 40} ${H + 28}`} role="img" aria-label="Judgment left over how good the AI gets and a worker's own time cost">
            <g transform="translate(36, 4)">
              {plane.grid.map((row, j) =>
                row.map((v, i) => (
                  <rect
                    key={`${i}-${j}`}
                    x={i * cw}
                    y={H - (j + 1) * ch}
                    width={cw - 1}
                    height={ch - 1}
                    fill={skillFill(v)}
                    stroke={cell[0] === i && cell[1] === j ? BLUE : 'none'}
                    strokeWidth={2}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setCell([i, j, cell[2]])}
                  />
                ))
              )}
              {overlayPath && <path d={overlayPath} fill="none" stroke="#D55E00" strokeWidth={2} />}
              {plane.rel.map((q, i) => (
                <text key={`x${i}`} x={(i + 0.5) * cw} y={H + 12} textAnchor="middle" fontSize="8" fill={MUTED} fontFamily="IBM Plex Mono, monospace">
                  {q}
                </text>
              ))}
              {plane.cost.map((c, j) => (
                <text key={`y${j}`} x={-4} y={H - (j + 0.5) * ch + 3} textAnchor="end" fontSize="8" fill={MUTED} fontFamily="IBM Plex Mono, monospace">
                  {c}
                </text>
              ))}
              <text x={W / 2} y={H + 22} textAnchor="middle" fontSize="8" fill={MUTED} fontFamily="IBM Plex Mono, monospace">
                how good the AI gets → · rows: own time cost · orange: committed threshold
              </text>
            </g>
          </svg>
        </div>
      </div>

      {hasRun ? (
        <>
          <div className={styles.controls}>
            <button className={styles.button} onClick={() => setPlaying(!playing)} type="button">
              {playing ? 'Pause' : 'Play'}
            </button>
            <button
              className={`${styles.button} ${styles.buttonQuiet}`}
              onClick={() => {
                setTick(0);
                setReplayKey((k) => k + 1);
              }}
              type="button"
            >
              Restart
            </button>
            <span className={styles.muted}>Replaying the exported run for this cell (one seed); the tiles above are the eight-seed means.</span>
          </div>
          <Replay run={run} tick={tick} faultOnset={faultOnset} faultLength={faultLength} caption={`AI gets to ${manifest.axes[0].values[cell[0]]} · own time cost ${manifest.axes[1].values[cell[1]]} · floor ${manifest.axes[2].values[cell[2]]}`} />
        </>
      ) : (
        <p className={styles.muted}>
          This cell ships scalars only. Playback runs are exported for a sub-grid of cells (reliability 0.5, 0.7, 0.8, 0.9; cost 0.075, 0.15; floor 0, 0.3, 0.5); pick one of those to watch the run.
        </p>
      )}
    </div>
  );
}

// --- the page -------------------------------------------------------------------

export default function JudgmentShowcase() {
  const { manifest, scalars, error } = useBundle();
  if (error) {
    return (
      <div className="playground-shell showcase-shell showcase-scroll">
        <section className="showcase-column scroll-interlude">
          <p className="eyebrow">Bundle</p>
          <p>The exported bundle could not be loaded ({error}). The page has nothing of its own to show without it.</p>
        </section>
      </div>
    );
  }
  if (!manifest || !scalars) {
    return (
      <div className="playground-shell showcase-shell showcase-scroll">
        <section className="showcase-column scroll-interlude">
          <p className="eyebrow">Loading</p>
          <p>Fetching the engine’s exported runs…</p>
        </section>
      </div>
    );
  }
  const faultOnset = Number(manifest.base_config.fault_onset ?? 250);
  const faultLength = Number(manifest.base_config.fault_length ?? 60);

  return (
    <div className="playground-shell showcase-shell showcase-scroll">
      <section className="showcase-column scroll-interlude">
        <p className="eyebrow">00 · The loop</p>
        <div className="showcase-intro scroll-prose">
          {judgmentIntro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {SEGMENTS.map((segment) => (
        <SegmentBlock
          key={segment.id}
          segment={segment}
          T={manifest.T}
          faultOnset={faultOnset}
          faultLength={faultLength}
          manifest={manifest}
        />
      ))}

      <section className="showcase-column scroll-interlude" id="rules">
        <header className="showcase-chapter-head">
          <p className="eyebrow">03 · The model, simply stated</p>
          <h2>Six rules, every assumption a dial</h2>
        </header>
        <ol className={styles.rules}>
          {judgmentRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
        <p className={styles.muted}>
          The AI is a clock, not an actor: it gets good on a schedule and breaks on a schedule. What is deliberately absent: task structure, an AI with an objective, workers who plan, hiring, money, and any coupling to other institutions.
        </p>
      </section>

      <section className="showcase-column scroll-interlude" id="tray">
        <header className="showcase-chapter-head">
          <p className="eyebrow">04 · Take the dials</p>
          <h2>One hundred and sixty institutions, already run</h2>
        </header>
        <div className="showcase-intro">
          <p>
            Three dials, each swept across its range by the engine. Pick a setting and the page shows the eight-seed means with bootstrap intervals, the plane of judgment left over the two threat dials with the threshold the model committed to before the sweep, and, where a run was exported, the run itself.
          </p>
        </div>
        <Tray manifest={manifest} scalars={scalars} faultOnset={faultOnset} faultLength={faultLength} />
      </section>

      <section className="showcase-column scroll-interlude" id="closing">
        <header className="showcase-chapter-head">
          <p className="eyebrow">05 · What the diagram cannot say</p>
          <h2>Who holds the judgment, and where it is pointed</h2>
        </header>
        <div className="showcase-intro scroll-prose">
          {judgmentClosing.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <nav aria-label="Where to go next" className="showcase-links">
          {judgmentLinks.map((link) => (
            <a className="showcase-link-card" href={link.href} key={link.href}>
              <strong>{link.label}</strong>
              <span>{link.description}</span>
            </a>
          ))}
        </nav>
      </section>
    </div>
  );
}
