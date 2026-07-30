import { COMBINED_DEFAULTS, runCombined } from '../src/engine/kernel.js';

const trajectory = runCombined(
  {
    ...COMBINED_DEFAULTS,
    aiTax: true,
    sortition: true,
    influenceCap: true,
  },
  34
);

if (!Number.isFinite(trajectory.meta.scalars.composite)) {
  throw new Error('The benchmark trajectory was invalid.');
}
