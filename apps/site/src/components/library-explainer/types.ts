/** Typed shapes for the CI Library explainer fixtures
    (apps/site/src/data/library-explainer/, exported by the engine's
    experiments/library_explainer — pasted, never hand-edited) and the
    scroll script's stage specs. Data-only: importable under node --test. */

export interface ExplainerManifest {
  schema_version: '1';
  kind: 'library_explainer';
  contract_version: '1.1';
  env: string;
  created: string;
  engine: {
    package: string;
    version: string;
    git_rev: string;
    jax_version: string;
    platform: string;
  };
  T: number;
  seed0: number;
  conditions: string[];
  run_whitelist: string[];
  checksums: Record<string, string>;
}

export interface SubsetTransform {
  name: string;
  reads: string[];
  writes: string[];
  schedule: { cadence: number; phase_offset: number; onset: number } | null;
}

export type HazardKind = 'RAW' | 'WAR' | 'WAW';

export interface SubsetRow {
  enabled: number[];
  edges: [number, number, HazardKind[]][];
  batches: number[][];
}

export interface SubsetsFixture {
  env: string;
  transforms: SubsetTransform[];
  rows: SubsetRow[];
}

export type SystemNode =
  | {
      id: string;
      kind: 'field';
      family: 'node_attrs' | 'adj_matrices' | 'edge_attrs' | 'global_attrs';
      shape: number[];
      bookkeeping?: true;
    }
  | { id: string; kind: 'transform'; reads: string[]; writes: string[] };

export interface SystemGraph {
  nodes: SystemNode[];
  edges: { from: string; to: string }[];
}

export interface SystemsFixture {
  env: string;
  conditions: Record<string, SystemGraph>;
}

export interface RunPayload {
  global: Record<string, number[]>;
  node: Record<string, never>;
  static: Record<string, number[]>;
  meta: {
    gameId: string;
    T: number;
    N: number;
    seed: number;
    params: Record<string, unknown>;
    scalars: Record<string, number>;
  };
}

export interface SnippetsFixture {
  [id: string]: {
    path: string;
    start_line: number;
    end_line: number;
    sha256: string;
    text: string;
  };
}

export interface ScheduleGoldenFixture {
  ticks: number;
  combos: {
    cadence: number;
    phase_offset: number;
    onset: number;
    fires: boolean[];
  }[];
}

export interface StateShapesFixture {
  env: string;
  N: number;
  node_types_dtype: string;
  fields: Record<
    'node_attrs' | 'adj_matrices' | 'edge_attrs' | 'global_attrs',
    Record<string, { shape: number[]; dtype: string }>
  >;
}

export interface MeanSe {
  mean: number;
  se: number;
}

export interface ScorecardFixture {
  env: string;
  T: number;
  n_seeds: number;
  seed0: number;
  caveat: string;
  instrument: { id: string; kind: 'causal'; delta?: number; description: string };
  metrics: { id: string; label: string; kind: 'causal' | 'descriptive' }[];
  rows: { condition: string; values: Record<string, MeanSe> }[];
}

export interface InfluenceCurveFixture {
  env: string;
  T: number;
  n_seeds: number;
  seed0: number;
  delta: number;
  window: number;
  t0: number[];
  caveat: string;
  instrument: { id: string; kind: 'causal'; description: string };
  conditions: Record<string, { mean: number[]; se: number[] }>;
}

export interface GraphMatrixFixture {
  env: string;
  layer: string;
  N: number;
  seed0: number;
  params: Record<string, unknown>;
  node_types: number[];
  adj: number[];
  spectral: {
    eigenvalues: number[];
    fiedler: number[];
    spectral_gap: number;
    fiedler_alignment: number;
  };
}

/** What a scroll step stages in the figure column. Every variant is a pure
    lookup into fixture data — no stage ever steps model state. */
export type ArtifactStage =
  | { kind: 'slots'; tradition: string }
  | { kind: 'state-layers'; highlight?: 'node_attrs' | 'adj_matrices' | 'global_attrs' }
  | { kind: 'transform-card'; transforms: string[] }
  | { kind: 'schedule'; cadence: number; phaseOffset: number; onset: number }
  | { kind: 'batches'; enabled: number[] }
  | { kind: 'system'; condition: string }
  | { kind: 'category'; view: 'endo' | 'factor' | 'interchange' | 'tick' }
  | { kind: 'matrix'; order: 'index' | 'fiedler' }
  | { kind: 'spectral'; view: 'eigenvalues' | 'fiedler' };

export interface LibraryStepSpec {
  id: string;
  stageLabel: string;
  headline: string;
  body: string;
  stage: ArtifactStage;
  /** Resolved against the snippets fixture; the contracts test fails on
      unknown ids so the panel can never fabricate an exhibit. */
  snippetId?: string;
}

export interface LibrarySegmentSpec {
  id: string;
  eyebrow: string;
  title: string;
  intro: string[];
  /** Optional hand-drawn sketch shown with the intro — reused from the lab
      page's pipeline section (owner-endorsed visuals). */
  sketch?: { img: string; alt: string };
  steps: LibraryStepSpec[];
}

export interface LibraryProse {
  id: string;
  eyebrow: string;
  title: string;
  blocks: { heading: string; body: string }[];
  coda?: string;
}
