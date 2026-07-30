import assert from 'node:assert/strict';
import test from 'node:test';

import { runScenario } from '../src/engine/run.ts';
import { scenarioById } from '../src/scenarios/registry.ts';

const goldens = {
  commons: {
    seed: 14,
    scalars: [0, -1.97195347118657, 1, 0.129613232110638],
    series: { resource_level: [347.182696887466, 0, 0], policy_target: [500, 500, 500] },
  },
  economy: {
    seed: 42,
    scalars: [0.108171338995879, 0.361818935626864, 0.142877344302769, 0.754360814914737],
    series: {
      labor_share: [1, 0.170022412691158, 0.106778538594275],
      wage: [0.36, 2.11736790639439, 3.37146401083355],
    },
  },
  cultural: {
    seed: 60,
    scalars: [0.8065, 0.210042012604201, 39, 0],
    series: { human_share: [0.9375, 0.75, 0.90625], conversions: [2, 2, 0] },
  },
  political: {
    seed: 7,
    scalars: [0.412226820178093, 0.769464190973377, 1.30088964689456, 0.210700447529979],
    series: {
      human_share: [0.897111418809948, 0.412238159176637, 0.412226773384544],
      consensus_error: [0.210125878668157, 1.30088373568926, 1.3008896702608],
    },
  },
  combined: {
    seed: 34,
    scalars: [0.17821161906629, 0.592693311123029, 0.637443614791567, 0.318339408861424],
    series: {
      income_share: [1, 0.663188099060497, 0.661654548700122],
      culture_share: [1, 0.45, 0.6],
      influence_share: [0.765391144966145, 0.655304167388083, 0.682823130870082],
    },
  },
};

const close = (actual, expected, label) => {
  assert.ok(
    Math.abs(actual - expected) <= 1e-11 * Math.max(1, Math.abs(expected)),
    `${label}: expected ${expected}, received ${actual}`
  );
};

test('the first-pass UI rebuild preserves the characterized scientific trajectories', () => {
  for (const [scenarioId, golden] of Object.entries(goldens)) {
    const definition = scenarioById[scenarioId];
    const trajectory = runScenario(scenarioId, definition.defaults, golden.seed);

    definition.metrics.forEach((metric, index) => {
      close(
        trajectory.meta.scalars[metric.key],
        golden.scalars[index],
        `${scenarioId}.${metric.key}`
      );
    });

    for (const [seriesKey, expected] of Object.entries(golden.series)) {
      const values = trajectory.global[seriesKey];
      const observed = [values[0], values[Math.floor((values.length - 1) / 2)], values.at(-1)];
      observed.forEach((value, index) =>
        close(value, expected[index], `${scenarioId}.${seriesKey}[${index}]`)
      );
    }
  }
});
