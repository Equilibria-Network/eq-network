import { LEDGER_DEFAULTS, LEDGER_INTRO_SEED, runCombined } from '../src/engine/kernel.js';

const trajectory = runCombined(LEDGER_DEFAULTS, LEDGER_INTRO_SEED);

if (!Number.isFinite(trajectory.meta.scalars.composite)) {
  throw new Error('The benchmark trajectory was invalid.');
}
