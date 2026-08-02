import { runCombined, runEconomy, runPolitical, runPolity } from './kernel.js';
import type { NumericParams, ScenarioId, Trajectory } from './types';

const runners = {
  combined: runCombined,
  economy: runEconomy,
  culture: runPolitical,
  politics: runPolity,
} satisfies Record<ScenarioId, (params: NumericParams, seed: number) => Trajectory>;

export function runScenario(scenario: ScenarioId, params: NumericParams, seed: number): Trajectory {
  return runners[scenario](params, seed);
}
