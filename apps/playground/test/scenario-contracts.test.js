import assert from 'node:assert/strict';
import test from 'node:test';

import { runScenario } from '../src/engine/run.ts';
import { scenarios } from '../src/scenarios/registry.ts';

const viewsByScenario = {
  combined: new Set(['system']),
  economy: new Set(['messages', 'shares']),
  culture: new Set(['system', 'lorenz']),
  politics: new Set(['system', 'lorenz']),
};

test('every scenario exposes a complete UI and engine contract', () => {
  assert.equal(scenarios.length, 4);
  assert.equal(new Set(scenarios.map(({ id }) => id)).size, 4);
  // the coupled model leads and the three that follow are its three panels:
  // money (WP1), attention (WP2), votes (WP3)
  assert.deepEqual(
    scenarios.map(({ id }) => id),
    ['combined', 'economy', 'culture', 'politics']
  );

  for (const scenario of scenarios) {
    assert.ok(scenario.parameters.length > 0, `${scenario.id} needs controls`);
    assert.ok(scenario.presets.length >= 3, `${scenario.id} needs comparison presets`);
    assert.equal(scenario.metrics.length, 4, `${scenario.id} needs four headline metrics`);
    assert.ok(scenario.series.length >= 2, `${scenario.id} needs chart series`);
    assert.ok(scenario.story.length >= 5, `${scenario.id} needs a guided story`);
    assert.ok(scenario.evidence, `${scenario.id} needs an evidence anchor`);
    assert.ok(scenario.modellingNotes.length > 0, `${scenario.id} needs modelling notes`);

    const viewKeys = viewsByScenario[scenario.id];
    const presetIds = new Set(scenario.presets.map(({ id }) => id));
    for (const [index, step] of scenario.story.entries()) {
      assert.ok(step.id, `${scenario.id}.story[${index}] needs a stable id`);
      assert.ok(step.title && step.body, `${scenario.id}.story[${index}] needs narrative copy`);
      assert.ok(viewKeys.has(step.view), `${scenario.id}.story[${index}] references ${step.view}`);
      assert.ok(step.tick >= 0, `${scenario.id}.story[${index}] needs a valid tick`);
      if (step.playTo !== undefined) {
        assert.ok(
          step.playTo > step.tick,
          `${scenario.id}.story[${index}] playback must move forward`
        );
      }
      if (step.preset) {
        assert.ok(
          presetIds.has(step.preset),
          `${scenario.id}.story[${index}] references unknown preset ${step.preset}`
        );
      }
    }

    const trajectory = runScenario(scenario.id, scenario.defaults, scenario.seed);
    assert.equal(trajectory.meta.T, Number(scenario.defaults.T));
    for (const metric of scenario.metrics) {
      assert.ok(
        Number.isFinite(trajectory.meta.scalars[metric.key]),
        `${scenario.id}.${metric.key} must be produced by its engine`
      );
    }
    for (const series of scenario.series) {
      assert.ok(trajectory.global[series.key], `${scenario.id}.${series.key} must be chartable`);
    }
  }
});
