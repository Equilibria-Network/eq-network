import assert from 'node:assert/strict';
import test from 'node:test';

import { runScenario } from '../src/engine/run.ts';
import { scenarioById } from '../src/scenarios/registry.ts';

// Recharacterized 2026-08-02, when the playground was restructured around the
// coupled model: the two scenarios that are not legs of it (commons, culture)
// were removed, and WP3's polity was restored as the votes leg. The three legs
// are the standalone versions of the coupled model's three panels — money
// (WP1), attention (WP2), votes (WP3).
const goldens = {
  combined: {
    seed: 4,
    scalars: [0.4366621070283234, 0.29754531673219825, 0.4631619907348177, 0.5492790136179544],
    series: {
      human_income_share: [1, 0.31258300748934337, 0.296642132366221],
      human_attention_share: [0.7700384298422922, 0.4636209559407024, 0.4631351352476734],
      human_power_share: [0.8004263233051491, 0.5542295649500654, 0.5489653898054906],
    },
  },
  economy: {
    seed: 42,
    scalars: [0.4343545292391925, 0.5150666384462423, 0.55, 0.09542208863242224],
    series: {
      human_sector_share: [1, 0.4271437233157492, 0.4348887930428918],
      ai_capital: [0, 8.927471987440866, 8.661693896597097],
    },
  },
  culture: {
    seed: 7,
    scalars: [0.4122274438629085, 0.7694624149226688, 1.300889334272313, 0.21070024741466914],
    series: {
      human_share: [0.8971114188099482, 0.41228823596060304, 0.4122268637250631],
      consensus_error: [0.21012587866815718, 1.3008508642645304, 1.3008896251515478],
    },
  },
  politics: {
    seed: 11,
    scalars: [0.3846590076186694, 0.5679618664391328, 0.19299500632614236, 0.20700499367385763],
    series: {
      human_power_share: [0.9004007960993257, 0.38532664409043443, 0.3846584099822679],
      top_share: [0.04034305563717329, 0.5612028739164272, 0.5679670241190403],
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
