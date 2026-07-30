import assert from 'node:assert/strict';
import test from 'node:test';

import { runScenario } from '../src/engine/run.ts';
import { scenarios } from '../src/scenarios/registry.ts';

test('every scenario exposes a complete UI and engine contract', () => {
  assert.equal(scenarios.length, 5);
  assert.equal(new Set(scenarios.map(({ id }) => id)).size, 5);

  for (const scenario of scenarios) {
    assert.ok(scenario.parameters.length > 0, `${scenario.id} needs controls`);
    assert.ok(scenario.presets.length >= 3, `${scenario.id} needs comparison presets`);
    assert.equal(scenario.metrics.length, 4, `${scenario.id} needs four headline metrics`);
    assert.ok(scenario.series.length >= 2, `${scenario.id} needs chart series`);

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
