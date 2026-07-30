import { runCombined, runCommons, runCultural, runEconomy, runPolitical } from './kernel.js';
import type { NumericParams, ScenarioId, Trajectory } from './types';

const runners = {
  commons: runCommons,
  economy: runEconomy,
  cultural: runCultural,
  political: runPolitical,
  combined: runCombined,
} satisfies Record<ScenarioId, (params: NumericParams, seed: number) => Trajectory>;

export function runScenario(scenario: ScenarioId, params: NumericParams, seed: number): Trajectory {
  return runners[scenario](params, seed);
}
