import { SimulationClient } from '../../engine/simulationClient';
import { scenarioById } from '../../scenarios/registry';
import type { NumericParams, ScenarioDefinition, Trajectory } from '../../engine/types';
import { scrollFlow } from './script';
import type { RunStageSpec, ScrollItem } from './types';

/** Scroll must never wait on a run, so every staged trajectory is computed
    once and kept (task-0007 P1: "trajectories precomputed at load and the
    cost measured"). Worlds are small — a cached trajectory is a few hundred
    KB of Float64Array series — so the whole page is a few MB retained. */

export interface ResolvedRunSpec {
  key: string;
  params: NumericParams;
  seed: number;
}

const cache = new Map<string, Promise<Trajectory>>();

export function resolveRunSpec(
  definition: ScenarioDefinition,
  stage: RunStageSpec
): ResolvedRunSpec {
  if (stage.preset && !definition.presets.some((preset) => preset.id === stage.preset)) {
    throw new Error(`scenario ${definition.id} has no preset "${stage.preset}"`);
  }
  const preset = definition.presets.find((candidate) => candidate.id === stage.preset);
  const params = { ...definition.defaults, ...(preset?.values ?? {}) };
  const seed = stage.seed ?? definition.seed;
  const key = `${definition.id}|${seed}|${JSON.stringify(
    Object.entries(params).sort(([left], [right]) => left.localeCompare(right))
  )}`;
  return { key, params, seed };
}

export function getTrajectory(
  definition: ScenarioDefinition,
  stage: RunStageSpec
): Promise<Trajectory> {
  const spec = resolveRunSpec(definition, stage);
  const cached = cache.get(spec.key);
  if (cached) return cached;
  const pending = runOnce(definition, spec);
  cache.set(spec.key, pending);
  pending.catch(() => cache.delete(spec.key));
  return pending;
}

async function runOnce(definition: ScenarioDefinition, spec: ResolvedRunSpec): Promise<Trajectory> {
  const client = new SimulationClient();
  try {
    const result = await client.run(definition.id, spec.params, spec.seed);
    return result.trajectory;
  } finally {
    client.dispose();
  }
}

/** Warm every staged run in the flow, sequentially so at most one worker is
    alive, and log per-run and total wall time — the P1 cost measurement.
    Cache dedupe means repeated presets (the collapse cold-open/callback
    pair) cost one run. */
export async function prewarmScrollTrajectories(flow: ScrollItem[] = scrollFlow): Promise<void> {
  const started = performance.now();
  const seen = new Set<string>();
  let runs = 0;
  for (const item of flow) {
    if (item.kind !== 'segment' || !item.scenario) continue;
    const definition = scenarioById[item.scenario];
    for (const step of item.steps) {
      if (step.stage.kind !== 'run') continue;
      const spec = resolveRunSpec(definition, step.stage);
      if (seen.has(spec.key)) continue;
      seen.add(spec.key);
      const runStarted = performance.now();
      await getTrajectory(definition, step.stage);
      runs += 1;
      console.info(
        `[scroll-prewarm] ${item.scenario}/${step.stage.preset ?? 'defaults'} ` +
          `${Math.round(performance.now() - runStarted)}ms`
      );
    }
  }
  console.info(
    `[scroll-prewarm] ${runs} unique runs in ${Math.round(performance.now() - started)}ms`
  );
}
