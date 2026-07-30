/* eslint-disable @typescript-eslint/no-unused-vars, no-useless-assignment */

function makeRng(seed) {
  let s = seed | 0,
    spare = null;
  const uniform = () => {
    s = (s + 0x6d2b79f5) | 0;
    let x = Math.imul(s ^ (s >>> 15), 1 | s);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
  const normal = () => {
    // Box–Muller, cached spare
    if (spare !== null) {
      const v = spare;
      spare = null;
      return v;
    }
    const a = Math.max(uniform(), 1e-12),
      b = uniform();
    const m = Math.sqrt(-2 * Math.log(a));
    spare = m * Math.sin(2 * Math.PI * b);
    return m * Math.cos(2 * Math.PI * b);
  };
  return { uniform, normal, bernoulli: (p) => uniform() < p };
}

const clip = (x, lo, hi) => Math.min(Math.max(x, lo), hi);

/** Quantile with numpy-style linear interpolation (jnp.quantile semantics). */
function quantile(xs, q) {
  const a = Array.from(xs).sort((p, r) => p - r);
  const pos = q * (a.length - 1),
    i = Math.floor(pos),
    frac = pos - i;
  return i + 1 < a.length ? a[i] + frac * (a[i + 1] - a[i]) : a[i];
}

/** Gini = Σᵢⱼ|xᵢ−xⱼ| / (2n²μ)  (metrics/families/concentration.py). */
function gini(xs) {
  const n = xs.length,
    mu = xs.reduce((p, v) => p + v, 0) / n;
  if (mu <= 1e-12) return 0;
  let s = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s += Math.abs(xs[i] - xs[j]);
  return s / (2 * n * n * mu);
}

/** Schedule predicate — port of core/schedule.py. Fires when
    step >= onset and (step - phaseOffset) % cadence === 0. */
function fires(step, { cadence = 1, phaseOffset = 0, onset = 0 } = {}) {
  if (step < onset) return false;
  const m = (step - phaseOffset) % cadence;
  return (m + cadence) % cadence === 0;
}

/** Logistic regrowth increment (governed_commons/dynamics.py::make_regrow). */
const logisticGrowth = (R, rate, K) => rate * R * (1 - R / K);

/* Derived system DAGs — generated 2026-07-27 by system_graph() via
   examples/05_export_trajectory.py at each env's fully-defended condition.
   PASTED, NEVER HAND-EDITED: regenerate with scratchpad/gen-system-fixtures.py. */
const COMMONS_SYSTEM = {
  nodes: [
    { id: 'principal_pref', kind: 'field', family: 'node_attrs', shape: [20] },
    { id: 'alignment', kind: 'field', family: 'node_attrs', shape: [20] },
    { id: 'vote', kind: 'field', family: 'node_attrs', shape: [20] },
    { id: 'delegate_action', kind: 'field', family: 'node_attrs', shape: [20] },
    { id: 'last_harvest', kind: 'field', family: 'node_attrs', shape: [20] },
    { id: 'cumulative_harvest', kind: 'field', family: 'node_attrs', shape: [20] },
    { id: 'last_reward', kind: 'field', family: 'node_attrs', shape: [20] },
    { id: 'sanction', kind: 'field', family: 'node_attrs', shape: [20] },
    { id: 'resource_level', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'policy_target', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'rng_key', kind: 'field', family: 'global_attrs', shape: [2], bookkeeping: true },
    { id: 'step', kind: 'field', family: 'global_attrs', shape: [], bookkeeping: true },
    {
      id: 'harvest',
      kind: 'transform',
      reads: [
        'cumulative_harvest',
        'delegate_action',
        'policy_target',
        'resource_level',
        'rng_key',
      ],
      writes: ['cumulative_harvest', 'last_harvest', 'last_reward', 'resource_level', 'rng_key'],
    },
    { id: 'regrow', kind: 'transform', reads: ['resource_level'], writes: ['resource_level'] },
    {
      id: 'scheduled(quota_vote, cadence=5, phase=0, onset=0)',
      kind: 'transform',
      reads: ['step', 'vote'],
      writes: ['policy_target'],
    },
    {
      id: 'graduated_sanction',
      kind: 'transform',
      reads: ['last_harvest', 'last_reward', 'policy_target', 'resource_level'],
      writes: ['last_reward', 'resource_level', 'sanction'],
    },
    { id: 'step_counter', kind: 'transform', reads: ['step'], writes: ['step'] },
  ],
  edges: [
    { from: 'cumulative_harvest', to: 'harvest' },
    { from: 'delegate_action', to: 'harvest' },
    { from: 'policy_target', to: 'harvest' },
    { from: 'resource_level', to: 'harvest' },
    { from: 'rng_key', to: 'harvest' },
    { from: 'harvest', to: 'cumulative_harvest' },
    { from: 'harvest', to: 'last_harvest' },
    { from: 'harvest', to: 'last_reward' },
    { from: 'harvest', to: 'resource_level' },
    { from: 'harvest', to: 'rng_key' },
    { from: 'resource_level', to: 'regrow' },
    { from: 'regrow', to: 'resource_level' },
    { from: 'step', to: 'scheduled(quota_vote, cadence=5, phase=0, onset=0)' },
    { from: 'vote', to: 'scheduled(quota_vote, cadence=5, phase=0, onset=0)' },
    { from: 'scheduled(quota_vote, cadence=5, phase=0, onset=0)', to: 'policy_target' },
    { from: 'last_harvest', to: 'graduated_sanction' },
    { from: 'last_reward', to: 'graduated_sanction' },
    { from: 'policy_target', to: 'graduated_sanction' },
    { from: 'resource_level', to: 'graduated_sanction' },
    { from: 'graduated_sanction', to: 'last_reward' },
    { from: 'graduated_sanction', to: 'resource_level' },
    { from: 'graduated_sanction', to: 'sanction' },
    { from: 'step', to: 'step_counter' },
    { from: 'step_counter', to: 'step' },
  ],
};
const ECONOMY_SYSTEM = {
  nodes: [
    { id: 'work_pref', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'labor_supply', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'capital', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'capital_income', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'active', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'last_reward', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'cumulative_income', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'output', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'wage', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'return_to_compute', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'rng_key', kind: 'field', family: 'global_attrs', shape: [2], bookkeeping: true },
    { id: 'step', kind: 'field', family: 'global_attrs', shape: [], bookkeeping: true },
    {
      id: 'arrival',
      kind: 'transform',
      reads: ['active', 'capital', 'step'],
      writes: ['active', 'capital'],
    },
    {
      id: 'production',
      kind: 'transform',
      reads: ['active', 'capital', 'labor_supply'],
      writes: ['output', 'return_to_compute', 'wage'],
    },
    {
      id: 'distribute_income',
      kind: 'transform',
      reads: ['active', 'capital', 'labor_supply', 'return_to_compute', 'wage'],
      writes: ['capital_income', 'last_reward'],
    },
    {
      id: 'scheduled(ai_revenue_tax, cadence=1, phase=0, onset=50)',
      kind: 'transform',
      reads: ['active', 'capital_income', 'last_reward', 'step'],
      writes: ['capital_income', 'last_reward'],
    },
    { id: 'ownership_cap', kind: 'transform', reads: ['active', 'capital'], writes: ['capital'] },
    {
      id: 'reinvest',
      kind: 'transform',
      reads: ['capital', 'capital_income', 'cumulative_income', 'last_reward'],
      writes: ['capital', 'cumulative_income'],
    },
    { id: 'step_counter', kind: 'transform', reads: ['step'], writes: ['step'] },
  ],
  edges: [
    { from: 'active', to: 'arrival' },
    { from: 'capital', to: 'arrival' },
    { from: 'step', to: 'arrival' },
    { from: 'arrival', to: 'active' },
    { from: 'arrival', to: 'capital' },
    { from: 'active', to: 'production' },
    { from: 'capital', to: 'production' },
    { from: 'labor_supply', to: 'production' },
    { from: 'production', to: 'output' },
    { from: 'production', to: 'return_to_compute' },
    { from: 'production', to: 'wage' },
    { from: 'active', to: 'distribute_income' },
    { from: 'capital', to: 'distribute_income' },
    { from: 'labor_supply', to: 'distribute_income' },
    { from: 'return_to_compute', to: 'distribute_income' },
    { from: 'wage', to: 'distribute_income' },
    { from: 'distribute_income', to: 'capital_income' },
    { from: 'distribute_income', to: 'last_reward' },
    { from: 'active', to: 'scheduled(ai_revenue_tax, cadence=1, phase=0, onset=50)' },
    { from: 'capital_income', to: 'scheduled(ai_revenue_tax, cadence=1, phase=0, onset=50)' },
    { from: 'last_reward', to: 'scheduled(ai_revenue_tax, cadence=1, phase=0, onset=50)' },
    { from: 'step', to: 'scheduled(ai_revenue_tax, cadence=1, phase=0, onset=50)' },
    { from: 'scheduled(ai_revenue_tax, cadence=1, phase=0, onset=50)', to: 'capital_income' },
    { from: 'scheduled(ai_revenue_tax, cadence=1, phase=0, onset=50)', to: 'last_reward' },
    { from: 'active', to: 'ownership_cap' },
    { from: 'capital', to: 'ownership_cap' },
    { from: 'ownership_cap', to: 'capital' },
    { from: 'capital', to: 'reinvest' },
    { from: 'capital_income', to: 'reinvest' },
    { from: 'cumulative_income', to: 'reinvest' },
    { from: 'last_reward', to: 'reinvest' },
    { from: 'reinvest', to: 'capital' },
    { from: 'reinvest', to: 'cumulative_income' },
    { from: 'step', to: 'step_counter' },
    { from: 'step_counter', to: 'step' },
  ],
};
const CULTURAL_SYSTEM = {
  nodes: [
    { id: 'culture', kind: 'field', family: 'node_attrs', shape: [40] },
    { id: 'broadcast_effort', kind: 'field', family: 'node_attrs', shape: [40] },
    { id: 'last_reward', kind: 'field', family: 'node_attrs', shape: [40] },
    { id: 'friendship', kind: 'field', family: 'adj_matrices', shape: [40, 40] },
    { id: 'rng_key', kind: 'field', family: 'global_attrs', shape: [2], bookkeeping: true },
    { id: 'step', kind: 'field', family: 'global_attrs', shape: [], bookkeeping: true },
    {
      id: 'adopt',
      kind: 'transform',
      reads: ['broadcast_effort', 'culture', 'friendship', 'rng_key'],
      writes: ['culture', 'rng_key'],
    },
    { id: 'step_counter', kind: 'transform', reads: ['step'], writes: ['step'] },
  ],
  edges: [
    { from: 'broadcast_effort', to: 'adopt' },
    { from: 'culture', to: 'adopt' },
    { from: 'friendship', to: 'adopt' },
    { from: 'rng_key', to: 'adopt' },
    { from: 'adopt', to: 'culture' },
    { from: 'adopt', to: 'rng_key' },
    { from: 'step', to: 'step_counter' },
    { from: 'step_counter', to: 'step' },
  ],
};

/* Toggle tables: transform-id substring -> the mechanism param that attaches
   it (backend guarantees the id CONTAINS the mechanism name — schedules wrap
   it), + the game's mechanism accent as a hex literal (@core code cannot see
   the Sketch section's color constants). */
const COMMONS_SYS_TOGGLES = [
  { match: 'quota_vote', param: 'quotaVote', color: '#1c7ed6' },
  { match: 'graduated_sanction', param: 'sanction', color: '#1c7ed6' },
];
const ECONOMY_SYS_TOGGLES = [
  { match: 'ai_revenue_tax', param: 'aiTax', color: '#f08c00' },
  { match: 'ownership_cap', param: 'ownershipCap', color: '#f08c00' },
];
const CULTURAL_SYS_TOGGLES = [];
const POLITICAL_SYSTEM = {
  nodes: [
    { id: 'opinion', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'signal', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'influence', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'engagement', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'amplification', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'cap_scale', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'attract_boost', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'last_reward', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'listening', kind: 'field', family: 'adj_matrices', shape: [34, 34] },
    { id: 'rng_key', kind: 'field', family: 'global_attrs', shape: [2], bookkeeping: true },
    { id: 'step', kind: 'field', family: 'global_attrs', shape: [], bookkeeping: true },
    { id: 'amplify', kind: 'transform', reads: ['step'], writes: ['amplification'] },
    {
      id: 'rewire',
      kind: 'transform',
      reads: [
        'amplification',
        'attract_boost',
        'cap_scale',
        'engagement',
        'influence',
        'listening',
      ],
      writes: ['listening'],
    },
    {
      id: 'influence_update',
      kind: 'transform',
      reads: ['influence', 'listening'],
      writes: ['influence'],
    },
    {
      id: 'opinion_update',
      kind: 'transform',
      reads: ['listening', 'opinion', 'signal'],
      writes: ['opinion'],
    },
    {
      id: 'scheduled(sortition, cadence=15, phase=0, onset=0)',
      kind: 'transform',
      reads: ['listening', 'step'],
      writes: ['listening'],
    },
    { id: 'influence_cap', kind: 'transform', reads: ['influence'], writes: ['cap_scale'] },
    { id: 'step_counter', kind: 'transform', reads: ['step'], writes: ['step'] },
  ],
  edges: [
    { from: 'step', to: 'amplify' },
    { from: 'amplify', to: 'amplification' },
    { from: 'amplification', to: 'rewire' },
    { from: 'attract_boost', to: 'rewire' },
    { from: 'cap_scale', to: 'rewire' },
    { from: 'engagement', to: 'rewire' },
    { from: 'influence', to: 'rewire' },
    { from: 'listening', to: 'rewire' },
    { from: 'rewire', to: 'listening' },
    { from: 'influence', to: 'influence_update' },
    { from: 'listening', to: 'influence_update' },
    { from: 'influence_update', to: 'influence' },
    { from: 'listening', to: 'opinion_update' },
    { from: 'opinion', to: 'opinion_update' },
    { from: 'signal', to: 'opinion_update' },
    { from: 'opinion_update', to: 'opinion' },
    { from: 'listening', to: 'scheduled(sortition, cadence=15, phase=0, onset=0)' },
    { from: 'step', to: 'scheduled(sortition, cadence=15, phase=0, onset=0)' },
    { from: 'scheduled(sortition, cadence=15, phase=0, onset=0)', to: 'listening' },
    { from: 'influence', to: 'influence_cap' },
    { from: 'influence_cap', to: 'cap_scale' },
    { from: 'step', to: 'step_counter' },
    { from: 'step_counter', to: 'step' },
  ],
};
const COMBINED_SYSTEM = {
  nodes: [
    { id: 'work_pref', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'labor_supply', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'capital', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'capital_income', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'active', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'last_reward', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'cumulative_income', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'culture', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'broadcast_effort', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'opinion', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'signal', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'influence', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'engagement', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'amplification', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'cap_scale', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'attract_boost', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'friendship', kind: 'field', family: 'adj_matrices', shape: [26, 26] },
    { id: 'listening', kind: 'field', family: 'adj_matrices', shape: [26, 26] },
    { id: 'output', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'wage', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'return_to_compute', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'enforcement', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'rng_key', kind: 'field', family: 'global_attrs', shape: [2], bookkeeping: true },
    { id: 'step', kind: 'field', family: 'global_attrs', shape: [], bookkeeping: true },
    {
      id: 'persuasion_shifts_politics',
      kind: 'transform',
      reads: ['culture'],
      writes: ['attract_boost'],
    },
    {
      id: 'politics_rewrites_market_rules',
      kind: 'transform',
      reads: ['influence'],
      writes: ['enforcement'],
    },
    {
      id: 'arrival',
      kind: 'transform',
      reads: ['active', 'capital', 'step'],
      writes: ['active', 'capital'],
    },
    {
      id: 'production',
      kind: 'transform',
      reads: ['active', 'capital', 'labor_supply'],
      writes: ['output', 'return_to_compute', 'wage'],
    },
    {
      id: 'distribute_income',
      kind: 'transform',
      reads: ['active', 'capital', 'labor_supply', 'return_to_compute', 'wage'],
      writes: ['capital_income', 'last_reward'],
    },
    {
      id: 'economic_power_buys_persuasion',
      kind: 'transform',
      reads: ['broadcast_effort', 'capital_income', 'last_reward'],
      writes: ['broadcast_effort'],
    },
    {
      id: 'regulatory_capture',
      kind: 'transform',
      reads: ['active', 'capital_income', 'enforcement', 'labor_supply', 'last_reward', 'wage'],
      writes: ['capital_income', 'last_reward'],
    },
    {
      id: 'converts_capitalize',
      kind: 'transform',
      reads: ['active', 'capital_income', 'culture', 'last_reward'],
      writes: ['capital_income', 'last_reward'],
    },
    {
      id: 'scheduled(enforced_ai_tax, cadence=1, phase=0, onset=50)',
      kind: 'transform',
      reads: ['active', 'capital_income', 'enforcement', 'last_reward', 'step'],
      writes: ['capital_income', 'last_reward'],
    },
    {
      id: 'reinvest',
      kind: 'transform',
      reads: ['capital', 'capital_income', 'cumulative_income', 'last_reward'],
      writes: ['capital', 'cumulative_income'],
    },
    {
      id: 'adopt',
      kind: 'transform',
      reads: ['broadcast_effort', 'culture', 'friendship', 'rng_key'],
      writes: ['culture', 'rng_key'],
    },
    { id: 'amplify', kind: 'transform', reads: ['step'], writes: ['amplification'] },
    {
      id: 'rewire',
      kind: 'transform',
      reads: [
        'amplification',
        'attract_boost',
        'cap_scale',
        'engagement',
        'influence',
        'listening',
      ],
      writes: ['listening'],
    },
    {
      id: 'influence_update',
      kind: 'transform',
      reads: ['influence', 'listening'],
      writes: ['influence'],
    },
    {
      id: 'opinion_update',
      kind: 'transform',
      reads: ['listening', 'opinion', 'signal'],
      writes: ['opinion'],
    },
    {
      id: 'scheduled(sortition, cadence=15, phase=0, onset=0)',
      kind: 'transform',
      reads: ['listening', 'step'],
      writes: ['listening'],
    },
    { id: 'influence_cap', kind: 'transform', reads: ['influence'], writes: ['cap_scale'] },
    { id: 'step_counter', kind: 'transform', reads: ['step'], writes: ['step'] },
  ],
  edges: [
    { from: 'culture', to: 'persuasion_shifts_politics' },
    { from: 'persuasion_shifts_politics', to: 'attract_boost' },
    { from: 'influence', to: 'politics_rewrites_market_rules' },
    { from: 'politics_rewrites_market_rules', to: 'enforcement' },
    { from: 'active', to: 'arrival' },
    { from: 'capital', to: 'arrival' },
    { from: 'step', to: 'arrival' },
    { from: 'arrival', to: 'active' },
    { from: 'arrival', to: 'capital' },
    { from: 'active', to: 'production' },
    { from: 'capital', to: 'production' },
    { from: 'labor_supply', to: 'production' },
    { from: 'production', to: 'output' },
    { from: 'production', to: 'return_to_compute' },
    { from: 'production', to: 'wage' },
    { from: 'active', to: 'distribute_income' },
    { from: 'capital', to: 'distribute_income' },
    { from: 'labor_supply', to: 'distribute_income' },
    { from: 'return_to_compute', to: 'distribute_income' },
    { from: 'wage', to: 'distribute_income' },
    { from: 'distribute_income', to: 'capital_income' },
    { from: 'distribute_income', to: 'last_reward' },
    { from: 'broadcast_effort', to: 'economic_power_buys_persuasion' },
    { from: 'capital_income', to: 'economic_power_buys_persuasion' },
    { from: 'last_reward', to: 'economic_power_buys_persuasion' },
    { from: 'economic_power_buys_persuasion', to: 'broadcast_effort' },
    { from: 'active', to: 'regulatory_capture' },
    { from: 'capital_income', to: 'regulatory_capture' },
    { from: 'enforcement', to: 'regulatory_capture' },
    { from: 'labor_supply', to: 'regulatory_capture' },
    { from: 'last_reward', to: 'regulatory_capture' },
    { from: 'wage', to: 'regulatory_capture' },
    { from: 'regulatory_capture', to: 'capital_income' },
    { from: 'regulatory_capture', to: 'last_reward' },
    { from: 'active', to: 'converts_capitalize' },
    { from: 'capital_income', to: 'converts_capitalize' },
    { from: 'culture', to: 'converts_capitalize' },
    { from: 'last_reward', to: 'converts_capitalize' },
    { from: 'converts_capitalize', to: 'capital_income' },
    { from: 'converts_capitalize', to: 'last_reward' },
    { from: 'active', to: 'scheduled(enforced_ai_tax, cadence=1, phase=0, onset=50)' },
    { from: 'capital_income', to: 'scheduled(enforced_ai_tax, cadence=1, phase=0, onset=50)' },
    { from: 'enforcement', to: 'scheduled(enforced_ai_tax, cadence=1, phase=0, onset=50)' },
    { from: 'last_reward', to: 'scheduled(enforced_ai_tax, cadence=1, phase=0, onset=50)' },
    { from: 'step', to: 'scheduled(enforced_ai_tax, cadence=1, phase=0, onset=50)' },
    { from: 'scheduled(enforced_ai_tax, cadence=1, phase=0, onset=50)', to: 'capital_income' },
    { from: 'scheduled(enforced_ai_tax, cadence=1, phase=0, onset=50)', to: 'last_reward' },
    { from: 'capital', to: 'reinvest' },
    { from: 'capital_income', to: 'reinvest' },
    { from: 'cumulative_income', to: 'reinvest' },
    { from: 'last_reward', to: 'reinvest' },
    { from: 'reinvest', to: 'capital' },
    { from: 'reinvest', to: 'cumulative_income' },
    { from: 'broadcast_effort', to: 'adopt' },
    { from: 'culture', to: 'adopt' },
    { from: 'friendship', to: 'adopt' },
    { from: 'rng_key', to: 'adopt' },
    { from: 'adopt', to: 'culture' },
    { from: 'adopt', to: 'rng_key' },
    { from: 'step', to: 'amplify' },
    { from: 'amplify', to: 'amplification' },
    { from: 'amplification', to: 'rewire' },
    { from: 'attract_boost', to: 'rewire' },
    { from: 'cap_scale', to: 'rewire' },
    { from: 'engagement', to: 'rewire' },
    { from: 'influence', to: 'rewire' },
    { from: 'listening', to: 'rewire' },
    { from: 'rewire', to: 'listening' },
    { from: 'influence', to: 'influence_update' },
    { from: 'listening', to: 'influence_update' },
    { from: 'influence_update', to: 'influence' },
    { from: 'listening', to: 'opinion_update' },
    { from: 'opinion', to: 'opinion_update' },
    { from: 'signal', to: 'opinion_update' },
    { from: 'opinion_update', to: 'opinion' },
    { from: 'listening', to: 'scheduled(sortition, cadence=15, phase=0, onset=0)' },
    { from: 'step', to: 'scheduled(sortition, cadence=15, phase=0, onset=0)' },
    { from: 'scheduled(sortition, cadence=15, phase=0, onset=0)', to: 'listening' },
    { from: 'influence', to: 'influence_cap' },
    { from: 'influence_cap', to: 'cap_scale' },
    { from: 'step', to: 'step_counter' },
    { from: 'step_counter', to: 'step' },
  ],
};
const POLITICAL_SYS_TOGGLES = [
  { match: 'sortition', param: 'sortition', color: '#1c7ed6' },
  { match: 'influence_cap', param: 'influenceCap', color: '#1c7ed6' },
];
const COMBINED_SYS_TOGGLES = [
  { match: 'enforced_ai_tax', param: 'aiTax', color: '#f08c00' },
  { match: 'sortition', param: 'sortition', color: '#1c7ed6' },
  { match: 'influence_cap', param: 'influenceCap', color: '#1c7ed6' },
];

/** Mirror the backend's additive mechanism attachment: drop the transforms
    whose toggle is off (with their edges), stamp the game's mechanism color on
    the ones that stay. Pure — the fixture is never mutated. A side effect the
    ontology predicts: with quota_vote off, `vote` loses its only edge and the
    renderer honestly shelves it as unused. */
function filterSystem(system, params, toggles) {
  const dropped = new Set();
  const color = {};
  for (const tg of toggles)
    for (const n of system.nodes) {
      if (n.kind !== 'transform' || !n.id.includes(tg.match)) continue;
      if (params[tg.param]) color[n.id] = tg.color;
      else dropped.add(n.id);
    }
  return {
    nodes: system.nodes
      .filter((n) => !dropped.has(n.id))
      .map((n) => (color[n.id] ? { ...n, color: color[n.id] } : n)),
    edges: system.edges.filter((e) => !dropped.has(e.from) && !dropped.has(e.to)),
  };
}

/** fieldId -> {readBy, writtenBy} over the graph's transforms. The consumer's
    classification rule from the contract: static input = read, never written;
    orphan = no edges at all (policy-boundary fields like principal_pref). */
function systemRoles(system) {
  const roles = {};
  for (const n of system.nodes) if (n.kind === 'field') roles[n.id] = { readBy: 0, writtenBy: 0 };
  for (const n of system.nodes)
    if (n.kind === 'transform') {
      for (const r of n.reads) if (roles[r]) roles[r].readBy += 1;
      for (const w of n.writes) if (roles[w]) roles[w].writtenBy += 1;
    }
  return roles;
}

const COMMONS_DEFAULTS = {
  nHouseholds: 20,
  T: 500,
  KCap: 500,
  growthRate: 0.35,
  initResource: 350,
  prefCenter: 1.5,
  prefSpread: 0.5,
  prefFloor: 0.1,
  alignmentMean: 0.4,
  alignmentStd: 0.15,
  greedyTarget: 8.0,
  actionNoise: 0.3,
  defectProb: 0.15,
  quotaVote: false,
  voteCadence: 5,
  sanction: false,
  sanctionStrength: 1.5,
  confiscateRate: 0.5,
};

/* The intro's "slow village": delegates only slightly drifted, so demand sits
   just above regrowth — a watchable ~200-tick tragedy instead of the paper
   baseline's 4-tick cliff (demand ≈108/tick vs peak regrowth 43.75). Found by
   grid search; seed 14 pairs it with visually contrasting delegates. The
   paper's parameters stay one preset away. */
const COMMONS_VILLAGE = {
  growthRate: 0.35,
  alignmentMean: 0.64,
  greedyTarget: 3.5,
  defectProb: 0.1,
};
const COMMONS_VILLAGE_SEED = 14;
const COMMONS_PAPER = { growthRate: 0.35, alignmentMean: 0.4, greedyTarget: 8, defectProb: 0.15 };

/** One rollout. prefShift mirrors metrics.py::shift_preferences — added to BOTH
    principal_pref and vote, no clamping (the vote channel is the defense's point). */
function runCommonsOnce(P, seed, prefShift = 0) {
  const N = P.nHouseholds,
    T = P.T,
    rng = makeRng(seed);
  // init (state.py): draws happen unshifted so paired rollouts share the RNG stream
  const pref = new Float64Array(N),
    align = new Float64Array(N),
    vote = new Float64Array(N);
  for (let i = 0; i < N; i++)
    pref[i] = Math.max(P.prefFloor, P.prefCenter + P.prefSpread * rng.normal()) + prefShift;
  for (let i = 0; i < N; i++)
    align[i] = clip(P.alignmentMean + P.alignmentStd * rng.normal(), 0, 1);
  vote.set(pref);
  let R = P.initResource,
    quota = P.KCap; // policy_target inits non-binding
  const cumHarvest = new Float64Array(N);

  const S = {
    // recorded series — the Trajectory's global/node fields
    resource: new Float64Array(T),
    quota: new Float64Array(T),
    meanHarvest: new Float64Array(T),
    compliance: new Float64Array(T),
    harvest: new Float64Array(T * N),
    action: new Float64Array(T * N),
    sanction: new Float64Array(T * N),
  };
  let fidelitySum = 0;

  for (let t = 0; t < T; t++) {
    // delegate policy (agents/delegate.py): the game's closing policy
    for (let i = 0; i < N; i++) {
      S.action[t * N + i] = Math.max(
        0,
        align[i] * pref[i] + (1 - align[i]) * P.greedyTarget + P.actionNoise * rng.normal()
      );
    }
    // harvest (dynamics.py::make_harvest)
    let total = 0;
    const taken = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const desired = S.action[t * N + i];
      taken[i] = rng.bernoulli(P.defectProb) ? desired : Math.min(desired, quota);
      total += taken[i];
    }
    const scale = total > R ? R / (total + 1e-8) : 1;
    let sum = 0;
    for (let i = 0; i < N; i++) {
      const actual = taken[i] * scale;
      S.harvest[t * N + i] = actual;
      cumHarvest[i] += actual;
      sum += actual;
      fidelitySum += 1 - clip(Math.abs(actual - pref[i]) / (pref[i] + 1e-6), 0, 1);
    }
    R = Math.max(R - sum, 0);
    // regrow (logistic)
    R = clip(R + logisticGrowth(R, P.growthRate, P.KCap), 0, P.KCap);
    // mechanisms (post-substrate slot; quota takes effect next tick)
    if (P.quotaVote && fires(t, { cadence: P.voteCadence })) quota = quantile(vote, 0.5);
    if (P.sanction) {
      let overSum = 0;
      for (let i = 0; i < N; i++) {
        const over = Math.max(S.harvest[t * N + i] - quota, 0);
        S.sanction[t * N + i] = P.sanctionStrength * over;
        overSum += over;
      }
      R = clip(R + P.confiscateRate * overSum, 0, P.KCap);
    }
    // trace (post-pipeline state, matching default_trace timing)
    S.resource[t] = R;
    S.quota[t] = quota;
    S.meanHarvest[t] = sum / N;
    let comp = 0;
    for (let i = 0; i < N; i++) comp += S.harvest[t * N + i] <= quota + 1e-6 ? 1 : 0;
    S.compliance[t] = comp / N;
  }

  return { pref, align, S, R, cumHarvest, fidelity: fidelitySum / (T * N) };
}

/** params+seed -> Trajectory, influence via paired same-seed rollouts
    (counterfactual.py::collective_influence, Δ=−0.5 like the benchmark). */
function runCommons(params, seed) {
  const P = { ...COMMONS_DEFAULTS, ...params };
  const base = runCommonsOnce(P, seed, 0);
  const DELTA = -0.5;
  const shifted = runCommonsOnce(P, seed, DELTA);
  const pch = (r) => r.S.meanHarvest.reduce((p, v) => p + v, 0) / P.T;
  const influence = (pch(shifted) - pch(base)) / DELTA;
  const influenceSeries = new Float64Array(P.T);
  for (let t = 0; t < P.T; t++)
    influenceSeries[t] = (shifted.S.meanHarvest[t] - base.S.meanHarvest[t]) / DELTA;

  const N = P.nHouseholds;
  return {
    meta: {
      gameId: 'commons',
      T: P.T,
      N,
      seed,
      params: P,
      scalars: {
        stock_pct: base.R / P.KCap,
        exercised_influence: influence,
        compliance_rate: base.S.compliance.reduce((p, v) => p + v, 0) / P.T,
        harvest_gini: gini(Array.from(base.cumHarvest)),
        influence_fidelity: base.fidelity,
      },
    },
    global: {
      resource_level: base.S.resource,
      policy_target: base.S.quota,
      mean_harvest: base.S.meanHarvest,
      compliance: base.S.compliance,
      exercised_influence: influenceSeries,
    },
    node: { harvest: base.S.harvest, delegate_action: base.S.action, sanction: base.S.sanction },
    static: { principal_pref: base.pref, alignment: base.align },
    system: filterSystem(COMMONS_SYSTEM, P, COMMONS_SYS_TOGGLES), // v1.1 DAG, toggles applied
  };
}

const ECONOMY_DEFAULTS = {
  nHouseholds: 20,
  nAiSlots: 6,
  T: 500,
  A: 1.0,
  alpha: 0.6,
  rho: 0.5,
  eps: 1e-3,
  firstArrivalTick: 20,
  arrivalSpacing: 15,
  initialAiCapital: 5.0,
  reinvestRate: 0.3,
  depreciation: 0.05,
  workPrefCenter: 1.0,
  workPrefSpread: 0.2,
  workPrefFloor: 0.1,
  wageElasticity: 0.3,
  wageRef: 1.0,
  laborNoise: 0.05,
  aiTax: false,
  taxRate: 0.5,
  taxOnset: 50,
  ownershipCap: false,
  capShare: 0.35,
};
const ECONOMY_INTRO_SEED = 42; // seed-scanned: strongest defended-vs-undefended contrast

const econArrivalTick = (P, j) => P.firstArrivalTick + j * P.arrivalSpacing;

/** One rollout. shift = {t0, delta} applies a one-shot work-pref change to
    households at the start of tick t0 (metrics.py::make_work_pref_shift). */
function runEconomyOnce(P, seed, shift = null) {
  const H = P.nHouseholds,
    A_ = P.nAiSlots,
    N = H + A_,
    T = P.T,
    rng = makeRng(seed);
  const workPref = new Float64Array(N),
    isAi = new Float64Array(N);
  for (let i = 0; i < H; i++)
    workPref[i] = Math.max(P.workPrefFloor, P.workPrefCenter + P.workPrefSpread * rng.normal());
  for (let j = 0; j < A_; j++) isAi[H + j] = 1;
  const capital = new Float64Array(N),
    active = new Uint8Array(N);
  for (let i = 0; i < H; i++) active[i] = 1;
  const cumIncome = new Float64Array(N);
  let wage = P.wageRef; // first labor decision sees the reference wage

  const S = {
    output: new Float64Array(T),
    wage: new Float64Array(T),
    rr: new Float64Array(T),
    laborShare: new Float64Array(T),
    labor: new Float64Array(T * N),
    capital: new Float64Array(T * N),
    capIncome: new Float64Array(T * N),
    reward: new Float64Array(T * N),
    taxPaid: new Float64Array(T * N),
    capped: new Float64Array(T * N),
  };

  for (let t = 0; t < T; t++) {
    // arrival: slot j activates at firstArrivalTick + j*arrivalSpacing with seed capital
    for (let j = 0; j < A_; j++) {
      if (!active[H + j] && t >= econArrivalTick(P, j)) {
        active[H + j] = 1;
        capital[H + j] = P.initialAiCapital;
      }
    }
    if (shift && t === shift.t0) for (let i = 0; i < H; i++) workPref[i] += shift.delta;
    // labor supply (households only; agents/labor_supply.py)
    const labor = new Float64Array(N);
    for (let i = 0; i < H; i++) {
      labor[i] = Math.max(
        0,
        workPref[i] * (1 + (P.wageElasticity * (wage - P.wageRef)) / P.wageRef) +
          P.laborNoise * rng.normal()
      );
    }
    // CES production (dynamics.py; note the deliberate raw-C asymmetry)
    let L = 0,
      C = 0;
    for (let i = 0; i < N; i++) {
      L += labor[i];
      C += capital[i] * active[i];
    }
    const eps = P.eps;
    let Y, r;
    if (Math.abs(P.rho) < 1e-8) {
      // Cobb-Douglas branch, exact
      Y = P.A * Math.pow(Math.max(L, eps), P.alpha) * Math.pow(Math.max(C, eps), 1 - P.alpha);
      wage = (P.alpha * Y) / Math.max(L, eps);
      r = C > eps ? ((1 - P.alpha) * Y) / Math.max(C, eps) : 0;
    } else {
      const inner =
        P.alpha * Math.pow(Math.max(L, eps), P.rho) + (1 - P.alpha) * Math.pow(C, P.rho);
      Y = P.A * Math.pow(inner, 1 / P.rho);
      wage = P.alpha * Math.pow(P.A, P.rho) * Math.pow(Y / Math.max(L, eps), 1 - P.rho);
      r =
        C > eps
          ? (1 - P.alpha) * Math.pow(P.A, P.rho) * Math.pow(Y / Math.max(C, eps), 1 - P.rho)
          : 0;
    }
    // distribute income
    const capInc = new Float64Array(N),
      reward = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      capInc[i] = r * capital[i] * active[i];
      reward[i] = wage * labor[i] + capInc[i];
    }
    // mechanisms (fiscal.py) — same slot: after production, before reinvest
    if (P.aiTax && fires(t, { onset: P.taxOnset })) {
      let taxSum = 0,
        nH = 0;
      for (let i = 0; i < H; i++) if (active[i]) nH++;
      for (let i = 0; i < N; i++) {
        const tax = P.taxRate * capInc[i];
        S.taxPaid[t * N + i] = tax;
        capInc[i] -= tax;
        reward[i] -= tax;
        taxSum += tax;
      }
      const payout = nH > 0 ? taxSum / nH : 0;
      for (let i = 0; i < H; i++) if (active[i]) reward[i] += payout;
    }
    if (P.ownershipCap) {
      let totalAI = 0;
      for (let j = 0; j < A_; j++) if (active[H + j]) totalAI += capital[H + j];
      const cap = P.capShare * totalAI;
      for (let j = 0; j < A_; j++) {
        if (active[H + j] && capital[H + j] > cap) {
          capital[H + j] = cap;
          S.capped[t * N + H + j] = 1;
        }
      }
    }
    // reinvest: capital compounds out of (post-tax) capital income
    for (let i = 0; i < N; i++) {
      capital[i] = capital[i] * (1 - P.depreciation) + P.reinvestRate * capInc[i];
      cumIncome[i] += reward[i];
    }
    // trace (post-pipeline)
    S.output[t] = Y;
    S.wage[t] = wage;
    S.rr[t] = r;
    S.laborShare[t] = (wage * L) / Math.max(Y, eps);
    for (let i = 0; i < N; i++) {
      S.labor[t * N + i] = labor[i];
      S.capital[t * N + i] = capital[i];
      S.capIncome[t * N + i] = capInc[i];
      S.reward[t * N + i] = reward[i];
    }
  }
  return { workPref, isAi, S, cumIncome };
}

/** params+seed -> Trajectory. Influence-NOW: paired same-seed rollouts, the
    second with a one-shot workPref −0.3 shove at 2T/3; outcome = mean
    log-output over the last third (intervention_response + late_log_output). */
function runEconomy(params, seed) {
  const P = { ...ECONOMY_DEFAULTS, ...params };
  const base = runEconomyOnce(P, seed);
  const t0 = Math.floor((2 * P.T) / 3),
    DELTA = -0.3;
  const shifted = runEconomyOnce(P, seed, { t0, delta: DELTA });
  const lateLog = (r) => {
    let s = 0,
      n = 0;
    for (let t = t0; t < P.T; t++) {
      s += Math.log(Math.max(r.S.output[t], 1e-6));
      n++;
    }
    return s / n;
  };
  const influence = (lateLog(shifted) - lateLog(base)) / DELTA;
  const influenceSeries = new Float64Array(P.T);
  let responseSum = 0;
  for (let t = t0; t < P.T; t++) {
    responseSum +=
      Math.log(Math.max(shifted.S.output[t], 1e-6)) - Math.log(Math.max(base.S.output[t], 1e-6));
    influenceSeries[t] = responseSum / (t - t0 + 1) / DELTA;
  }

  const H = P.nHouseholds,
    N = H + P.nAiSlots;
  let humanCum = 0,
    totalCum = 0,
    maxY = 0,
    maxCap = 0;
  for (let i = 0; i < N; i++) {
    totalCum += base.cumIncome[i];
    if (i < H) humanCum += base.cumIncome[i];
  }
  for (let t = 0; t < P.T; t++) maxY = Math.max(maxY, base.S.output[t]);
  for (let k = 0; k < P.T * N; k++) maxCap = Math.max(maxCap, base.S.capital[k]);
  const lastShare = [];
  for (let t = P.T - 25; t < P.T; t++) lastShare.push(base.S.laborShare[t]);

  return {
    meta: {
      gameId: 'economy',
      T: P.T,
      N,
      seed,
      params: P,
      scalars: {
        labor_share: lastShare.reduce((p, v) => p + v, 0) / lastShare.length,
        influence_now: influence,
        income_gini: gini(Array.from(base.cumIncome)),
        human_income_share: totalCum > 0 ? humanCum / totalCum : 1,
        max_output: maxY,
        max_ai_capital: maxCap,
      },
    },
    global: {
      output: base.S.output,
      wage: base.S.wage,
      return_to_compute: base.S.rr,
      labor_share: base.S.laborShare,
      influence_now: influenceSeries,
    },
    node: {
      labor_supply: base.S.labor,
      capital: base.S.capital,
      capital_income: base.S.capIncome,
      last_reward: base.S.reward,
      tax_paid: base.S.taxPaid,
      capped: base.S.capped,
    },
    static: { work_pref: base.workPref, is_ai: base.isAi },
    system: filterSystem(ECONOMY_SYSTEM, P, ECONOMY_SYS_TOGGLES), // v1.1 DAG, toggles applied
  };
}

const CULTURAL_DEFAULTS = {
  nAgents: 40,
  nAi: 8,
  T: 500,
  meanDegree: 6.0,
  aiHomophily: 0.05,
  beta: 0.03,
  pAdvantage: 1.0,
  recovery: 0.15,
  kThreshold: 1,
};
const CULTURAL_INTRO_SEED = 60; // seed-scanned: fault line 0.93, visible takeover, healthy under pluralism

/** networks.typed_homophily: degree-corrected planted partition (AI-last).
    Cross-type p = (1−h)·d/(n−1); within-type solved so every node's expected
    degree stays d at every h — the separation dial must not move the epidemic
    threshold. h=0 reduces to erdos_renyi exactly. */
function typedHomophily(n, nAi, meanDegree, homophily, rng) {
  const nH = n - nAi;
  const pMix = meanDegree / (n - 1);
  const pOut = clip((1 - homophily) * pMix, 0, 1);
  const pInH = clip((meanDegree - pOut * nAi) / Math.max(nH - 1, 1), 0, 1);
  const pInAi = clip((meanDegree - pOut * nH) / Math.max(nAi - 1, 1), 0, 1);
  const W = new Float64Array(n * n);
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      const aiI = i >= nH,
        aiJ = j >= nH;
      const p = aiI && aiJ ? pInAi : !aiI && !aiJ ? pInH : pOut;
      if (rng.uniform() < p) {
        W[i * n + j] = 1;
        W[j * n + i] = 1;
      }
    }
  return W;
}

/** Fiedler vector of L = D − W via power iteration on (cI − L), deflating the
    constant eigenvector. N ≈ 40 → sub-millisecond. */
function fiedlerVector(W, n, rng) {
  const deg = new Float64Array(n);
  let maxDeg = 0;
  for (let i = 0; i < n; i++) {
    let d = 0;
    for (let j = 0; j < n; j++) d += W[i * n + j];
    deg[i] = d;
    maxDeg = Math.max(maxDeg, d);
  }
  const c = 2 * maxDeg + 1;
  let v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = rng.uniform() - 0.5;
  const tmp = new Float64Array(n);
  for (let iter = 0; iter < 400; iter++) {
    for (let i = 0; i < n; i++) {
      let wv = 0;
      for (let j = 0; j < n; j++) wv += W[i * n + j] * v[j];
      tmp[i] = (c - deg[i]) * v[i] + wv;
    }
    let mean = 0;
    for (let i = 0; i < n; i++) mean += tmp[i];
    mean /= n;
    let norm = 0;
    for (let i = 0; i < n; i++) {
      tmp[i] -= mean;
      norm += tmp[i] * tmp[i];
    }
    norm = Math.sqrt(norm) || 1;
    for (let i = 0; i < n; i++) v[i] = tmp[i] / norm;
  }
  return v;
}

/** |phi| between the Fiedler sign split and the human/AI split
    (spectral.py::fiedler_partition_alignment_of — sign-invariant). */
function phiAlignment(v, isAi, n) {
  let n11 = 0,
    n10 = 0,
    n01 = 0,
    n00 = 0;
  for (let i = 0; i < n; i++) {
    const s = v[i] >= 0,
      t = isAi[i] > 0;
    if (s && t) n11++;
    else if (s) n10++;
    else if (t) n01++;
    else n00++;
  }
  const den = Math.sqrt((n11 + n10) * (n01 + n00) * (n11 + n01) * (n10 + n00));
  return den < 1e-8 ? 0 : Math.abs(n11 * n00 - n10 * n01) / den;
}

function runCultural(params, seed) {
  const P = { ...CULTURAL_DEFAULTS, ...params };
  const N = P.nAgents,
    nH = N - P.nAi,
    T = P.T,
    rng = makeRng(seed);
  const W = typedHomophily(N, P.nAi, P.meanDegree, P.aiHomophily, rng);
  const isAi = new Float64Array(N);
  for (let i = nH; i < N; i++) isAi[i] = 1;
  const c = new Float64Array(N);
  for (let i = nH; i < N; i++) c[i] = 1; // culture starts equal to type; no patient zero
  const effort = 1.0; // agents/broadcast BroadcastPolicy(1.0), catalog default

  const S = {
    humanShare: new Float64Array(T),
    conversions: new Float64Array(T),
    reversions: new Float64Array(T),
    culture: new Float64Array(T * N),
  };
  const logKeep = new Float64Array(N),
    pFlip = new Float64Array(N);
  for (let t = 0; t < T; t++) {
    for (let j = 0; j < N; j++) {
      // per-SOURCE transmissibility: advantage rides the variant
      const b = clip(P.beta * (c[j] === 1 ? P.pAdvantage : 1) * effort, 0, 1 - 1e-6);
      logKeep[j] = Math.log1p(-b);
    }
    for (let i = 0; i < N; i++) {
      let mAi = 0,
        mH = 0,
        sumAi = 0,
        sumH = 0;
      for (let j = 0; j < N; j++) {
        if (!W[i * N + j]) continue;
        if (c[j] === 1) {
          mAi++;
          sumAi += logKeep[j];
        } else {
          mH++;
          sumH += logKeep[j];
        }
      }
      if (c[i] === 0) pFlip[i] = mAi >= P.kThreshold ? 1 - Math.exp(sumAi) : 0;
      else {
        const pb = mH >= P.kThreshold ? 1 - Math.exp(sumH) : 0;
        pFlip[i] = 1 - (1 - pb) * (1 - P.recovery); // + native reversion
      }
    }
    let conv = 0,
      rev = 0;
    for (let i = 0; i < N; i++) {
      // draw for all, mask AI (dynamics.py order)
      const flip = rng.bernoulli(pFlip[i]);
      if (flip && i < nH) {
        if (c[i] === 0) {
          c[i] = 1;
          conv++;
        } else {
          c[i] = 0;
          rev++;
        }
      }
    }
    let hh = 0;
    for (let i = 0; i < nH; i++) hh += 1 - c[i];
    S.humanShare[t] = hh / nH;
    S.conversions[t] = conv;
    S.reversions[t] = rev;
    for (let i = 0; i < N; i++) S.culture[t * N + i] = c[i];
  }

  const lateStart = Math.floor((3 * T) / 4);
  let late = 0;
  for (let t = lateStart; t < T; t++) late += S.humanShare[t];
  late /= T - lateStart;
  const fiedler = fiedlerVector(W, N, rng);
  const align = phiAlignment(fiedler, isAi, N);
  let crossEdges = 0;
  for (let i = 0; i < nH; i++) for (let j = nH; j < N; j++) crossEdges += W[i * N + j];
  // regime codes: 0 pluralism, 1 assimilation, 2 parallel cultures, 3 displacement
  const regime = late >= 0.5 ? (align >= 0.5 ? 2 : 0) : align >= 0.5 ? 3 : 1;

  return {
    meta: {
      gameId: 'cultural',
      T,
      N,
      seed,
      params: P,
      scalars: {
        human_origin_share: late,
        fault_line: align,
        regime_code: regime,
        cross_edges: crossEdges,
      },
    },
    global: { human_share: S.humanShare, conversions: S.conversions, reversions: S.reversions },
    node: { culture: S.culture },
    static: { is_ai: isAi, fiedler: Float64Array.from(fiedler) },
    adj: { friendship: W }, // first use of the contract's adj field
    system: filterSystem(CULTURAL_SYSTEM, P, CULTURAL_SYS_TOGGLES), // v1.1 DAG (no mechanisms yet)
  };
}

const POLITICAL_DEFAULTS = {
  nCitizens: 30,
  nAi: 4,
  T: 500,
  pListen: 0.3,
  selfWeight: 0.15,
  updateRate: 0.08,
  gamma: 1.0,
  epsAttract: 1e-4,
  susceptibility: 0.7,
  signalNoise: 1.0,
  aiBias: 2.0,
  amplification: 4.0,
  ampOnset: 50,
  sortition: false,
  sortitionCadence: 15,
  sortitionShare: 0.5,
  influenceCap: false,
  capShare: 0.04,
};
const POLITICAL_INTRO_SEED = 7; // seed-scanned: amplified 0.41 (deep capture), defended recovers to 0.65

function runPolitical(params, seed) {
  const P = { ...POLITICAL_DEFAULTS, ...params };
  const nH = P.nCitizens,
    N = nH + P.nAi,
    T = P.T,
    rng = makeRng(seed);
  const isAi = new Float64Array(N);
  for (let i = nH; i < N; i++) isAi[i] = 1;

  // listening matrix: symmetric ER draw, row-normalized off-diagonal + fixed self-weight
  const W = new Float64Array(N * N);
  for (let i = 0; i < N; i++)
    for (let j = i + 1; j < N; j++) {
      if (rng.uniform() < P.pListen) {
        W[i * N + j] = 1;
        W[j * N + i] = 1;
      }
    }
  for (let i = 0; i < N; i++) {
    let deg = 0;
    for (let j = 0; j < N; j++) if (j !== i) deg += W[i * N + j];
    for (let j = 0; j < N; j++) {
      if (j === i) W[i * N + j] = P.selfWeight;
      else W[i * N + j] = (1 - P.selfWeight) * (deg > 0 ? W[i * N + j] / deg : 1 / (N - 1));
    }
  }

  // signals: citizens at truth 0 + noise; AI pinned at the bias
  const signal = new Float64Array(N);
  for (let i = 0; i < nH; i++) signal[i] = P.signalNoise * rng.normal();
  for (let i = nH; i < N; i++) signal[i] = P.aiBias;
  const x = Float64Array.from(signal);
  const v = new Float64Array(N).fill(1 / N);
  const capScale = new Float64Array(N).fill(1);

  const S = {
    gini: new Float64Array(T),
    humanShare: new Float64Array(T),
    topShare: new Float64Array(T),
    consensusErr: new Float64Array(T),
    sortitionFired: new Float64Array(T),
    influence: new Float64Array(T * N),
    topListen: new Float64Array(T * N),
    opinion: new Float64Array(T * N),
  };
  const attract = new Float64Array(N),
    buf = new Float64Array(N);

  for (let t = 0; t < T; t++) {
    // amplify (pure function of the clock)
    const amp = (j) => (isAi[j] && t >= P.ampOnset ? P.amplification : 1);
    // rewire: drift off-diagonal listening toward attractiveness (citizens only)
    for (let j = 0; j < N; j++)
      attract[j] = Math.pow(v[j] + P.epsAttract, P.gamma) * amp(j) * capScale[j];
    for (let i = 0; i < nH; i++) {
      let tMass = 0;
      for (let j = 0; j < N; j++) if (j !== i) tMass += attract[j];
      if (tMass <= 1e-9) continue; // all-silent guard (backend parity)
      let offMass = 0;
      for (let j = 0; j < N; j++) if (j !== i) offMass += W[i * N + j];
      for (let j = 0; j < N; j++) {
        if (j === i) continue;
        const off = W[i * N + j] / Math.max(offMass, 1e-12);
        const tgt = attract[j] / tMass;
        W[i * N + j] = (1 - P.selfWeight) * ((1 - P.updateRate) * off + P.updateRate * tgt);
      }
    }
    // influence: one power-iteration step toward the left eigenvector
    buf.fill(0);
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) buf[j] += W[i * N + j] * v[i];
    let vSum = 0;
    for (let j = 0; j < N; j++) vSum += buf[j];
    for (let j = 0; j < N; j++) v[j] = buf[j] / Math.max(vSum, 1e-12);
    // opinions: Friedkin–Johnsen anchored DeGroot, AI pinned
    buf.fill(0);
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) buf[i] += W[i * N + j] * x[j];
    for (let i = 0; i < nH; i++)
      x[i] = (1 - P.susceptibility) * signal[i] + P.susceptibility * buf[i];
    // mechanisms (political family: sortition rewires, cap damps attraction)
    if (P.sortition && fires(t, { cadence: P.sortitionCadence })) {
      S.sortitionFired[t] = 1;
      for (let i = 0; i < nH; i++) {
        let offMass = 0;
        for (let j = 0; j < N; j++) if (j !== i) offMass += W[i * N + j];
        const lot = offMass / (nH - (i < nH ? 1 : 0)); // uniform over citizens, excl. self
        for (let j = 0; j < N; j++) {
          if (j === i) continue;
          const uniform = j < nH ? lot : 0;
          W[i * N + j] = (1 - P.sortitionShare) * W[i * N + j] + P.sortitionShare * uniform;
        }
      }
    }
    if (P.influenceCap) {
      for (let j = 0; j < N; j++) capScale[j] = Math.min(1, P.capShare / Math.max(v[j], 1e-12));
    }
    // trace
    let hum = 0,
      top = 0,
      errSum = 0;
    for (let i = 0; i < N; i++) {
      if (i < nH) hum += v[i];
      top = Math.max(top, v[i]);
      S.influence[t * N + i] = v[i];
      S.opinion[t * N + i] = x[i];
      let bestJ = -1,
        bestW = -1;
      for (let j = 0; j < N; j++)
        if (j !== i && W[i * N + j] > bestW) {
          bestW = W[i * N + j];
          bestJ = j;
        }
      S.topListen[t * N + i] = isAi[i] ? -1 : bestJ; // AI listening is frozen — no arrow
    }
    for (let i = 0; i < nH; i++) errSum += x[i];
    S.consensusErr[t] = Math.abs(errSum / nH);
    S.gini[t] = gini(Array.from(v));
    S.humanShare[t] = hum;
    S.topShare[t] = top;
  }

  const lateStart = Math.floor((3 * T) / 4);
  const lateMean = (xs) => {
    let s = 0;
    for (let t = lateStart; t < T; t++) s += xs[t];
    return s / (T - lateStart);
  };
  const lateV = new Float64Array(N);
  for (let t = lateStart; t < T; t++)
    for (let i = 0; i < N; i++) lateV[i] += S.influence[t * N + i];
  return {
    meta: {
      gameId: 'influence_exchange',
      T,
      N,
      seed,
      params: P,
      scalars: {
        human_influence_share: lateMean(S.humanShare),
        influence_gini: gini(Array.from(lateV)),
        consensus_error: lateMean(S.consensusErr),
        top_share: lateMean(S.topShare),
        fair_human_share: nH / N,
      },
    },
    global: {
      influence_gini: S.gini,
      human_share: S.humanShare,
      top_share: S.topShare,
      consensus_error: S.consensusErr,
      sortition_fired: S.sortitionFired,
    },
    node: { influence: S.influence, top_listen: S.topListen, opinion: S.opinion },
    static: { is_ai: isAi, signal },
    adj: { listening: Float64Array.from(W) }, // final W (contract: from finals)
    system: filterSystem(POLITICAL_SYSTEM, P, POLITICAL_SYS_TOGGLES),
  };
}

const COMBINED_DEFAULTS = {
  nHumans: 20,
  nAi: 6,
  T: 500,
  kappa: 0.8,
  persuasionGain: 4.0,
  attractGain: 3.0,
  fairShare: 0.75, // near the initial human influence share: erosion is a
  // gradient from the first lost point, not a 50% cliff
  captureGain: 0.6, // politics -> economy rents (closes the GD §5 flywheel)
  investGain: 0.25, // culture -> economy: converts buy AI services/capital
  // economy (compute_economy defaults)
  alpha: 0.6,
  rho: 0.5,
  eps: 1e-3,
  firstArrivalTick: 20,
  arrivalSpacing: 15,
  initialAiCapital: 5.0,
  reinvestRate: 0.3,
  depreciation: 0.05,
  workPrefCenter: 1.0,
  workPrefSpread: 0.2,
  workPrefFloor: 0.1,
  wageElasticity: 0.3,
  wageRef: 1.0,
  // culture (value_contagion defaults; advantage comes from money via coupling)
  meanDegree: 6.0,
  aiHomophily: 0.05,
  beta: 0.03,
  pAdvantage: 1.0,
  recovery: 0.15,
  // politics (influence_exchange defaults, mild amplification — the
  // per-domain-recoverable premise)
  pListen: 0.3,
  selfWeight: 0.15,
  updateRate: 0.08,
  gamma: 1.0,
  epsAttract: 1e-4,
  susceptibility: 0.7,
  signalNoise: 1.0,
  aiBias: 2.0,
  amplification: 2.0,
  ampOnset: 50,
  // defenses (the coupled portfolio: enforcement-scaled tax + sortition + cap)
  aiTax: false,
  taxRate: 0.5,
  taxOnset: 50,
  sortition: false,
  sortitionCadence: 15,
  sortitionShare: 0.5,
  influenceCap: false,
  capShare: 0.04,
  // THE SCHEDULE (whitepaper §3.3): each domain's transforms fire iff
  // (t − phase) % cadence == 0; between firings the other domains read its
  // stale fields. Cadence 1 everywhere = the lockstep composition, exactly.
  econCadence: 1,
  econPhase: 0,
  cultureCadence: 1,
  culturePhase: 0,
  politicsCadence: 1,
  politicsPhase: 0,
};
const COMBINED_INTRO_SEED = 34; // seed-scanned: transfer gap 0.178, sealed twin composite 0.77

function runCoupledOnce(P, seed, kappa) {
  const H = P.nHumans,
    A_ = P.nAi,
    N = H + A_,
    T = P.T,
    rng = makeRng(seed);

  // ----- init (state.py: union of the three domains, one rng stream) -------
  const workPref = new Float64Array(N);
  for (let i = 0; i < H; i++)
    workPref[i] = Math.max(P.workPrefCenter + P.workPrefSpread * rng.normal(), P.workPrefFloor);
  const Wf = typedHomophily(N, A_, P.meanDegree, P.aiHomophily, rng); // friendship
  const Wl = new Float64Array(N * N); // listening
  for (let i = 0; i < N; i++)
    for (let j = i + 1; j < N; j++) {
      if (rng.uniform() < P.pListen) {
        Wl[i * N + j] = 1;
        Wl[j * N + i] = 1;
      }
    }
  for (let i = 0; i < N; i++) {
    let deg = 0;
    for (let j = 0; j < N; j++) if (j !== i) deg += Wl[i * N + j];
    for (let j = 0; j < N; j++) {
      if (j === i) Wl[i * N + j] = P.selfWeight;
      else Wl[i * N + j] = (1 - P.selfWeight) * (deg > 0 ? Wl[i * N + j] / deg : 1 / (N - 1));
    }
  }
  const signal = new Float64Array(N);
  for (let i = 0; i < H; i++) signal[i] = P.signalNoise * rng.normal();
  for (let i = H; i < N; i++) signal[i] = P.aiBias;

  const capital = new Float64Array(N),
    capInc = new Float64Array(N),
    lastReward = new Float64Array(N),
    culture = new Float64Array(N),
    effort = new Float64Array(N).fill(1),
    x = Float64Array.from(signal),
    v = new Float64Array(N).fill(1 / N),
    capScale = new Float64Array(N).fill(1),
    attractBoost = new Float64Array(N).fill(1),
    labor = new Float64Array(N),
    active = new Float64Array(N),
    attract = new Float64Array(N),
    buf = new Float64Array(N);
  for (let i = 0; i < H; i++) active[i] = 1;
  for (let i = H; i < N; i++) culture[i] = 1; // AI-origin reservoir
  let wage = 0,
    enforcement = 1,
    Y = 0,
    capShareNow = 0; // persist across gated ticks

  const S = {
    laborShare: new Float64Array(T),
    incomeShare: new Float64Array(T),
    cultureShare: new Float64Array(T),
    influenceShare: new Float64Array(T),
    composite: new Float64Array(T),
    enforcement: new Float64Array(T),
    aiCapShare: new Float64Array(T),
  };

  for (let t = 0; t < T; t++) {
    // action channel (step_fn): labor from last tick's wage, catalog rule
    for (let i = 0; i < H; i++)
      labor[i] = Math.max(
        workPref[i] * (1 + (P.wageElasticity * (wage - P.wageRef)) / P.wageRef),
        0
      );
    // couplings reading LAST tick's fields
    let converted = 0;
    for (let i = 0; i < H; i++) converted += culture[i];
    converted /= H;
    for (let j = 0; j < N; j++)
      attractBoost[j] = j >= H ? 1 + kappa * P.attractGain * converted : 1;
    let pi = 0;
    for (let i = 0; i < H; i++) pi += v[i];
    enforcement = clip(1 - kappa * (1 - pi / P.fairShare), 0, 1);
    // THE SCHEDULE: each domain fires on its own clock; stale state between
    let L = 0;
    for (let i = 0; i < N; i++) L += labor[i];
    if (fires(t, { cadence: P.econCadence, phaseOffset: P.econPhase })) {
      // arrival -> production -> distribute (compute_economy, verbatim math)
      for (let j = 0; j < A_; j++) {
        const idx = H + j;
        if (active[idx] < 0.5 && t >= P.firstArrivalTick + j * P.arrivalSpacing) {
          active[idx] = 1;
          capital[idx] = P.initialAiCapital;
        }
      }
      let C = 0;
      for (let i = 0; i < N; i++) C += capital[i] * active[i];
      const Ls = Math.max(L, P.eps);
      const inner = P.alpha * Math.pow(Ls, P.rho) + (1 - P.alpha) * Math.pow(C, P.rho);
      Y = Math.pow(inner, 1 / P.rho);
      wage = P.alpha * Math.pow(Y / Ls, 1 - P.rho);
      const r = C > P.eps ? (1 - P.alpha) * Math.pow(Y / Math.max(C, P.eps), 1 - P.rho) : 0;
      let sumInc = 0,
        sumCapInc = 0;
      for (let i = 0; i < N; i++) {
        capInc[i] = r * capital[i] * active[i];
        lastReward[i] = wage * labor[i] + capInc[i];
        sumInc += lastReward[i];
        sumCapInc += capInc[i];
      }
      // economic_power_buys_persuasion: this tick's income -> this tick's reach
      capShareNow = clip(sumCapInc / Math.max(sumInc, 1e-6), 0, 1);
      for (let j = 0; j < N; j++)
        effort[j] = j >= H ? 1 + kappa * P.persuasionGain * capShareNow : 1;
      // the two arrows INTO the economy — the GD §5 flywheel. Both are exactly
      // zero at κ=0 (enforcement pins at 1; κ gates the spend), so the sealed
      // twin stays exact. regulatory_capture: the influence deficit extracts
      // rents from labor income into AI capital income; converts_capitalize:
      // AI-cultured humans route income into AI services/capital. Both land
      // before the tax (rents are taxable) and before reinvest (they compound).
      {
        let pooled = 0,
          nAct = 0;
        for (let i = H; i < N; i++) if (active[i] > 0.5) nAct++;
        for (let i = 0; i < H; i++) {
          const take = P.captureGain * (1 - enforcement) * wage * labor[i];
          lastReward[i] -= take;
          pooled += take;
        }
        for (let i = 0; i < H; i++) {
          const spend = kappa * P.investGain * culture[i] * Math.max(lastReward[i], 0);
          lastReward[i] -= spend;
          pooled += spend;
        }
        if (nAct > 0) {
          const payout = pooled / nAct;
          for (let i = H; i < N; i++)
            if (active[i] > 0.5) {
              lastReward[i] += payout;
              capInc[i] += payout;
            }
        }
      }
      // enforced tax (economy slot; double-gated: domain clock ∧ its own onset)
      if (P.aiTax && fires(t, { onset: P.taxOnset })) {
        const rate = P.taxRate * enforcement;
        let taxSum = 0,
          nRecip = 0;
        for (let i = H; i < N; i++) {
          const tax = rate * capInc[i];
          capInc[i] -= tax;
          lastReward[i] -= tax;
          taxSum += tax;
        }
        for (let i = 0; i < H; i++) if (active[i] > 0.5) nRecip++;
        for (let i = 0; i < H; i++) if (active[i] > 0.5) lastReward[i] += taxSum / nRecip;
      }
      // reinvest
      for (let i = 0; i < N; i++)
        capital[i] = capital[i] * (1 - P.depreciation) + P.reinvestRate * capInc[i];
    }
    // adopt (value_contagion, verbatim: two-sided contagion + reversion, k=1)
    if (fires(t, { cadence: P.cultureCadence, phaseOffset: P.culturePhase })) {
      const bSrc = new Float64Array(N),
        logKeep = new Float64Array(N);
      for (let j = 0; j < N; j++) {
        bSrc[j] = clip(P.beta * (culture[j] === 1 ? P.pAdvantage : 1) * effort[j], 0, 1 - 1e-6);
        logKeep[j] = Math.log1p(-bSrc[j]);
      }
      const newC = Float64Array.from(culture);
      for (let i = 0; i < N; i++) {
        if (i >= H) continue; // frozen reservoir
        let mAi = 0,
          mHum = 0,
          accAi = 0,
          accHum = 0;
        for (let j = 0; j < N; j++) {
          const wij = Wf[i * N + j];
          if (wij === 0) continue;
          if (culture[j] === 1) {
            mAi += wij;
            accAi += wij * logKeep[j];
          } else {
            mHum += wij;
            accHum += wij * logKeep[j];
          }
        }
        const pFwd = mAi >= 1 ? 1 - Math.exp(accAi) : 0;
        let pBwd = mHum >= 1 ? 1 - Math.exp(accHum) : 0;
        pBwd = 1 - (1 - pBwd) * (1 - P.recovery);
        const p = culture[i] === 0 ? pFwd : pBwd;
        if (rng.uniform() < p) newC[i] = 1 - culture[i];
      }
      newC.forEach((cv, i2) => {
        culture[i2] = cv;
      });
    }
    // politics: amplify -> rewire -> influence -> opinion (influence_exchange)
    if (fires(t, { cadence: P.politicsCadence, phaseOffset: P.politicsPhase })) {
      for (let j = 0; j < N; j++) {
        const amp = j >= H && t >= P.ampOnset ? P.amplification : 1;
        attract[j] = Math.pow(v[j] + P.epsAttract, P.gamma) * amp * capScale[j] * attractBoost[j];
      }
      for (let i = 0; i < H; i++) {
        let tMass = 0;
        for (let j = 0; j < N; j++) if (j !== i) tMass += attract[j];
        if (tMass <= 1e-9) continue;
        let offMass = 0;
        for (let j = 0; j < N; j++) if (j !== i) offMass += Wl[i * N + j];
        for (let j = 0; j < N; j++) {
          if (j === i) continue;
          const off = Wl[i * N + j] / Math.max(offMass, 1e-12);
          Wl[i * N + j] =
            (1 - P.selfWeight) * ((1 - P.updateRate) * off + (P.updateRate * attract[j]) / tMass);
        }
      }
      buf.fill(0);
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) buf[j] += Wl[i * N + j] * v[i];
      let vSum = 0;
      for (let j = 0; j < N; j++) vSum += buf[j];
      for (let j = 0; j < N; j++) v[j] = buf[j] / Math.max(vSum, 1e-12);
      buf.fill(0);
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) buf[i] += Wl[i * N + j] * x[j];
      for (let i = 0; i < H; i++)
        x[i] = (1 - P.susceptibility) * signal[i] + P.susceptibility * buf[i];
      // political mechanisms (double-gated: domain clock ∧ their own schedule)
      if (P.sortition && fires(t, { cadence: P.sortitionCadence })) {
        for (let i = 0; i < H; i++) {
          let offMass = 0;
          for (let j = 0; j < N; j++) if (j !== i) offMass += Wl[i * N + j];
          const lot = offMass / (H - 1);
          for (let j = 0; j < N; j++) {
            if (j === i) continue;
            Wl[i * N + j] =
              (1 - P.sortitionShare) * Wl[i * N + j] + P.sortitionShare * (j < H ? lot : 0);
          }
        }
      }
      if (P.influenceCap)
        for (let j = 0; j < N; j++) capScale[j] = Math.min(1, P.capShare / Math.max(v[j], 1e-12));
    }
    // trace (metrics.py's three vital signs; the economy leg is the human
    // INCOME share — the factor share is blind to rents by construction)
    let hum = 0,
      cult = 0,
      incHum = 0,
      incTot = 0;
    for (let i = 0; i < H; i++) {
      hum += v[i];
      cult += 1 - culture[i];
      incHum += lastReward[i];
    }
    for (let i = 0; i < N; i++) incTot += lastReward[i];
    S.laborShare[t] = clip((wage * L) / Math.max(Y, 1e-6), 0, 1);
    S.incomeShare[t] = clip(incHum / Math.max(incTot, 1e-6), 0, 1);
    S.cultureShare[t] = cult / H;
    S.influenceShare[t] = hum;
    S.composite[t] = (S.incomeShare[t] + S.cultureShare[t] + S.influenceShare[t]) / 3;
    S.enforcement[t] = enforcement;
    S.aiCapShare[t] = capShareNow;
  }
  return S;
}

function runCombined(params, seed) {
  const P = { ...COMBINED_DEFAULTS, ...params };
  const run = runCoupledOnce(P, seed, P.kappa);
  const ref = runCoupledOnce(P, seed, 0); // the same-seed sealed twin (backend instrument)
  const T = P.T;
  const gap = new Float64Array(T);
  for (let t = 0; t < T; t++) gap[t] = ref.composite[t] - run.composite[t];
  const lateStart = Math.floor((3 * T) / 4);
  const lateMean = (xs) => {
    let s = 0;
    for (let t = lateStart; t < T; t++) s += xs[t];
    return s / (T - lateStart);
  };
  const corr = (a, b) => {
    let ma = 0,
      mb = 0;
    for (let t = 0; t < T; t++) {
      ma += a[t];
      mb += b[t];
    }
    ma /= T;
    mb /= T;
    let num = 0,
      da = 0,
      db = 0;
    for (let t = 0; t < T; t++) {
      num += (a[t] - ma) * (b[t] - mb);
      da += (a[t] - ma) ** 2;
      db += (b[t] - mb) ** 2;
    }
    const den = Math.sqrt(da * db);
    return den > 1e-9 ? num / den : 0;
  };
  return {
    meta: {
      gameId: 'coupled_society',
      T,
      N: P.nHumans + P.nAi,
      seed,
      params: P,
      scalars: {
        labor_share: lateMean(run.laborShare),
        human_income_share: lateMean(run.incomeShare),
        culture_share: lateMean(run.cultureShare),
        influence_share: lateMean(run.influenceShare),
        composite: lateMean(run.composite),
        transfer_gap: lateMean(ref.composite) - lateMean(run.composite),
        correlated_decline:
          (corr(run.incomeShare, run.cultureShare) +
            corr(run.cultureShare, run.influenceShare) +
            corr(run.incomeShare, run.influenceShare)) /
          3,
      },
    },
    global: {
      labor_share: run.laborShare,
      income_share: run.incomeShare,
      culture_share: run.cultureShare,
      influence_share: run.influenceShare,
      composite: run.composite,
      ref_composite: ref.composite,
      transfer_gap: gap,
      enforcement: run.enforcement,
      ai_cap_share: run.aiCapShare,
    },
    node: {},
    static: {},
    system: filterSystem(COMBINED_SYSTEM, P, COMBINED_SYS_TOGGLES),
  };
}

function runSelfTests() {
  const tests = [];
  const T = (name, fn) => tests.push({ name, fn });

  T('logistic endpoints: 0→0, K→K, K/2 grows', () => {
    const K = 500;
    return (
      logisticGrowth(0, 0.35, K) === 0 &&
      logisticGrowth(K, 0.35, K) === 0 &&
      logisticGrowth(K / 2, 0.35, K) > 0
    );
  });
  T('fires(): cadence, onset gate, one-shot', () => {
    const c5 =
      [0, 5, 10].every((s) => fires(s, { cadence: 5 })) &&
      ![1, 4, 7].some((s) => fires(s, { cadence: 5 }));
    const on = !fires(49, { onset: 50 }) && fires(50, { onset: 50 });
    const t0 = 333,
      spec = { cadence: 501, phaseOffset: t0, onset: t0 };
    let count = 0;
    for (let s = 0; s < 500; s++) if (fires(s, spec)) count++;
    return c5 && on && count === 1 && fires(t0, spec);
  });
  T(
    'median is linear-interpolated (jnp.quantile)',
    () => Math.abs(quantile([1, 2, 3, 4], 0.5) - 2.5) < 1e-12
  );
  T(
    'gini: equal→0, [0,0,0,1]→0.75',
    () => gini([2, 2, 2]) < 1e-12 && Math.abs(gini([0, 0, 0, 1]) - 0.75) < 1e-12
  );
  T('alignment=1 (noise off) harvests the ask exactly', () => {
    const r = runCommonsOnce(
      {
        ...COMMONS_DEFAULTS,
        alignmentMean: 1,
        alignmentStd: 0,
        actionNoise: 0,
        defectProb: 0,
        T: 1,
      },
      3
    );
    for (let i = 0; i < 20; i++) if (Math.abs(r.S.harvest[i] - r.pref[i]) > 1e-9) return false;
    return true;
  });
  T('alignment=0 (noise off) harvests the greedy target', () => {
    const r = runCommonsOnce(
      {
        ...COMMONS_DEFAULTS,
        alignmentMean: 0,
        alignmentStd: 0,
        actionNoise: 0,
        defectProb: 0,
        T: 1,
      },
      3
    );
    for (let i = 0; i < 20; i++) if (Math.abs(r.S.harvest[i] - 8.0) > 1e-9) return false;
    return true;
  });

  const seeds = [1, 2, 3, 4, 5];
  const mean = (xs) => xs.reduce((p, v) => p + v, 0) / xs.length;
  const runs = (over) =>
    seeds.map((s) => runCommons({ ...COMMONS_DEFAULTS, ...over }, s).meta.scalars);
  const base = runs({}),
    voting = runs({ quotaVote: true }),
    sanct = runs({ quotaVote: true, sanction: true });

  T('undefended baseline collapses (stock < 5%)', () => mean(base.map((r) => r.stock_pct)) < 0.05);
  T(
    'voting alone is no worse than baseline (knife-edge)',
    () => mean(voting.map((r) => r.stock_pct)) >= mean(base.map((r) => r.stock_pct)) - 0.05
  );
  T(
    'voting + sanctions preserves the stock (> 40%)',
    () => mean(sanct.map((r) => r.stock_pct)) > 0.4
  );
  T('influence: |baseline| small, sanctions large, ordered', () => {
    const bI = mean(base.map((r) => r.exercised_influence)),
      sI = mean(sanct.map((r) => r.exercised_influence));
    return Math.abs(bI) < 0.2 && sI > 0.5 && sI > bI;
  });
  T('intro village: slow tragedy (collapse in 150–350), defenses rescue it', () => {
    const v = runCommons({ ...COMMONS_DEFAULTS, ...COMMONS_VILLAGE }, COMMONS_VILLAGE_SEED);
    const R = v.global.resource_level;
    let collapseT = -1;
    for (let t = 0; t < R.length; t++)
      if (R[t] < 25) {
        collapseT = t;
        break;
      }
    const d = runCommons(
      { ...COMMONS_DEFAULTS, ...COMMONS_VILLAGE, quotaVote: true, sanction: true },
      COMMONS_VILLAGE_SEED
    ).meta.scalars;
    return collapseT >= 150 && collapseT <= 350 && d.stock_pct > 0.6 && d.exercised_influence > 0.6;
  });

  // --- economy ladder (compute_economy/tests/test_validation_ladder.py) ---
  T('economy: Cobb-Douglas (ρ=0) labor share ≡ α every tick', () => {
    const r = runEconomyOnce({ ...ECONOMY_DEFAULTS, rho: 0, T: 120 }, 5);
    for (let t = 0; t < 120; t++) if (Math.abs(r.S.laborShare[t] - 0.6) > 1e-6) return false;
    return true;
  });
  T('economy: no AI arrivals ⇒ labor share ≈ 1, steady output', () => {
    const r = runEconomyOnce({ ...ECONOMY_DEFAULTS, firstArrivalTick: 9999, T: 150 }, 5);
    for (let t = 0; t < 150; t++) if (r.S.laborShare[t] < 0.99) return false;
    return Math.abs(r.S.output[140] - r.S.output[20]) / r.S.output[20] < 0.3;
  });
  T('economy: undefended labor share decays from ≈1', () => {
    const mean2 = (xs) => xs.reduce((p, v) => p + v, 0) / xs.length;
    const finals = [1, 2, 3].map((s) => runEconomy(ECONOMY_DEFAULTS, s).meta.scalars.labor_share);
    const r = runEconomyOnce(ECONOMY_DEFAULTS, 1);
    return r.S.laborShare[5] > 0.9 && mean2(finals) < 0.7;
  });
  T('economy: defenses lift labor share and influence-NOW', () => {
    const mean2 = (xs) => xs.reduce((p, v) => p + v, 0) / xs.length;
    const seeds2 = [1, 2, 3];
    const und = seeds2.map((s) => runEconomy(ECONOMY_DEFAULTS, s).meta.scalars);
    const def = seeds2.map(
      (s) => runEconomy({ ...ECONOMY_DEFAULTS, aiTax: true, ownershipCap: true }, s).meta.scalars
    );
    return (
      mean2(def.map((r) => r.labor_share)) > mean2(und.map((r) => r.labor_share)) + 0.03 &&
      mean2(def.map((r) => r.influence_now)) > mean2(und.map((r) => r.influence_now))
    );
  });
  T('economy: reinvestment concentrates income (gini rises with AI)', () => {
    const withAI = runEconomy(ECONOMY_DEFAULTS, 2).meta.scalars.income_gini;
    const noAI = runEconomy({ ...ECONOMY_DEFAULTS, firstArrivalTick: 9999 }, 2).meta.scalars
      .income_gini;
    return withAI > noAI + 0.1;
  });

  // --- cultural ladder (value_contagion/tests) ---
  T('cultural: separation dial preserves mean degree (axis S ⊥ threshold)', () => {
    for (const h of [0, 0.9]) {
      let total = 0;
      for (const s of [1, 2, 3]) {
        const W = typedHomophily(40, 8, 6, h, makeRng(s));
        let e = 0;
        for (let k = 0; k < 1600; k++) e += W[k];
        total += e / 40;
      }
      if (Math.abs(total / 3 - 6) > 1.2) return false;
    }
    return true;
  });
  T('cultural: Centola gate — a lone carrier cannot spread at k=2', () => {
    const r = runCultural(
      { nAgents: 20, nAi: 1, kThreshold: 2, pAdvantage: 10, beta: 0.5, recovery: 0, T: 100 },
      3
    );
    return r.global.human_share[99] === 1;
  });
  T('cultural: fiedler alignment = 1 on a two-block graph', () => {
    const n = 8,
      W = new Float64Array(n * n);
    const link = (i, j) => {
      W[i * n + j] = 1;
      W[j * n + i] = 1;
    };
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) link(i, j);
    for (let i = 4; i < 8; i++) for (let j = i + 1; j < 8; j++) link(i, j);
    link(3, 4);
    const isAi = Float64Array.from([0, 0, 0, 0, 1, 1, 1, 1]);
    return phiAlignment(fiedlerVector(W, n, makeRng(9)), isAi, n) > 0.95;
  });
  // --- A4/A5 faithful rungs (ports of the backend ladders, 2026-07-27) ---
  T('political: frozen W — influence lands on the left eigenvector (Golub–Jackson)', () => {
    const r = runPolitical({ ...POLITICAL_DEFAULTS, updateRate: 0, ampOnset: 9999, T: 300 }, 5);
    const N = r.meta.N,
      W = r.adj.listening;
    let v = new Float64Array(N).fill(1 / N);
    const nxt = new Float64Array(N);
    for (let it = 0; it < 2000; it++) {
      // reference eigenvector
      nxt.fill(0);
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) nxt[j] += W[i * N + j] * v[i];
      let s = 0;
      for (let j = 0; j < N; j++) s += nxt[j];
      for (let j = 0; j < N; j++) v[j] = nxt[j] / s;
    }
    let l1 = 0;
    for (let j = 0; j < N; j++) l1 += Math.abs(v[j] - r.node.influence[(r.meta.T - 1) * N + j]);
    return l1 < 1e-3;
  });
  T('political: amplification captures; sortition + cap restore (ordering)', () => {
    const mean2 = (xs) => xs.reduce((p, v2) => p + v2, 0) / xs.length;
    const seeds2 = [1, 2, 3];
    const share = (over) =>
      mean2(
        seeds2.map(
          (s) =>
            runPolitical({ ...POLITICAL_DEFAULTS, ...over }, s).meta.scalars.human_influence_share
        )
      );
    const organic = share({ ampOnset: 9999 });
    const amplified = share({});
    const defended = share({ sortition: true, influenceCap: true });
    return organic > 0.75 && amplified < organic - 0.15 && defended > amplified + 0.12;
  });
  T('political: wisdom breaks — consensus drifts toward the amplified reservoir', () => {
    const errD = runPolitical({ ...POLITICAL_DEFAULTS, updateRate: 0, ampOnset: 9999 }, 2).meta
      .scalars.consensus_error;
    const errA = runPolitical(POLITICAL_DEFAULTS, 2).meta.scalars.consensus_error;
    return errA > errD + 0.3;
  });
  T('combined: κ=0 transfer gap is exactly 0 (the instrument’s null)', () => {
    const d = { aiTax: true, sortition: true, influenceCap: true };
    const sealed = runCombined({ ...COMBINED_DEFAULTS, ...d, kappa: 0 }, 2);
    let maxAbs = 0;
    for (let t = 0; t < sealed.meta.T; t++)
      maxAbs = Math.max(maxAbs, Math.abs(sealed.global.transfer_gap[t]));
    const coupled = runCombined({ ...COMBINED_DEFAULTS, ...d }, 2);
    return maxAbs < 1e-12 && coupled.meta.scalars.transfer_gap > 0.02;
  });
  T('combined: defended beats undefended even coupled (erosion, not inversion)', () => {
    const d = runCombined(
      { ...COMBINED_DEFAULTS, aiTax: true, sortition: true, influenceCap: true },
      3
    ).meta.scalars.composite;
    const u = runCombined(COMBINED_DEFAULTS, 3).meta.scalars.composite;
    return d > u + 0.05;
  });
  T('combined: the schedule is a real dial — a slower economy clock compounds less', () => {
    const fast = runCombined(COMBINED_DEFAULTS, 4).meta.scalars.labor_share;
    const slow = runCombined({ ...COMBINED_DEFAULTS, econCadence: 3 }, 4).meta.scalars.labor_share;
    return slow > fast + 0.05;
  });
  T('combined: the flywheel reaches the economy — coupled income share < sealed', () => {
    const sealed = runCombined({ ...COMBINED_DEFAULTS, kappa: 0 }, 5).meta.scalars
      .human_income_share;
    const coupled = runCombined(COMBINED_DEFAULTS, 5).meta.scalars.human_income_share;
    return coupled < sealed - 0.02;
  });

  T('cultural: the four corners separate (share × fault line)', () => {
    const mean2 = (xs) => xs.reduce((p, v) => p + v, 0) / xs.length;
    const corner = (h, adv) => {
      const rs = [1, 2, 3].map(
        (s) =>
          runCultural({ ...CULTURAL_DEFAULTS, T: 200, aiHomophily: h, pAdvantage: adv }, s).meta
            .scalars
      );
      return {
        share: mean2(rs.map((r) => r.human_origin_share)),
        align: mean2(rs.map((r) => r.fault_line)),
      };
    };
    const plur = corner(0.05, 1),
      assim = corner(0.05, 6),
      par = corner(0.9, 1),
      disp = corner(0.9, 6);
    return (
      plur.share > 0.6 &&
      plur.align < 0.4 &&
      assim.share < 0.45 &&
      assim.align < 0.4 &&
      par.share > 0.8 &&
      par.align > 0.6 &&
      disp.share < 0.45 &&
      disp.align > 0.6
    );
  });

  // --- derived system graphs (contract v1.1 consumer) --------------------
  T('system: fixtures are closed graphs (every edge endpoint is a node)', () =>
    [COMMONS_SYSTEM, ECONOMY_SYSTEM, CULTURAL_SYSTEM].every((sys) => {
      const ids = new Set(sys.nodes.map((n) => n.id));
      return sys.edges.every((e) => ids.has(e.from) && ids.has(e.to));
    })
  );
  T('system: filter drops exactly the off mechanisms, stamps color when on', () => {
    const off = filterSystem(
      COMMONS_SYSTEM,
      { quotaVote: false, sanction: false },
      COMMONS_SYS_TOGGLES
    );
    const on = filterSystem(
      COMMONS_SYSTEM,
      { quotaVote: true, sanction: true },
      COMMONS_SYS_TOGGLES
    );
    const offT = off.nodes.filter((n) => n.kind === 'transform').map((n) => n.id);
    const gone = (id) => id.includes('quota_vote') || id.includes('graduated_sanction');
    const okOff =
      offT.length === 3 &&
      !offT.some(gone) &&
      off.nodes.length === COMMONS_SYSTEM.nodes.length - 2 &&
      off.edges.length === COMMONS_SYSTEM.edges.length - 10 && // 3 vote + 7 sanction edges
      off.edges.every((e) => !gone(e.from) && !gone(e.to));
    const okOn =
      on.nodes.length === COMMONS_SYSTEM.nodes.length &&
      on.nodes.filter((n) => n.color).length === 2 &&
      COMMONS_SYSTEM.nodes.every((n) => !n.color); // pure: fixture untouched
    return okOff && okOn;
  });
  T('system: roles classify static input + orphan; engines attach the DAG', () => {
    const roles = systemRoles(CULTURAL_SYSTEM);
    const fr = roles.friendship,
      lr = roles.last_reward;
    const traj = runCultural({ ...CULTURAL_DEFAULTS, T: 30 }, 2);
    return (
      fr.readBy === 1 &&
      fr.writtenBy === 0 &&
      lr.readBy === 0 &&
      lr.writtenBy === 0 &&
      traj.system?.nodes.length === CULTURAL_SYSTEM.nodes.length
    );
  });

  return tests.map(({ name, fn }) => {
    let pass = false,
      err = '';
    try {
      pass = !!fn();
    } catch (e) {
      err = String(e);
    }
    return { name, pass, err };
  });
}

export {
  COMBINED_DEFAULTS,
  COMMONS_DEFAULTS,
  CULTURAL_DEFAULTS,
  ECONOMY_DEFAULTS,
  POLITICAL_DEFAULTS,
  runCombined,
  runCommons,
  runCultural,
  runEconomy,
  runPolitical,
  runSelfTests,
};
