export type ScenarioId = 'commons' | 'economy' | 'cultural' | 'political' | 'combined';
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

export interface ScenarioDefinition {
  id: ScenarioId;
  index: string;
  shortLabel: string;
  title: string;
  question: string;
  description: string;
  assumption: string;
  story: {
    setup: string;
    pressure: string;
    intervention: string;
    reading: string;
  };
  engine: 'runCommons' | 'runEconomy' | 'runCultural' | 'runPolitical' | 'runCombined';
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
