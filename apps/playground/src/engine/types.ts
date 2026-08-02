export type ScenarioId = 'combined' | 'economy' | 'culture' | 'politics';
export type NumericParams = Record<string, number | boolean>;

export interface Trajectory {
  meta: {
    gameId: string;
    T: number;
    N: number;
    seed: number;
    params: NumericParams;
    scalars: Record<string, number>;
  };
  global: Record<string, Float64Array>;
  node: Record<string, Float64Array>;
  static: Record<string, Float64Array>;
  adj?: Record<string, Float64Array>;
  system?: {
    nodes: Array<{
      id: string;
      kind: string;
      family?: string;
      color?: string;
      reads?: string[];
      writes?: string[];
      bookkeeping?: boolean;
    }>;
    edges: Array<{ from: string; to: string }>;
  };
}

/** The papers' parameter typing (WP1 Table 2, WP2 Table 1, WP3 Table 1):
    `anchored` cites a source, `tuned` claims direction only, `swept` is
    arbitrary and varied across an axis. */
export type ParameterType = 'anchored' | 'tuned' | 'swept';

export interface ParameterDefinition {
  key: string;
  label: string;
  description: string;
  group: 'world' | 'dynamics' | 'institutions' | 'schedule';
  kind: 'range' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  type?: ParameterType;
}

export interface Preset {
  id: string;
  label: string;
  note: string;
  values: NumericParams;
}

export interface MetricDefinition {
  key: string;
  label: string;
  format: 'percent' | 'decimal' | 'integer' | 'points';
  better: 'higher' | 'lower' | 'context';
}

export interface SeriesDefinition {
  key: string;
  label: string;
  color: string;
  max?: number;
}

export interface StoryStep {
  id: string;
  title: string;
  body: string;
  view: string;
  tick: number;
  playTo?: number;
  speed?: number;
  preset?: string;
}

export interface ScenarioDefinition {
  id: ScenarioId;
  index: string;
  shortLabel: string;
  title: string;
  question: string;
  description: string;
  assumption: string;
  evidence: string;
  /** Absent when no paper specifies this model — the page says so plainly. */
  paper?: string;
  modellingNotes: string[];
  story: StoryStep[];
  engine: 'runCombined' | 'runEconomy' | 'runPolitical' | 'runPolity';
  seed: number;
  defaults: NumericParams;
  parameters: ParameterDefinition[];
  presets: Preset[];
  metrics: MetricDefinition[];
  series: SeriesDefinition[];
}

export interface RunRequest {
  type: 'run';
  requestId: number;
  scenario: ScenarioId;
  params: NumericParams;
  seed: number;
}

export interface RunResult {
  type: 'result';
  requestId: number;
  scenario: ScenarioId;
  durationMs: number;
  trajectory: Trajectory;
}

export interface RunFailure {
  type: 'error';
  requestId: number;
  message: string;
}
