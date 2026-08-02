import assert from 'node:assert/strict';
import test from 'node:test';

import { LEDGER_DEFAULTS, runCombined, runSelfTests } from '../src/engine/kernel.js';

test('the complete browser validation ladder passes', () => {
  const results = runSelfTests();
  const failures = results.filter(({ pass }) => !pass);

  assert.deepEqual(failures, [], failures.map(({ name, err }) => `${name}: ${err}`).join('\n'));
  assert.ok(results.length >= 20, 'the ladder should retain broad scenario coverage');
});

test('a scenario is deterministic for the same parameters and seed', () => {
  const first = runCombined(LEDGER_DEFAULTS, 17);
  const second = runCombined(LEDGER_DEFAULTS, 17);

  assert.deepEqual(first.meta.scalars, second.meta.scalars);
  assert.deepEqual(first.global.composite, second.global.composite);
});

test('sealing all three channels is the coupling-cost null', () => {
  // this model draws randomness only at init, so a run with the three
  // cross-domain dials at zero IS its own sealed twin, tick for tick
  const trajectory = runCombined(
    { ...LEDGER_DEFAULTS, reachPerSpend: 0, attentionToBallots: 0, regimeRate: 0 },
    2
  );

  assert.equal(Math.max(...trajectory.global.transfer_gap.map(Math.abs)), 0);
});
