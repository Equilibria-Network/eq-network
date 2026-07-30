import assert from 'node:assert/strict';
import test from 'node:test';

import { COMBINED_DEFAULTS, runCombined, runCommons, runSelfTests } from '../src/engine/kernel.js';

test('the complete browser validation ladder passes', () => {
  const results = runSelfTests();
  const failures = results.filter(({ pass }) => !pass);

  assert.deepEqual(failures, [], failures.map(({ name, err }) => `${name}: ${err}`).join('\n'));
  assert.ok(results.length >= 20, 'the ladder should retain broad scenario coverage');
});

test('a scenario is deterministic for the same parameters and seed', () => {
  const first = runCommons({}, 17);
  const second = runCommons({}, 17);

  assert.deepEqual(first.meta.scalars, second.meta.scalars);
  assert.deepEqual(first.global.resource_level, second.global.resource_level);
});

test('zero coupling is the transfer-gap null', () => {
  const trajectory = runCombined(
    {
      ...COMBINED_DEFAULTS,
      aiTax: true,
      sortition: true,
      influenceCap: true,
      kappa: 0,
    },
    2
  );

  assert.equal(Math.max(...trajectory.global.transfer_gap.map(Math.abs)), 0);
});
