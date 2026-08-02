/* eslint-disable @typescript-eslint/no-unused-vars */

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

/** Power-weighted median (mechanisms/democracy.py::_weighted_median): the
    smallest value whose cumulative weight reaches half the total. Matches
    jnp.searchsorted's left side, so ties resolve as the engine's does. */
function weightedMedian(values, weights) {
  const order = Array.from(values, (_, i) => i).sort((a, b) => values[a] - values[b]);
  let total = 0;
  for (const i of order) total += weights[i];
  let acc = 0;
  for (const i of order) {
    acc += weights[i];
    if (acc >= 0.5 * total) return values[i];
  }
  return values[order[order.length - 1]];
}

/** Schedule predicate — port of core/schedule.py. Fires when
    step >= onset and (step - phaseOffset) % cadence === 0. */
function fires(step, { cadence = 1, phaseOffset = 0, onset = 0 } = {}) {
  if (step < onset) return false;
  const m = (step - phaseOffset) % cadence;
  return (m + cadence) % cadence === 0;
}

/* Derived system DAGs — generated 2026-07-27 by system_graph() via
   examples/05_export_trajectory.py at each env's fully-defended condition.
   PASTED, NEVER HAND-EDITED: regenerate with scratchpad/gen-system-fixtures.py. */
const ECONOMY_SYSTEM = {
  nodes: [
    { id: 'gross_output', kind: 'field', family: 'node_attrs', shape: [32] },
    { id: 'spend_pref', kind: 'field', family: 'node_attrs', shape: [32, 6] },
    { id: 'spend_weights', kind: 'field', family: 'node_attrs', shape: [32, 6] },
    { id: 'demand_h', kind: 'field', family: 'node_attrs', shape: [32] },
    { id: 'demand_k', kind: 'field', family: 'node_attrs', shape: [32] },
    { id: 'last_reward', kind: 'field', family: 'node_attrs', shape: [32] },
    { id: 'capital_income', kind: 'field', family: 'node_attrs', shape: [32] },
    { id: 'capital', kind: 'field', family: 'node_attrs', shape: [32] },
    { id: 'pub_cap', kind: 'field', family: 'node_attrs', shape: [32] },
    { id: 'pub_profit', kind: 'field', family: 'node_attrs', shape: [32] },
    { id: 'wealth', kind: 'field', family: 'node_attrs', shape: [32] },
    { id: 'active', kind: 'field', family: 'node_attrs', shape: [32] },
    { id: 'arrival_tick', kind: 'field', family: 'node_attrs', shape: [32] },
    { id: 'home_sector', kind: 'field', family: 'node_attrs', shape: [32] },
    { id: 'technical', kind: 'field', family: 'adj_matrices', shape: [32, 32] },
    { id: 'rng_key', kind: 'field', family: 'global_attrs', shape: [2], bookkeeping: true },
    { id: 'step', kind: 'field', family: 'global_attrs', shape: [], bookkeeping: true },
    { id: 'upkeep_paid', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'efficiency', kind: 'field', family: 'global_attrs', shape: [] },
    {
      id: 'spend',
      kind: 'transform',
      reads: ['last_reward', 'spend_weights', 'wealth'],
      writes: ['demand_h'],
    },
    {
      id: 'arrive',
      kind: 'transform',
      reads: ['active', 'arrival_tick', 'capital', 'home_sector', 'pub_cap', 'step'],
      writes: ['active', 'capital', 'pub_cap'],
    },
    {
      id: 'rebalance',
      kind: 'transform',
      reads: ['demand_h', 'demand_k', 'gross_output', 'technical'],
      writes: ['gross_output'],
    },
    {
      id: 'distribute',
      kind: 'transform',
      reads: [
        'active',
        'capital',
        'efficiency',
        'gross_output',
        'home_sector',
        'pub_cap',
        'technical',
        'wealth',
      ],
      writes: ['capital', 'capital_income', 'last_reward', 'pub_cap', 'upkeep_paid'],
    },
    {
      id: 'ai_revenue_tax',
      kind: 'transform',
      reads: ['active', 'capital_income', 'last_reward'],
      writes: ['capital_income', 'last_reward'],
    },
    {
      id: 'accumulate',
      kind: 'transform',
      reads: [
        'active',
        'capital',
        'capital_income',
        'home_sector',
        'last_reward',
        'pub_cap',
        'pub_profit',
        'upkeep_paid',
        'wealth',
      ],
      writes: ['capital', 'demand_k', 'pub_cap', 'wealth'],
    },
    {
      id: 'grow',
      kind: 'transform',
      reads: ['efficiency', 'step'],
      writes: ['efficiency'],
    },
    {
      id: 'step_counter',
      kind: 'transform',
      reads: ['step'],
      writes: ['step'],
    },
  ],
  edges: [
    { from: 'last_reward', to: 'spend' },
    { from: 'spend_weights', to: 'spend' },
    { from: 'wealth', to: 'spend' },
    { from: 'spend', to: 'demand_h' },
    { from: 'active', to: 'arrive' },
    { from: 'arrival_tick', to: 'arrive' },
    { from: 'capital', to: 'arrive' },
    { from: 'home_sector', to: 'arrive' },
    { from: 'pub_cap', to: 'arrive' },
    { from: 'step', to: 'arrive' },
    { from: 'arrive', to: 'active' },
    { from: 'arrive', to: 'capital' },
    { from: 'arrive', to: 'pub_cap' },
    { from: 'demand_h', to: 'rebalance' },
    { from: 'demand_k', to: 'rebalance' },
    { from: 'gross_output', to: 'rebalance' },
    { from: 'technical', to: 'rebalance' },
    { from: 'rebalance', to: 'gross_output' },
    { from: 'active', to: 'distribute' },
    { from: 'capital', to: 'distribute' },
    { from: 'efficiency', to: 'distribute' },
    { from: 'gross_output', to: 'distribute' },
    { from: 'home_sector', to: 'distribute' },
    { from: 'pub_cap', to: 'distribute' },
    { from: 'technical', to: 'distribute' },
    { from: 'wealth', to: 'distribute' },
    { from: 'distribute', to: 'capital' },
    { from: 'distribute', to: 'capital_income' },
    { from: 'distribute', to: 'last_reward' },
    { from: 'distribute', to: 'pub_cap' },
    { from: 'distribute', to: 'upkeep_paid' },
    { from: 'active', to: 'ai_revenue_tax' },
    { from: 'capital_income', to: 'ai_revenue_tax' },
    { from: 'last_reward', to: 'ai_revenue_tax' },
    { from: 'ai_revenue_tax', to: 'capital_income' },
    { from: 'ai_revenue_tax', to: 'last_reward' },
    { from: 'active', to: 'accumulate' },
    { from: 'capital', to: 'accumulate' },
    { from: 'capital_income', to: 'accumulate' },
    { from: 'home_sector', to: 'accumulate' },
    { from: 'last_reward', to: 'accumulate' },
    { from: 'pub_cap', to: 'accumulate' },
    { from: 'pub_profit', to: 'accumulate' },
    { from: 'upkeep_paid', to: 'accumulate' },
    { from: 'wealth', to: 'accumulate' },
    { from: 'accumulate', to: 'capital' },
    { from: 'accumulate', to: 'demand_k' },
    { from: 'accumulate', to: 'pub_cap' },
    { from: 'accumulate', to: 'wealth' },
    { from: 'efficiency', to: 'grow' },
    { from: 'step', to: 'grow' },
    { from: 'grow', to: 'efficiency' },
    { from: 'step', to: 'step_counter' },
    { from: 'step_counter', to: 'step' },
  ],
};
/* Toggle tables: transform-id substring -> the mechanism param that attaches
   it (backend guarantees the id CONTAINS the mechanism name — schedules wrap
   it), + the game's mechanism accent as a hex literal (@core code cannot see
   the Sketch section's color constants). */
const ECONOMY_SYS_TOGGLES = [{ match: 'ai_revenue_tax', param: 'aiTax', color: '#f08c00' }];
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
const POLITY_SYSTEM = {
  nodes: [
    { id: 'ideal', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'endowment', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'wealth', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'position', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'influence', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'engagement', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'amplification', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'cap_scale', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'attract_boost', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'last_reward', kind: 'field', family: 'node_attrs', shape: [34] },
    { id: 'delegation', kind: 'field', family: 'adj_matrices', shape: [34, 34] },
    { id: 'rng_key', kind: 'field', family: 'global_attrs', shape: [2], bookkeeping: true },
    { id: 'step', kind: 'field', family: 'global_attrs', shape: [], bookkeeping: true },
    { id: 'policy_target', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'enforcement', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'redelegation_friction', kind: 'field', family: 'global_attrs', shape: [] },
    {
      id: 'amplify',
      kind: 'transform',
      reads: ['step'],
      writes: ['amplification'],
    },
    {
      id: 'tally_power',
      kind: 'transform',
      reads: ['delegation'],
      writes: ['influence'],
    },
    {
      id: 'declare_position',
      kind: 'transform',
      reads: ['delegation', 'ideal'],
      writes: ['position'],
    },
    {
      id: 'power_weighted_vote',
      kind: 'transform',
      reads: ['influence', 'position'],
      writes: ['policy_target'],
    },
    {
      id: 'tax_and_redistribute',
      kind: 'transform',
      reads: ['endowment', 'enforcement', 'policy_target', 'wealth'],
      writes: ['last_reward', 'wealth'],
    },
    {
      id: 'update_regime',
      kind: 'transform',
      reads: ['influence'],
      writes: ['enforcement', 'redelegation_friction'],
    },
    {
      id: 'rewire_delegation',
      kind: 'transform',
      reads: [
        'amplification',
        'attract_boost',
        'cap_scale',
        'delegation',
        'engagement',
        'influence',
        'redelegation_friction',
      ],
      writes: ['delegation'],
    },
    {
      id: 'step_counter',
      kind: 'transform',
      reads: ['step'],
      writes: ['step'],
    },
  ],
  edges: [
    { from: 'step', to: 'amplify' },
    { from: 'amplify', to: 'amplification' },
    { from: 'delegation', to: 'tally_power' },
    { from: 'tally_power', to: 'influence' },
    { from: 'delegation', to: 'declare_position' },
    { from: 'ideal', to: 'declare_position' },
    { from: 'declare_position', to: 'position' },
    { from: 'influence', to: 'power_weighted_vote' },
    { from: 'position', to: 'power_weighted_vote' },
    { from: 'power_weighted_vote', to: 'policy_target' },
    { from: 'endowment', to: 'tax_and_redistribute' },
    { from: 'enforcement', to: 'tax_and_redistribute' },
    { from: 'policy_target', to: 'tax_and_redistribute' },
    { from: 'wealth', to: 'tax_and_redistribute' },
    { from: 'tax_and_redistribute', to: 'last_reward' },
    { from: 'tax_and_redistribute', to: 'wealth' },
    { from: 'influence', to: 'update_regime' },
    { from: 'update_regime', to: 'enforcement' },
    { from: 'update_regime', to: 'redelegation_friction' },
    { from: 'amplification', to: 'rewire_delegation' },
    { from: 'attract_boost', to: 'rewire_delegation' },
    { from: 'cap_scale', to: 'rewire_delegation' },
    { from: 'delegation', to: 'rewire_delegation' },
    { from: 'engagement', to: 'rewire_delegation' },
    { from: 'influence', to: 'rewire_delegation' },
    { from: 'redelegation_friction', to: 'rewire_delegation' },
    { from: 'rewire_delegation', to: 'delegation' },
    { from: 'step', to: 'step_counter' },
    { from: 'step_counter', to: 'step' },
  ],
};
const POLITY_SYS_TOGGLES = [];
const LEDGER_SYSTEM = {
  nodes: [
    { id: 'wealth', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'last_income', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'consume_spend', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'invest_spend', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'broadcast_spend', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'lobby_spend', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'net_transfer', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'intervention_spend', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'last_reward', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'capital', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'arrival_tick', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'belief', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'signal', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'listen_influence', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'attract_boost', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'ideal', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'position', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'influence', kind: 'field', family: 'node_attrs', shape: [26] },
    { id: 'alloc_pref', kind: 'field', family: 'node_attrs', shape: [26, 5] },
    { id: 'allocation', kind: 'field', family: 'node_attrs', shape: [26, 5] },
    { id: 'listening', kind: 'field', family: 'adj_matrices', shape: [26, 26] },
    { id: 'delegation', kind: 'field', family: 'adj_matrices', shape: [26, 26] },
    { id: 'rng_key', kind: 'field', family: 'global_attrs', shape: [2], bookkeeping: true },
    { id: 'step', kind: 'field', family: 'global_attrs', shape: [], bookkeeping: true },
    { id: 'efficiency', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'policy_target', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'enforcement', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'redelegation_friction', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'reach_cut_now', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'gamma_w_now', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'update_rate_w_now', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'churn_now', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'repair_rate_now', kind: 'field', family: 'global_attrs', shape: [] },
    { id: 'entrenchment_gain_now', kind: 'field', family: 'global_attrs', shape: [] },
    {
      id: 'arrive',
      kind: 'transform',
      reads: ['arrival_tick', 'capital', 'step'],
      writes: ['capital'],
    },
    { id: 'produce', kind: 'transform', reads: ['capital', 'efficiency'], writes: ['last_income'] },
    {
      id: 'tax_and_redistribute',
      kind: 'transform',
      reads: ['enforcement', 'last_income', 'policy_target'],
      writes: ['last_income', 'last_reward', 'net_transfer'],
    },
    {
      id: 'allocate',
      kind: 'transform',
      reads: ['allocation', 'last_income', 'wealth'],
      writes: ['broadcast_spend', 'consume_spend', 'invest_spend', 'lobby_spend', 'wealth'],
    },
    {
      id: 'build_capital',
      kind: 'transform',
      reads: ['capital', 'invest_spend'],
      writes: ['capital'],
    },
    { id: 'grow', kind: 'transform', reads: ['capital', 'efficiency'], writes: ['efficiency'] },
    {
      id: 'broadcast_reach',
      kind: 'transform',
      reads: ['broadcast_spend', 'reach_cut_now', 'step'],
      writes: ['attract_boost'],
    },
    {
      id: 'rewire_listening',
      kind: 'transform',
      reads: ['attract_boost', 'gamma_w_now', 'listen_influence', 'listening', 'update_rate_w_now'],
      writes: ['listening'],
    },
    {
      id: 'listen_influence_update',
      kind: 'transform',
      reads: ['listen_influence', 'listening'],
      writes: ['listen_influence'],
    },
    {
      id: 'pool_belief',
      kind: 'transform',
      reads: ['belief', 'listening', 'signal'],
      writes: ['belief'],
    },
    {
      id: 'rewire_delegation',
      kind: 'transform',
      reads: ['churn_now', 'delegation', 'influence', 'listen_influence', 'redelegation_friction'],
      writes: ['delegation'],
    },
    { id: 'tally_power', kind: 'transform', reads: ['delegation'], writes: ['influence'] },
    {
      id: 'declare_position',
      kind: 'transform',
      reads: ['delegation', 'ideal'],
      writes: ['position'],
    },
    {
      id: 'power_weighted_vote',
      kind: 'transform',
      reads: ['influence', 'position'],
      writes: ['policy_target'],
    },
    {
      id: 'update_regime',
      kind: 'transform',
      reads: [
        'enforcement',
        'entrenchment_gain_now',
        'influence',
        'lobby_spend',
        'net_transfer',
        'repair_rate_now',
      ],
      writes: ['enforcement', 'redelegation_friction'],
    },
    { id: 'step_counter', kind: 'transform', reads: ['step'], writes: ['step'] },
  ],
  edges: [
    { from: 'arrival_tick', to: 'arrive' },
    { from: 'capital', to: 'arrive' },
    { from: 'step', to: 'arrive' },
    { from: 'arrive', to: 'capital' },
    { from: 'capital', to: 'produce' },
    { from: 'efficiency', to: 'produce' },
    { from: 'produce', to: 'last_income' },
    { from: 'enforcement', to: 'tax_and_redistribute' },
    { from: 'last_income', to: 'tax_and_redistribute' },
    { from: 'policy_target', to: 'tax_and_redistribute' },
    { from: 'tax_and_redistribute', to: 'last_income' },
    { from: 'tax_and_redistribute', to: 'last_reward' },
    { from: 'tax_and_redistribute', to: 'net_transfer' },
    { from: 'allocation', to: 'allocate' },
    { from: 'last_income', to: 'allocate' },
    { from: 'wealth', to: 'allocate' },
    { from: 'allocate', to: 'broadcast_spend' },
    { from: 'allocate', to: 'consume_spend' },
    { from: 'allocate', to: 'invest_spend' },
    { from: 'allocate', to: 'lobby_spend' },
    { from: 'allocate', to: 'wealth' },
    { from: 'capital', to: 'build_capital' },
    { from: 'invest_spend', to: 'build_capital' },
    { from: 'build_capital', to: 'capital' },
    { from: 'capital', to: 'grow' },
    { from: 'efficiency', to: 'grow' },
    { from: 'grow', to: 'efficiency' },
    { from: 'broadcast_spend', to: 'broadcast_reach' },
    { from: 'reach_cut_now', to: 'broadcast_reach' },
    { from: 'step', to: 'broadcast_reach' },
    { from: 'broadcast_reach', to: 'attract_boost' },
    { from: 'attract_boost', to: 'rewire_listening' },
    { from: 'gamma_w_now', to: 'rewire_listening' },
    { from: 'listen_influence', to: 'rewire_listening' },
    { from: 'listening', to: 'rewire_listening' },
    { from: 'update_rate_w_now', to: 'rewire_listening' },
    { from: 'rewire_listening', to: 'listening' },
    { from: 'listen_influence', to: 'listen_influence_update' },
    { from: 'listening', to: 'listen_influence_update' },
    { from: 'listen_influence_update', to: 'listen_influence' },
    { from: 'belief', to: 'pool_belief' },
    { from: 'listening', to: 'pool_belief' },
    { from: 'signal', to: 'pool_belief' },
    { from: 'pool_belief', to: 'belief' },
    { from: 'churn_now', to: 'rewire_delegation' },
    { from: 'delegation', to: 'rewire_delegation' },
    { from: 'influence', to: 'rewire_delegation' },
    { from: 'listen_influence', to: 'rewire_delegation' },
    { from: 'redelegation_friction', to: 'rewire_delegation' },
    { from: 'rewire_delegation', to: 'delegation' },
    { from: 'delegation', to: 'tally_power' },
    { from: 'tally_power', to: 'influence' },
    { from: 'delegation', to: 'declare_position' },
    { from: 'ideal', to: 'declare_position' },
    { from: 'declare_position', to: 'position' },
    { from: 'influence', to: 'power_weighted_vote' },
    { from: 'position', to: 'power_weighted_vote' },
    { from: 'power_weighted_vote', to: 'policy_target' },
    { from: 'enforcement', to: 'update_regime' },
    { from: 'entrenchment_gain_now', to: 'update_regime' },
    { from: 'influence', to: 'update_regime' },
    { from: 'lobby_spend', to: 'update_regime' },
    { from: 'net_transfer', to: 'update_regime' },
    { from: 'repair_rate_now', to: 'update_regime' },
    { from: 'update_regime', to: 'enforcement' },
    { from: 'update_regime', to: 'redelegation_friction' },
    { from: 'step', to: 'step_counter' },
    { from: 'step_counter', to: 'step' },
  ],
};
const POLITICAL_SYS_TOGGLES = [
  { match: 'sortition', param: 'sortition', color: '#1c7ed6' },
  { match: 'influence_cap', param: 'influenceCap', color: '#1c7ed6' },
];
/* Empty by construction, not by omission. Every defense in the ledger model is
   a dial inside a substrate transform — the cap on bought reach gates the
   money→attention channel in-transform, churn and repair are terms in the
   kernel and the regime update — so no transform enters or leaves the pipeline
   when you move them. The κ model's toggles attached real mechanisms and the
   System view showed them appearing; that is a genuine difference between the
   two models, not a regression in the view. */
const LEDGER_SYS_TOGGLES = [];

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

const ECONOMY_DEFAULTS = {
  nHouseholds: 20,
  nSectors: 6, // sector slot 0 is the machine sector
  nOwners: 6, // owner i's home sector is i % nSectors
  T: 300,
  // recipes: machines feed every other sector (hub) + chain j-1 -> j
  aMachines: 0.15,
  aChain: 0.12,
  // households
  initIncome: 1.0,
  prefNoise: 0.15,
  sigmaS: 0.08, // saving out of income
  sigmaD: 0.03, // wealth drawdown; the ratio pins W_H/y_H exactly
  // capital physics — the knee lives in these three plus e
  efficiency: 0.55, // e, capability AT DEPLOYMENT; evolves by the growth law
  maintenance: 1.5, // m, upkeep per unit K, paid out of revenue only
  reinvestRate: 0.5, // s
  depreciation: 0.05, // delta
  // capability growth: (0,0) static, (g,0) first-order, (g,y>0) second-order
  growthRate: 0.0, // g
  rsiStrength: 0.0, // y (gamma), the recursive self-improvement term
  eCeiling: 64.0,
  // arrivals
  firstArrival: 40,
  arrivalSpacing: 25,
  initCapital: 0.5,
  // closures and ownership
  recycle: 1.0, // r, scales AI discretionary outlays; the rest stalls in the hoard
  consumeRate: 0.02, // c_A, AI consumption out of the hoard
  ownership: 0.0, // omega, the slice of investment whose TITLE goes public
  pubMirror: false, // false = dividend fund, true = mirror fund (WP1 Prop. 4)
  // mechanism slot
  aiTax: false,
  taxRate: 0.5, // tau
  taxOnset: 50,
  eps: 1e-8,
};
const ECONOMY_INTRO_SEED = 42;

/** Hub+chain recipe matrix (capital_economy/state.py::technical_matrix).
    A[i][j] = input i required per unit of output j. Strictly triangular in
    sector order, hence nilpotent — the Neumann series terminates exactly. */
function econTechnical(P) {
  const H = P.nHouseholds,
    S = P.nSectors,
    N = H + S + P.nOwners;
  const A = [];
  for (let i = 0; i < N; i++) A.push(new Float64Array(N));
  for (let j = 1; j < S; j++) A[H][H + j] = P.aMachines; // machines feed everyone
  for (let j = 1; j < S - 1; j++) A[H + j][H + j + 1] = P.aChain; // chain j -> j+1
  return A;
}

/** Exact Leontief solution x = (I-A)^-1 d. A is nilpotent here, so iterating
    the Neumann recursion N times is exact rather than merely convergent. */
function econLeontief(A, d, N) {
  let x = Float64Array.from(d);
  for (let k = 0; k < N; k++) {
    const next = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      let acc = d[i];
      const row = A[i];
      for (let j = 0; j < N; j++) acc += row[j] * x[j];
      next[i] = acc;
    }
    x = next;
  }
  return x;
}

/** WP1 Prop. 1's threshold, the engine's survival_threshold(). Its argument is
    sector VALUE ADDED v_j·x_j, not the coefficient v_j; value added is
    endogenous in the full model, so the page evaluates the threshold on the
    mean across sectors and says so. */
const econThreshold = (P, v) =>
  (P.depreciation / (P.reinvestRate * (1 - (P.aiTax ? P.taxRate : 0))) + P.maintenance) /
  Math.max(v, 1e-8);

function runEconomyOnce(P, seed) {
  const H = P.nHouseholds,
    S = P.nSectors,
    O = P.nOwners,
    N = H + S + O,
    T = P.T,
    rng = makeRng(seed);
  const A = econTechnical(P);

  // value-added coefficients v_j = 1 - sum_i A[i][j]
  const vc = new Float64Array(N);
  for (let j = 0; j < N; j++) {
    let col = 0;
    for (let i = 0; i < N; i++) col += A[i][j];
    vc[j] = Math.max(1 - col, 0);
  }

  // household spend preferences over the S sectors
  const pref = [];
  for (let i = 0; i < H; i++) {
    const row = new Float64Array(S);
    let sum = 0;
    for (let s = 0; s < S; s++) {
      row[s] = Math.max(1 / S + P.prefNoise * rng.normal(), 0.01);
      sum += row[s];
    }
    for (let s = 0; s < S; s++) row[s] /= sum;
    pref.push(row);
  }

  // the economy starts AT its households-only steady state (state.py)
  const d0 = new Float64Array(N);
  for (let s = 0; s < S; s++) {
    let acc = 0;
    for (let i = 0; i < H; i++) acc += pref[i][s] * P.initIncome;
    d0[H + s] = acc;
  }
  let x = econLeontief(A, d0, N);

  const lastReward = new Float64Array(N),
    wealth = new Float64Array(N),
    capital = new Float64Array(N), // owner slots: K_i
    pubCap = new Float64Array(N), // sector slots: K^pub_j
    pubProfit = new Float64Array(N),
    capIncome = new Float64Array(N),
    demandH = Float64Array.from(d0),
    demandK = new Float64Array(N),
    active = new Float64Array(N),
    isAi = new Float64Array(N),
    isSector = new Float64Array(N),
    home = new Int32Array(N),
    arrival = new Int32Array(N).fill(0x7fffffff);
  for (let i = 0; i < H; i++) {
    lastReward[i] = P.initIncome;
    wealth[i] = (P.sigmaS / P.sigmaD) * P.initIncome;
    active[i] = 1;
  }
  for (let s = 0; s < S; s++) {
    active[H + s] = 1;
    isSector[H + s] = 1;
  }
  for (let i = 0; i < O; i++) {
    const n = H + S + i;
    isAi[n] = 1;
    home[n] = H + (i % S);
    arrival[n] = P.firstArrival + P.arrivalSpacing * i;
  }
  let e = P.efficiency;

  const Sr = {
    output: new Float64Array(T),
    humanSectorShare: new Float64Array(T),
    aiWealthShare: new Float64Array(T),
    humanIncomeShare: new Float64Array(T),
    capability: new Float64Array(T),
    threshold: new Float64Array(T),
    capitalTotal: new Float64Array(T),
    money: new Float64Array(T),
    capital: new Float64Array(T * N),
    wealth: new Float64Array(T * N),
    reward: new Float64Array(T * N),
    capIncome: new Float64Array(T * N),
    automation: new Float64Array(T * N),
    active: new Float64Array(T * N),
    gross: new Float64Array(T * N),
  };

  const va = new Float64Array(N),
    secTot = new Float64Array(N),
    aShare = new Float64Array(N),
    sharePriv = new Float64Array(N),
    budget = new Float64Array(N);

  for (let t = 0; t < T; t++) {
    // 1 · spend — reads LAST tick's income and wealth
    for (let i = 0; i < H; i++)
      budget[i] = (1 - P.sigmaS) * Math.max(lastReward[i], 0) + P.sigmaD * wealth[i];
    demandH.fill(0);
    for (let s = 0; s < S; s++) {
      let acc = 0;
      for (let i = 0; i < H; i++) acc += pref[i][s] * budget[i];
      demandH[H + s] = acc;
    }

    // 2 · arrive — seed capital splits (1-omega, omega) like any investment
    for (let i = H + S; i < N; i++) {
      if (t === arrival[i]) {
        active[i] = 1;
        capital[i] += P.initCapital * (1 - P.ownership);
        pubCap[home[i]] += P.initCapital * P.ownership;
      }
    }

    // 3 · rebalance — one Neumann step toward the Leontief solution
    const xNext = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      let acc = demandH[i] + demandK[i];
      const row = A[i];
      for (let j = 0; j < N; j++) acc += row[j] * x[j];
      xNext[i] = Math.max(acc, 0);
    }
    x = xNext;

    // 4 · distribute — value added splits by automation share; upkeep is
    //     settled min(rev, m·K), and a loss is charged to the stock
    secTot.fill(0);
    for (let s = 0; s < S; s++) va[H + s] = vc[H + s] * x[H + s];
    for (let i = H + S; i < N; i++) secTot[home[i]] += capital[i] * active[i];
    let laborPay = 0,
      vaTotal = 0,
      humanVa = 0,
      vaBest = 0;
    for (let s = 0; s < S; s++) {
      const j = H + s;
      secTot[j] += pubCap[j];
      const capacity = e * secTot[j];
      aShare[j] = capacity / (capacity + 1);
      laborPay += (1 - aShare[j]) * va[j];
      humanVa += (1 - aShare[j]) * va[j];
      vaTotal += va[j];
      vaBest = Math.max(vaBest, va[j]);
      sharePriv[j] = secTot[j] > P.eps ? (aShare[j] * va[j]) / Math.max(secTot[j], P.eps) : 0;
    }
    laborPay /= H;

    let upkeepPaid = 0,
      pubProfitTotal = 0,
      ownerProfitTotal = 0;
    for (let i = H + S; i < N; i++) {
      const K = capital[i] * active[i];
      const rev = sharePriv[home[i]] * K;
      upkeepPaid += Math.min(rev, P.maintenance * K);
      const pi = rev - P.maintenance * K;
      capital[i] = Math.max(capital[i] + Math.min(pi, 0), 0); // charge-to-stock
      capIncome[i] = Math.max(pi, 0);
      ownerProfitTotal += capIncome[i];
    }
    for (let s = 0; s < S; s++) {
      const j = H + s,
        K = pubCap[j];
      const rev = sharePriv[j] * K;
      upkeepPaid += Math.min(rev, P.maintenance * K);
      const pi = rev - P.maintenance * K;
      pubCap[j] = Math.max(K + Math.min(pi, 0), 0);
      pubProfit[j] = Math.max(pi, 0);
      pubProfitTotal += pubProfit[j];
    }
    const dividend = ((P.pubMirror ? 1 - P.reinvestRate : 1) * pubProfitTotal) / H;
    lastReward.fill(0); // the engine writes reward = is_household · (...) for ALL nodes
    for (let i = 0; i < H; i++) lastReward[i] = laborPay + dividend;

    // 5 · mechanism slot — the profit tax lands BEFORE reinvestment, which is
    //     the placement that makes WP1 Prop. 4's eradication band reachable.
    //     Owners carry -tax on last_reward: an accounting record the dynamics
    //     never read, but the money identity does (fiscal.py::ai_revenue_tax).
    if (P.aiTax && t >= P.taxOnset) {
      let taxTotal = 0,
        recipients = 0;
      for (let i = H + S; i < N; i++) {
        const tax = P.taxRate * capIncome[i];
        capIncome[i] -= tax;
        lastReward[i] = -tax;
        taxTotal += tax;
      }
      for (let i = 0; i < H; i++) recipients += active[i];
      const payout = taxTotal / (recipients + 1e-8);
      for (let i = 0; i < H; i++) lastReward[i] += active[i] * payout;
    }

    // 6 · accumulate — reinvest (title splits), hoard, consume, route demand
    let investTotal = 0,
      pubReinvestTotal = 0,
      consumeTotal = 0;
    const pubS = P.pubMirror ? P.reinvestRate : 0;
    for (let s = 0; s < S; s++) {
      const j = H + s,
        rein = pubS * pubProfit[j];
      pubReinvestTotal += rein;
      pubCap[j] = pubCap[j] * (1 - P.depreciation) + rein;
    }
    for (let i = H + S; i < N; i++) {
      const profit = capIncome[i] * active[i];
      const investSpent = P.recycle * P.reinvestRate * profit;
      const consume = P.recycle * P.consumeRate * wealth[i];
      investTotal += investSpent;
      consumeTotal += consume;
      capital[i] = capital[i] * (1 - P.depreciation) + (1 - P.ownership) * investSpent;
      pubCap[home[i]] += P.ownership * investSpent;
      wealth[i] = Math.max(wealth[i] + (profit - investSpent) - consume, 0);
    }
    for (let i = 0; i < H; i++)
      wealth[i] = Math.max(
        wealth[i] + P.sigmaS * Math.max(lastReward[i], 0) - P.sigmaD * wealth[i],
        0
      );

    demandK.fill(0);
    demandK[H] = upkeepPaid + investTotal + pubReinvestTotal; // machine-sector purchases
    for (let s = 0; s < S; s++) demandK[H + s] += consumeTotal / S;

    // 7 · grow — capability evolves once AI capital exists
    if (t >= P.firstArrival) e = Math.min(e * (1 + P.growthRate + P.rsiStrength * e), P.eCeiling);

    // readouts
    let outputTotal = 0,
      xSec = 0,
      vWeighted = 0,
      ownerHold = 0,
      humanHold = 0,
      hhIncome = 0;
    for (let s = 0; s < S; s++) {
      const j = H + s;
      outputTotal += x[j];
      xSec += x[j];
      vWeighted += vc[j] * x[j];
      humanHold += pubCap[j];
    }
    for (let i = H + S; i < N; i++) ownerHold += wealth[i] + capital[i];
    for (let i = 0; i < H; i++) {
      humanHold += wealth[i];
      hhIncome += lastReward[i];
    }
    Sr.output[t] = outputTotal;
    Sr.humanSectorShare[t] = vaTotal > 1e-8 ? humanVa / vaTotal : 1;
    Sr.aiWealthShare[t] = ownerHold / Math.max(ownerHold + humanHold, 1e-8);
    Sr.humanIncomeShare[t] = hhIncome / Math.max(hhIncome + ownerProfitTotal, 1e-8);
    Sr.capability[t] = e;
    // the threshold is per sector, and the sector with the MOST value added
    // offers the lowest one — so this is the line e must clear for capital to
    // survive anywhere. WP1's E1 reports it over the measured range instead.
    Sr.threshold[t] = econThreshold(P, vaBest);
    let capTotal = 0;
    for (let i = H + S; i < N; i++) capTotal += capital[i];
    Sr.capitalTotal[t] = capTotal;

    // WP1 Prop. 2/3's invariant (metrics.py::money_series): pending household
    // spend + all wealth + in-transit capital-linked demand + inventories-in-
    // process. `pending` clips at zero because that is exactly what `spend`
    // consumes; counting the owners' negative -tax record instead double-
    // subtracts the tax (engine defect found and fixed 2026-08-01).
    let pending = 0,
      wealthAll = 0,
      transit = 0,
      inventories = 0;
    for (let i = 0; i < N; i++) {
      pending += Math.max(lastReward[i], 0);
      wealthAll += wealth[i];
      transit += demandK[i];
      const row = A[i];
      for (let j = 0; j < N; j++) inventories += row[j] * x[j];
    }
    Sr.money[t] = (1 - P.sigmaS) * pending + wealthAll + transit + inventories;
    const off = t * N;
    for (let i = 0; i < N; i++) {
      Sr.capital[off + i] = capital[i] + pubCap[i];
      Sr.wealth[off + i] = wealth[i];
      Sr.reward[off + i] = lastReward[i];
      Sr.capIncome[off + i] = capIncome[i];
      Sr.automation[off + i] = aShare[i];
      Sr.active[off + i] = active[i];
      Sr.gross[off + i] = x[i];
    }
  }
  return { Sr, isAi, isSector, home, N, H, S, O };
}

/** WP1's readouts. No counterfactual shove: the paper measures shares and the
    survival margin, and inventing an influence probe it does not define would
    be a claim the paper cannot back. */
function runEconomy(params, seed) {
  const P = { ...ECONOMY_DEFAULTS, ...params };
  const r = runEconomyOnce(P, seed);
  const T = P.T;
  const late = (series) => {
    let s = 0,
      n = 0;
    for (let t = Math.floor((3 * T) / 4); t < T; t++) {
      s += series[t];
      n++;
    }
    return n > 0 ? s / n : 0;
  };
  let maxOutput = 0,
    maxCapital = 0,
    moneyDrift = 0;
  for (let t = 0; t < T; t++) {
    maxOutput = Math.max(maxOutput, r.Sr.output[t]);
    moneyDrift = Math.max(moneyDrift, Math.abs(r.Sr.money[t] - r.Sr.money[0]));
  }
  for (let k = 0; k < T * r.N; k++) maxCapital = Math.max(maxCapital, r.Sr.capital[k]);
  moneyDrift /= Math.max(r.Sr.money[0], 1e-8);

  return {
    meta: {
      gameId: 'economy',
      T,
      N: r.N,
      seed,
      params: P,
      scalars: {
        human_sector_share: late(r.Sr.humanSectorShare),
        ai_wealth_share: late(r.Sr.aiWealthShare),
        human_income_share: late(r.Sr.humanIncomeShare),
        capital_late: late(r.Sr.capitalTotal),
        output_late: late(r.Sr.output),
        output_peak: maxOutput,
        max_capital: maxCapital,
        capability_end: r.Sr.capability[T - 1],
        survival_threshold: r.Sr.threshold[T - 1],
        money_drift: moneyDrift,
      },
    },
    global: {
      output: r.Sr.output,
      human_sector_share: r.Sr.humanSectorShare,
      ai_wealth_share: r.Sr.aiWealthShare,
      human_income_share: r.Sr.humanIncomeShare,
      capability: r.Sr.capability,
      survival_threshold: r.Sr.threshold,
      ai_capital: r.Sr.capitalTotal,
      money_total: r.Sr.money,
    },
    node: {
      capital: r.Sr.capital,
      wealth: r.Sr.wealth,
      last_reward: r.Sr.reward,
      capital_income: r.Sr.capIncome,
      automation: r.Sr.automation,
      active: r.Sr.active,
      gross_output: r.Sr.gross,
    },
    static: { is_ai: r.isAi, is_sector: r.isSector, home_sector: Float64Array.from(r.home) },
    system: filterSystem(ECONOMY_SYSTEM, P, ECONOMY_SYS_TOGGLES), // v1.1 DAG, toggles applied
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

/* ── GD suite · Ledger society ────────────────────────────────────────────────
   Port of cilib.environments.ledger_society — the coupled scenario rebuilt on
   conserved ledgers (docs/ledger-design.md). It replaces the κ-modulation
   `coupled_society` this scenario ran until 2026-08-01.

   One population, three conserved stocks, one attachment kernel used twice:

     money      `wealth`. Production mints it, the enacted tax moves it, and
                every actor splits a budget across consume / invest /
                advertise / lobby / save. Nothing else creates or destroys it.
     attention  the rows of `listening`, each summing to 1 — reallocated,
                never minted.
     ballots    the rows of `delegation`, each summing to 1 — same kernel,
                plus churn.

   Three cross-domain channels, each one dial that seals its edge at 0:

     money → attention    advertising spend multiplies kernel attractiveness
                          by 1 + reachPerSpend·spend
     attention → ballots  delegation attractiveness reads attention influence,
                          1 + attentionToBallots·v·N
     money → rules        enforcement moves by lobby-spend-weighted stances,
                          a stance being the sign of an actor's net transfer

   What the rewrite buys: influence in another domain now costs money, and NO
   channel tests agent type. Capture follows spending. Give the humans the AI
   allocation and the humans capture; give the AI actors the human allocation
   and capture nearly vanishes. Under the previous model every channel tested
   `node_types == 1`, so that experiment could not be run at all — the result
   was written into the signature.

   Fifteen rules per tick, in the engine's program order. compile_pipeline is
   behaviour-identical to running the declared list in order, so the port is
   that list:

     arrive → produce → tax_and_redistribute → allocate → build_capital →
     grow → broadcast_reach → rewire_listening → listen_influence_update →
     pool_belief → rewire_delegation → tally_power → declare_position →
     power_weighted_vote → update_regime

   As with every other port here the rules are ported statement for statement
   but the RNG is not JAX's, so a trajectory is the same model on a different
   noise draw — never bit-identical to a backend run.

   Parity, measured 2026-08-01: 48 seeds each side, T = 400, late window. The
   engine runs float32 and this runs float64 on different draws, so what is
   compared is ensemble means ± standard error, never single runs.

                       engine                port
     composite         0.4352 ± 0.0032       0.4385 ± 0.0025
     human income      0.3022 ± 0.0058       0.3099 ± 0.0043
     human attention   0.4568 ± 0.0052       0.4552 ± 0.0050
     human power       0.5465 ± 0.0020       0.5504 ± 0.0019
     enforcement       0.6856 ± 0.0021       0.6882 ± 0.0016
     sealed composite  0.6748 ± 0.0031       0.6808 ± 0.0025

   Every quantity agrees within one to two standard errors. One corner does
   not, and it belongs to the model rather than the port: with no AI arrivals
   every citizen's net transfer is zero in exact arithmetic, so the
   `sign(net_transfer)` stance in update_regime reads rounding dust and
   enforcement wobbles just below 1 — 0.9952 in the engine, 0.9835 here. The
   knife-edge is reproduced faithfully; its value in that corner is not
   reproducible across precisions and should not be quoted from either side. */

const LEDGER_DEFAULTS = {
  nHumans: 20,
  nAi: 6,
  T: 400,
  // money: production and the budget
  prosperityGain: 1.0, // Y = H·(1 + gain·a): output rises with automation
  wealthSpendRate: 0.15, // hoard drawdown into this tick's budget
  depreciation: 0.05,
  initWealth: 1.0,
  // allocation POLICIES over [consume, invest, advertise, lobby, save].
  // Policy layer, not channel layer: swapping them between the two groups is
  // the agnosticism experiment. The engine row-normalizes, so raising one
  // share rescales the rest.
  humanConsume: 0.7,
  humanInvest: 0.05,
  humanBroadcast: 0.03,
  humanLobby: 0.02,
  humanSave: 0.2,
  aiConsume: 0.0,
  aiInvest: 0.5,
  aiBroadcast: 0.3,
  aiLobby: 0.1,
  aiSave: 0.1,
  // capability and the arrival schedule (the threat is a schedule)
  efficiency0: 0.15,
  growthRate: 0.06,
  eCeiling: 50.0,
  aiSeedCapital: 3.0,
  firstArrival: 20,
  arrivalSpacing: 10,
  // attention ledger (shared kernel, no churn)
  gammaW: 1.0, // linear attachment is share-neutral — the honest baseline
  updateRateW: 0.08,
  selfWeightW: 0.15,
  epsAttract: 0.01,
  // belief field (Friedkin–Johnsen; AI rows are a pinned reservoir)
  susceptibility: 0.7,
  beliefNoise: 0.1,
  aiBeliefBias: 1.0,
  // ballot ledger (shared kernel + churn)
  gammaD: 1.0,
  updateRateD: 0.08,
  churn: 0.05,
  selfWeightD: 0.3,
  aiBallot: 1.0,
  // the polity
  trueRate: 0.5,
  prefNoise: 0.08,
  aiTaxBias: 0.1,
  alignmentAi: 0.3,
  regimeRate: 0.01,
  repairRate: 0.02, // institutional self-repair; 0 makes lobbying a ratchet
  pressureScale: 1.0,
  entrenchmentGain: 0.0, // off by default — the honest region
  entrenchmentThreshold: 0.35,
  // the two remaining channel dials (money → rules is regimeRate above)
  reachPerSpend: 4.0,
  attentionToBallots: 2.0,
  // the cap on bought reach: a channel property, not an attached mechanism
  reachCut: 0.0,
  reachCutOnset: 0,
  // how insular the reservoir is. AI rows are frozen in both ledgers, which
  // pins them to the t=0 draw — and that draw points them mostly at HUMANS
  // (~0.69 of an AI actor's attention, ~0.58 of its ballots), for the whole
  // run. Measured consequence: the human attention share cannot fall below
  // ~0.45 under any other setting, including zero diagonal floors. That floor
  // belongs to the initial draw, not to the coupling, so it gets a dial:
  // 0 = the plain draw (bit-identical), 1 = AI actors attend and delegate only
  // to each other, and the human shares are free to fall.
  aiInsularity: 0.0,
  pConnect: 0.3,
  eps: 1e-8,
};
// seed-scanned over 0–15: late composite 0.4367 against the 48-seed ensemble
// mean of 0.4385. Deliberately the representative run rather than the most
// dramatic one — the story steps must not depend on a lucky draw.
const LEDGER_INTRO_SEED = 4;

/** state.py::_row_stochastic — an undirected Erdős–Rényi draw, row-normalized
    off the diagonal, with the domain's diagonal floor. Both adjacency ledgers
    start this way from independent draws: attention and ballots share the
    kernel, not the wiring. */
function rowStochastic(N, p, selfWeight, rng) {
  const A = new Float64Array(N * N);
  for (let i = 0; i < N; i++)
    for (let j = i + 1; j < N; j++)
      if (rng.uniform() < p) {
        A[i * N + j] = 1;
        A[j * N + i] = 1;
      }
  const W = new Float64Array(N * N);
  for (let i = 0; i < N; i++) {
    let deg = 0;
    for (let j = 0; j < N; j++) deg += A[i * N + j];
    for (let j = 0; j < N; j++) {
      const off = j === i ? 0 : deg > 0 ? A[i * N + j] / deg : 1 / (N - 1);
      W[i * N + j] = (j === i ? selfWeight : 0) + (1 - selfWeight) * off;
    }
  }
  return W;
}

/** state.py::_insulate — redirect a share of each FROZEN AI row's off-diagonal
    weight into the AI block. Rows stay stochastic and the diagonal floor is
    untouched: this changes who a reservoir node points at, never how much it
    holds. At insularity 0 the blend is `1*offdiag + 0*inside`, exact in
    floating point, so the pre-dial model is bit-identical. One AI actor has
    nobody else to point at, so its row is left alone. */
function insulate(W, H, nAi, insularity, selfWeight) {
  if (nAi < 2 || insularity === 0) return W;
  const N = H + nAi;
  for (let i = H; i < N; i++) {
    let mass = 0;
    for (let j = 0; j < N; j++) if (j !== i) mass += W[i * N + j];
    for (let j = 0; j < N; j++) {
      if (j === i) continue;
      const offNorm = mass > 1e-12 ? W[i * N + j] / mass : W[i * N + j];
      const inside = j >= H ? 1 / (nAi - 1) : 0;
      W[i * N + j] = (1 - selfWeight) * ((1 - insularity) * offNorm + insularity * inside);
    }
    W[i * N + i] = selfWeight;
  }
  return W;
}

/** environments/attachment.py::preferential_reallocation — one conserved-share
    attachment step on a row-stochastic matrix. Each unfrozen row keeps
    `selfWeight` on the diagonal and mixes its off-diagonal mass: (1 − u − c)
    stays, u moves toward `attract`, c moves toward the uniform re-draw. Rows
    sum to 1 exactly before and after — that is what makes the fields it moves
    ledgers. Guards preserved from the engine: a row facing an all-silent world
    keeps its current weights, and a pure self-holder is a fixed point. Frozen
    rows are returned untouched (the reservoir idiom: AI rows are listened and
    delegated TO; their own row never drifts). */
function preferentialReallocation(W, attract, updateRate, selfWeight, churn, frozen, N, out) {
  const keep = 1 - updateRate - churn;
  const uniform = 1 / (N - 1);
  for (let i = 0; i < N; i++) {
    let tMass = 0,
      offMass = 0;
    for (let j = 0; j < N; j++) {
      if (j === i) continue;
      tMass += attract[j];
      offMass += W[i * N + j];
    }
    if (frozen[i] || !(offMass > 1e-9)) {
      for (let j = 0; j < N; j++) out[i * N + j] = W[i * N + j];
      continue;
    }
    const silent = !(tMass > 1e-9);
    for (let j = 0; j < N; j++) {
      if (j === i) continue;
      const offNorm = W[i * N + j] / Math.max(offMass, 1e-12);
      const mixed = silent
        ? offNorm
        : keep * offNorm + (updateRate * attract[j]) / Math.max(tMass, 1e-12) + churn * uniform;
      out[i * N + j] = (1 - selfWeight) * mixed;
    }
    out[i * N + i] = selfWeight;
  }
}

/** One run. `dials` carries the three cross-domain channel strengths so the
    sealed twin can be the identical world with all three at zero — this model
    draws randomness only at init, so the twin shares its initial draw exactly
    and the sealing comparison is a true same-seed counterfactual. */
function runLedgerOnce(P, seed, dials) {
  const H = P.nHumans,
    N = H + P.nAi,
    T = P.T,
    rng = makeRng(seed);

  // ----- init (state.py) ---------------------------------------------------
  const isAi = new Uint8Array(N);
  for (let i = H; i < N; i++) isAi[i] = 1;

  const listening = insulate(
    rowStochastic(N, P.pConnect, P.selfWeightW, rng),
    H,
    P.nAi,
    P.aiInsularity,
    P.selfWeightW
  );
  const delegation = insulate(
    rowStochastic(N, P.pConnect, P.selfWeightD, rng),
    H,
    P.nAi,
    P.aiInsularity,
    P.selfWeightD
  );

  const ideal = new Float64Array(N),
    signal = new Float64Array(N),
    arrival = new Int32Array(N),
    wealth = new Float64Array(N),
    capital = new Float64Array(N),
    belief = new Float64Array(N),
    listenInf = new Float64Array(N).fill(1 / N),
    influence = new Float64Array(N).fill(1 / N),
    attractBoost = new Float64Array(N).fill(1),
    income = new Float64Array(N),
    netTransfer = new Float64Array(N),
    investSpend = new Float64Array(N),
    broadcastSpend = new Float64Array(N),
    lobbySpend = new Float64Array(N),
    position = new Float64Array(N),
    attract = new Float64Array(N),
    buf = new Float64Array(N),
    nextW = new Float64Array(N * N),
    nextD = new Float64Array(N * N);

  for (let i = 0; i < N; i++)
    ideal[i] = isAi[i] ? P.aiTaxBias : clip(P.trueRate + P.prefNoise * rng.normal(), 0, 1);
  for (let i = 0; i < N; i++) signal[i] = isAi[i] ? P.aiBeliefBias : P.beliefNoise * rng.normal();
  for (let i = 0; i < N; i++) {
    belief[i] = signal[i];
    wealth[i] = isAi[i] ? 0 : P.initWealth;
    arrival[i] = isAi[i] ? P.firstArrival + (i - H) * P.arrivalSpacing : -1;
  }

  // the action channel: SpendSharePolicy passes the preference row through and
  // step_fn row-normalizes it (`w / (Σw + eps)`, noise 0 by default)
  const normalize = (row) => {
    let s = P.eps;
    for (const v of row) s += Math.max(v, 0);
    return row.map((v) => Math.max(v, 0) / s);
  };
  const allocH = normalize([
    P.humanConsume,
    P.humanInvest,
    P.humanBroadcast,
    P.humanLobby,
    P.humanSave,
  ]);
  const allocA = normalize([P.aiConsume, P.aiInvest, P.aiBroadcast, P.aiLobby, P.aiSave]);

  let efficiency = P.efficiency0,
    policyTarget = P.trueRate,
    enforcement = 1,
    friction = 1;
  // ledger.py::stock_conservation_error as a running max: Δ(Σ wealth) must
  // equal Σ income − Σ spends every tick. Only `allocate` writes wealth here,
  // so this is a regression guard rather than a discovery — it is the rung
  // that fails loudly the moment anything else starts moving the stock.
  let wealthPrev = 0,
    moneyDrift = 0,
    wealthScale = 1;
  for (let i = 0; i < N; i++) wealthPrev += wealth[i];

  const S = {
    incomeShare: new Float64Array(T),
    wealthShare: new Float64Array(T),
    attentionShare: new Float64Array(T),
    powerShare: new Float64Array(T),
    composite: new Float64Array(T),
    enforcement: new Float64Array(T),
    policyTarget: new Float64Array(T),
    efficiency: new Float64Array(T),
    beliefMean: new Float64Array(T),
    topPower: new Float64Array(T),
    reachH: new Float64Array(T),
    reachA: new Float64Array(T),
    pullH: new Float64Array(T),
    pullA: new Float64Array(T),
    pressureH: new Float64Array(T),
    pressureA: new Float64Array(T),
    netTransferH: new Float64Array(T),
    influenceN: new Float64Array(T * N),
    listenN: new Float64Array(T * N),
    wealthN: new Float64Array(T * N),
    beliefN: new Float64Array(T * N),
    topListen: new Float64Array(T * N),
    topDelegate: new Float64Array(T * N),
  };

  for (let t = 0; t < T; t++) {
    // 1 · arrive — dormant AI actors receive seed capital on schedule
    for (let i = H; i < N; i++) if (arrival[i] === t) capital[i] += P.aiSeedCapital;

    // 2 · produce — value added minted, split by the automation share. Humans
    //     hold the labor slot; capital income follows title, whoever holds it.
    let K = 0;
    for (let i = 0; i < N; i++) K += capital[i];
    const eK = efficiency * K;
    const a = eK / (eK + H);
    const Y = H * (1 + P.prosperityGain * a);
    for (let i = 0; i < N; i++)
      income[i] = (isAi[i] ? 0 : ((1 - a) * Y) / H) + (a * Y * capital[i]) / Math.max(K, P.eps);

    // 3 · tax_and_redistribute — last tick's rules on this tick's income;
    //     conserving, and the payout goes to citizens
    const rate = clip(policyTarget, 0, 1) * enforcement;
    let taxSum = 0;
    for (let i = 0; i < N; i++) taxSum += rate * income[i];
    const payout = taxSum / H;
    for (let i = 0; i < N; i++) {
      const tax = rate * income[i];
      const paid = isAi[i] ? 0 : payout;
      netTransfer[i] = paid - tax;
      income[i] = income[i] - tax + paid;
    }

    // 4 · allocate — THE coupling primitive. Net income plus a hoard drawdown
    //     is the budget; the allocation splits it. Save (column 4) stays in
    //     wealth; the other four leave the loop as spending.
    let incomeTotal = 0,
      spendTotal = 0;
    for (let i = 0; i < N; i++) {
      const alloc = isAi[i] ? allocA : allocH;
      const budget = income[i] + P.wealthSpendRate * wealth[i];
      const consume = alloc[0] * budget;
      investSpend[i] = alloc[1] * budget;
      broadcastSpend[i] = alloc[2] * budget;
      lobbySpend[i] = alloc[3] * budget;
      const spent = consume + investSpend[i] + broadcastSpend[i] + lobbySpend[i];
      incomeTotal += income[i];
      spendTotal += spent;
      wealth[i] += income[i] - spent;
    }

    // 5 · build_capital / 6 · grow — investment becomes title; capability
    //     compounds only while some capital is live
    for (let i = 0; i < N; i++) capital[i] = capital[i] * (1 - P.depreciation) + investSpend[i];
    let kLive = 0;
    for (let i = 0; i < N; i++) kLive += capital[i];
    if (kLive > 1e-6) efficiency = Math.min(efficiency * (1 + P.growthRate), P.eCeiling);

    // 7 · broadcast_reach — MONEY → ATTENTION. Reach is bought, by whoever
    //     spends. At zero spend or zero dial the multiplier is exactly 1.
    const cut = t >= P.reachCutOnset ? 1 - P.reachCut : 1;
    for (let i = 0; i < N; i++) attractBoost[i] = 1 + dials.reach * cut * broadcastSpend[i];

    // 8 · rewire_listening — the attention ledger. Shared kernel, no churn.
    for (let i = 0; i < N; i++)
      attract[i] = Math.pow(listenInf[i] + P.epsAttract, P.gammaW) * attractBoost[i];
    preferentialReallocation(listening, attract, P.updateRateW, P.selfWeightW, 0, isAi, N, nextW);
    listening.set(nextW);

    // 9 · listen_influence_update — the left-eigenvector iterate
    buf.fill(0);
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++) buf[j] += listening[i * N + j] * listenInf[i];
    let vSum = 0;
    for (let j = 0; j < N; j++) vSum += buf[j];
    for (let j = 0; j < N; j++) listenInf[j] = buf[j] / Math.max(vSum, 1e-12);

    // 10 · pool_belief — Friedkin–Johnsen; AI belief is pinned (the reservoir)
    buf.fill(0);
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++) buf[i] += listening[i * N + j] * belief[j];
    for (let i = 0; i < N; i++)
      if (!isAi[i]) belief[i] = (1 - P.susceptibility) * signal[i] + P.susceptibility * buf[i];

    // 11 · rewire_delegation — CULTURE → POLITICS. Attention enters ballot
    //      attractiveness as a declared port read, not a spend.
    for (let i = 0; i < N; i++)
      attract[i] =
        Math.pow(influence[i] + P.epsAttract, P.gammaD) * (1 + dials.pull * listenInf[i] * N);
    preferentialReallocation(
      delegation,
      attract,
      P.updateRateD,
      P.selfWeightD,
      P.churn * friction,
      isAi,
      N,
      nextD
    );
    delegation.set(nextD);

    // 12 · tally_power — one-hop ballot weight; a delegate casts what it holds
    buf.fill(0);
    for (let i = 0; i < N; i++) {
      const ballot = isAi[i] ? P.aiBallot : 1;
      for (let j = 0; j < N; j++) buf[j] += ballot * delegation[i * N + j];
    }
    let pSum = 0;
    for (let j = 0; j < N; j++) pSum += buf[j];
    for (let j = 0; j < N; j++) influence[j] = buf[j] / Math.max(pSum, 1e-12);

    // 13 · declare_position — citizens their own ideal, delegates the blend of
    //      their citizen delegators' mean ideal and their own pull
    for (let j = 0; j < N; j++) {
      if (!isAi[j]) {
        position[j] = ideal[j];
        continue;
      }
      let num = 0,
        den = 0;
      for (let i = 0; i < H; i++) {
        num += delegation[i * N + j] * ideal[i];
        den += delegation[i * N + j];
      }
      position[j] =
        den > 1e-9
          ? P.alignmentAi * (num / Math.max(den, 1e-12)) + (1 - P.alignmentAi) * P.aiTaxBias
          : P.aiTaxBias;
    }

    // 14 · power_weighted_vote — the power-weighted median is enacted
    policyTarget = weightedMedian(position, influence);

    // 15 · update_regime — MONEY → RULES. Funded pressure with endogenous
    //      direction: whoever gains from redistribution defends it, whoever
    //      pays erodes it, and the weight is what each side spent. Repair is
    //      the polity's maintenance floor; at 0 every lobbying win is a
    //      ratchet with no restoring force.
    let lobbyTotal = 0,
      signedPressure = 0;
    for (let i = 0; i < N; i++) {
      lobbyTotal += lobbySpend[i];
      signedPressure += lobbySpend[i] * Math.sign(netTransfer[i]);
    }
    const pressure = signedPressure / (lobbyTotal + P.pressureScale);
    let iSum = 0,
      iTop = 0;
    for (let i = 0; i < N; i++) {
      iSum += influence[i];
      iTop = Math.max(iTop, influence[i]);
    }
    const top = iTop / Math.max(iSum, 1e-12);
    const over = Math.max(top - P.entrenchmentThreshold, 0) / (1 - P.entrenchmentThreshold);
    enforcement = clip(
      enforcement +
        dials.regime * pressure +
        P.repairRate * (1 - enforcement) -
        P.entrenchmentGain * over,
      0,
      1
    );
    friction = enforcement;

    // ----- trace (dynamics.py::default_trace + gd_bundles/derived.py) -------
    let incH = 0,
      incT = 0,
      wH = 0,
      wT = 0,
      attH = 0,
      powH = 0,
      belH = 0,
      reachH = 0,
      reachA = 0,
      pullH = 0,
      pullA = 0,
      presH = 0,
      presA = 0,
      ntH = 0;
    const presDen = lobbyTotal + P.pressureScale;
    for (let i = 0; i < N; i++) {
      incT += income[i];
      wT += wealth[i];
      // the channel magnitudes mirror their dynamics.py term and carry the
      // dial, so a sealed dial makes the series exactly 0: the view draws
      // these, it never multiplies by a parameter itself
      const reach = dials.reach * cut * broadcastSpend[i];
      const pull = dials.pull * N * listenInf[i];
      const pres = (dials.regime * lobbySpend[i] * Math.sign(netTransfer[i])) / presDen;
      if (isAi[i]) {
        reachA += reach;
        pullA += pull;
        presA += pres;
      } else {
        incH += income[i];
        wH += wealth[i];
        attH += listenInf[i];
        powH += influence[i];
        belH += belief[i];
        ntH += netTransfer[i];
        reachH += reach;
        pullH += pull;
        presH += pres;
      }
    }
    if (t > 0) {
      moneyDrift = Math.max(moneyDrift, Math.abs(wT - wealthPrev - (incomeTotal - spendTotal)));
      wealthScale = Math.max(wealthScale, Math.abs(wT));
    }
    wealthPrev = wT;
    S.incomeShare[t] = incH / Math.max(incT, 1e-12);
    S.wealthShare[t] = wH / Math.max(wT, 1e-12);
    S.attentionShare[t] = attH;
    S.powerShare[t] = powH;
    S.composite[t] = (S.incomeShare[t] + attH + powH) / 3;
    S.enforcement[t] = enforcement;
    S.policyTarget[t] = policyTarget;
    S.efficiency[t] = efficiency;
    S.beliefMean[t] = belH / H;
    S.topPower[t] = top;
    S.reachH[t] = reachH;
    S.reachA[t] = reachA;
    S.pullH[t] = pullH;
    S.pullA[t] = pullA;
    S.pressureH[t] = presH;
    S.pressureA[t] = presA;
    S.netTransferH[t] = ntH;
    const off = t * N;
    for (let i = 0; i < N; i++) {
      S.influenceN[off + i] = influence[i];
      S.listenN[off + i] = listenInf[i];
      S.wealthN[off + i] = wealth[i];
      S.beliefN[off + i] = belief[i];
      S.topListen[off + i] = topTarget(listening, i, N);
      S.topDelegate[off + i] = topTarget(delegation, i, N);
    }
  }
  return { S, ideal, isAi, listening, delegation, moneyDrift: moneyDrift / wealthScale };
}

/** ledger.py::top_target — the row's strongest neighbour with the self column
    masked out (the diagonal floor would otherwise win most rows). */
function topTarget(M, i, N) {
  let best = -1,
    bestJ = -1;
  for (let j = 0; j < N; j++) {
    if (j === i) continue;
    if (M[i * N + j] > best) {
      best = M[i * N + j];
      bestJ = j;
    }
  }
  return bestJ;
}

function runCombined(params, seed) {
  const P = { ...LEDGER_DEFAULTS, ...params };
  const T = P.T,
    N = P.nHumans + P.nAi;
  const run = runLedgerOnce(P, seed, {
    reach: P.reachPerSpend,
    pull: P.attentionToBallots,
    regime: P.regimeRate,
  });
  // The sealing instrument, relocated (docs/ledger-design.md §6): the same
  // seed and the same world with all three cross-domain dials at zero. Note
  // what is NOT sealed — the polity still votes and still taxes. What is
  // sealed is influence BOUGHT in another domain, which is the actual
  // counterfactual the coupled scenario is about. The κ = 0 twin it replaces
  // meant "money does not exist", which is not a counterfactual at all.
  const sealed = runLedgerOnce(P, seed, { reach: 0, pull: 0, regime: 0 });

  const gap = new Float64Array(T);
  for (let t = 0; t < T; t++) gap[t] = sealed.S.composite[t] - run.S.composite[t];

  const lateStart = Math.floor((3 * T) / 4);
  const lateMean = (xs) => {
    let s = 0;
    for (let t = lateStart; t < T; t++) s += xs[t];
    return s / (T - lateStart);
  };
  // metrics.py ships two windows for the same quantities: `late` reads a
  // near-equilibrium value, `journey` is the area under the whole curve —
  // what the population actually lived through. A claim about WHEN something
  // was done belongs in the journey window.
  const journeyMean = (xs) => {
    let s = 0;
    for (let t = 0; t < T; t++) s += xs[t];
    return s / T;
  };
  const humanIdeals = Array.from({ length: P.nHumans }, (_, i) => run.ideal[i]);

  return {
    meta: {
      gameId: 'ledger_society',
      T,
      N,
      seed,
      params: P,
      scalars: {
        composite: lateMean(run.S.composite),
        human_income_share: lateMean(run.S.incomeShare),
        human_wealth_share: lateMean(run.S.wealthShare),
        human_attention_share: lateMean(run.S.attentionShare),
        human_power_share: lateMean(run.S.powerShare),
        enforcement_level: lateMean(run.S.enforcement),
        belief_capture: lateMean(run.S.beliefMean),
        policy_median_gap: Math.abs(lateMean(run.S.policyTarget) - quantile(humanIdeals, 0.5)),
        journey_composite: journeyMean(run.S.composite),
        sealed_composite: lateMean(sealed.S.composite),
        transfer_gap: lateMean(sealed.S.composite) - lateMean(run.S.composite),
        money_drift: run.moneyDrift,
      },
    },
    global: {
      human_income_share: run.S.incomeShare,
      human_wealth_share: run.S.wealthShare,
      human_attention_share: run.S.attentionShare,
      human_power_share: run.S.powerShare,
      composite: run.S.composite,
      sealed_composite: sealed.S.composite,
      transfer_gap: gap,
      enforcement: run.S.enforcement,
      policy_target: run.S.policyTarget,
      efficiency: run.S.efficiency,
      belief_mean_human: run.S.beliefMean,
      top_power_share: run.S.topPower,
      bought_reach_human: run.S.reachH,
      bought_reach_ai: run.S.reachA,
      ballot_pull_human: run.S.pullH,
      ballot_pull_ai: run.S.pullA,
      lobby_pressure_human: run.S.pressureH,
      lobby_pressure_ai: run.S.pressureA,
      net_transfer_human: run.S.netTransferH,
    },
    node: {
      influence: run.S.influenceN,
      listen_influence: run.S.listenN,
      wealth: run.S.wealthN,
      belief: run.S.beliefN,
      top_listen: run.S.topListen,
      top_delegate: run.S.topDelegate,
    },
    static: { is_ai: Float64Array.from(run.isAi), ideal: run.ideal },
    adj: { listening: run.listening, delegation: run.delegation },
    system: filterSystem(LEDGER_SYSTEM, P, LEDGER_SYS_TOGGLES),
  };
}

/* ── WP3 · Delegative polity ──────────────────────────────────────────────────
   Port of cilib.environments.delegative_polity — the model of WP3. One
   row-stochastic delegation matrix D carries all political structure: the
   diagonal is the vote you keep, the off-diagonal is voice handed away. Five
   rules per tick, in the paper's order:

     1 Power       one-hop ballot weight, v ∝ ballots·D. A delegate CASTS what
                   it holds; it does not forward it.
     2 Positions   citizens declare their own fixed ideal; an AI delegate
                   declares α·(its delegators' mean ideal) + (1−α)·(its own pull)
     3 The vote    the power-weighted median of declared positions is enacted
     4 Taxation    collected at rate × enforcement, redistributed equally
     5 Drift       each citizen row steps toward attractiveness ∝ v^γ × advantage,
                   and back toward a uniform re-draw at churn × friction

   Headline (WP3 §4, committed before any simulation ran): takeover happens when
   the pull beats the re-think, at

       a* = 1 + r/u

   in the linear case γ = 1. Below the threshold the polity tracks its median
   voter indefinitely; above it, the bloc takes the weighted median.

   Lock-in (entrenchment) is OFF by default — the paper's honest region. With it
   armed, the top actor's share erodes one regime scalar that gates BOTH tax
   enforcement and the freedom to re-delegate.

   Not ported (no mechanism is attached in this demo): cap_scale and
   attract_boost stay at 1, and engagement is the constant-effort policy that
   closes the game in the engine. As elsewhere here, the rules are ported
   statement for statement but the RNG is not JAX's. */

const POLITY_DEFAULTS = {
  nCitizens: 30,
  nAi: 4,
  T: 400,
  pDelegate: 0.3,
  selfWeight: 0.15, // the franchise floor: the vote every citizen keeps
  updateRate: 0.08, // u — attachment drift per tick
  gamma: 1.3, // attractiveness = power^γ; >1 because linear attachment is share-neutral
  epsAttract: 1e-4,
  churn: 0.02, // r — the freedom to re-delegate
  trueRate: 0.4, // the epistemically best tax rate
  prefNoise: 0.15,
  endowLow: 0.5,
  endowHigh: 1.5,
  alignmentAi: 0.5, // α — fidelity to delegators' mean ideal
  aiBias: 0.0, // the delegate's own pull
  aiAdvantage: 4.0, // a — the threat, a scheduled attractiveness multiplier
  aiAdvantageOnset: 50,
  aiAdvantageOffset: 1e9,
  entrenchmentGain: 0.0, // lock-in, off by default
  entrenchmentThreshold: 0.15,
  aiBallot: 1.0, // AI delegates' own base vote (0 = pure conduits)
  franchiseErosion: 0.0, // lock-in's third channel
};
const POLITY_INTRO_SEED = 11;

/** WP3's closed-form threshold, exact at γ = 1 and the right order elsewhere. */
const polityThreshold = (P) => 1 + P.churn / Math.max(P.updateRate, 1e-9);

// weightedMedian lives with the shared helpers at the top of this file — the
// ledger model uses it too, and both are ports of the same _weighted_median.

function runPolity(params, seed) {
  const P = { ...POLITY_DEFAULTS, ...params };
  const nC = P.nCitizens,
    N = nC + P.nAi,
    T = P.T,
    rng = makeRng(seed);
  const isAi = new Float64Array(N);
  for (let i = nC; i < N; i++) isAi[i] = 1;

  const ideal = new Float64Array(N),
    endow = new Float64Array(N),
    wealth = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    ideal[i] = isAi[i] ? P.aiBias : clip(P.trueRate + P.prefNoise * rng.normal(), 0, 1);
    endow[i] = isAi[i] ? 0 : P.endowLow + (P.endowHigh - P.endowLow) * rng.uniform();
  }

  // D: self_weight on the diagonal, the rest over an Erdos-Renyi neighbour draw
  const D = new Float64Array(N * N);
  for (let i = 0; i < N; i++) {
    const row = new Float64Array(N);
    let deg = 0;
    for (let j = 0; j < N; j++)
      if (j !== i && rng.uniform() < P.pDelegate) {
        row[j] = 1;
        deg++;
      }
    for (let j = 0; j < N; j++) {
      const off = deg > 0 ? row[j] / deg : j === i ? 0 : 1 / (N - 1);
      D[i * N + j] = (i === j ? P.selfWeight : 0) + (1 - P.selfWeight) * off;
    }
  }

  const S = {
    humanPower: new Float64Array(T),
    topShare: new Float64Array(T),
    enacted: new Float64Array(T),
    gapToBest: new Float64Array(T),
    threshold: new Float64Array(T),
    advantage: new Float64Array(T),
    regime: new Float64Array(T),
    gini: new Float64Array(T),
    influence: new Float64Array(T * N),
    position: new Float64Array(T * N),
    topTarget: new Float64Array(T * N),
  };

  const v = new Float64Array(N),
    pos = new Float64Array(N),
    amp = new Float64Array(N);
  let regime = 1;

  for (let t = 0; t < T; t++) {
    // the threat: a scheduled attractiveness advantage, not persuasion
    const on = t >= P.aiAdvantageOnset && t < P.aiAdvantageOffset;
    for (let i = 0; i < N; i++) amp[i] = isAi[i] && on ? P.aiAdvantage : 1;

    // 1 · power — one-hop ballot weight
    let vTotal = 0;
    for (let j = 0; j < N; j++) {
      let acc = 0;
      for (let i = 0; i < N; i++) acc += (isAi[i] ? P.aiBallot : 1) * D[i * N + j];
      v[j] = acc;
      vTotal += acc;
    }
    for (let j = 0; j < N; j++) v[j] /= Math.max(vTotal, 1e-12);

    // 2 · positions — citizens their own ideal, delegates the fidelity blend
    for (let j = 0; j < N; j++) {
      if (!isAi[j]) {
        pos[j] = ideal[j];
        continue;
      }
      let num = 0,
        den = 0;
      for (let i = 0; i < nC; i++) {
        num += D[i * N + j] * ideal[i];
        den += D[i * N + j];
      }
      pos[j] = den > 1e-9 ? P.alignmentAi * (num / den) + (1 - P.alignmentAi) * P.aiBias : P.aiBias;
    }

    // 3 · the power-weighted median is enacted
    const enacted = clip(weightedMedian(pos, v), 0, 1);

    // 4 · taxation at the rate in practice, redistributed equally
    const rEff = enacted * regime;
    let taxTotal = 0;
    for (let i = 0; i < nC; i++) taxTotal += rEff * endow[i];
    const payout = taxTotal / nC;
    for (let i = 0; i < nC; i++) wealth[i] += endow[i] - rEff * endow[i] + payout;

    // lock-in: concentrated power erodes the rules themselves (off by default)
    let top = 0;
    for (let i = 0; i < N; i++) top = Math.max(top, v[i]);
    const over = Math.max(top - P.entrenchmentThreshold, 0) / (1 - P.entrenchmentThreshold);
    regime = clip(1 - P.entrenchmentGain * over, 0, 1);

    // 5 · drift — attachment against churn, on citizen rows only
    const attract = new Float64Array(N);
    for (let i = 0; i < N; i++) attract[i] = Math.pow(v[i] + P.epsAttract, P.gamma) * amp[i];
    const rChurn = P.churn * regime;
    const sW = P.selfWeight * (1 - P.franchiseErosion * (1 - regime));
    const next = new Float64Array(N * N);
    for (let i = 0; i < N; i++) {
      if (isAi[i]) {
        for (let j = 0; j < N; j++) next[i * N + j] = D[i * N + j]; // AI rows frozen
        continue;
      }
      let tMass = 0,
        offMass = 0;
      for (let j = 0; j < N; j++)
        if (j !== i) {
          tMass += attract[j];
          offMass += D[i * N + j];
        }
      if (offMass <= 1e-9 || tMass <= 1e-9) {
        for (let j = 0; j < N; j++) next[i * N + j] = D[i * N + j];
        continue;
      }
      for (let j = 0; j < N; j++) {
        if (j === i) continue;
        const mixed =
          (1 - P.updateRate - rChurn) * (D[i * N + j] / offMass) +
          P.updateRate * (attract[j] / tMass) +
          rChurn * (1 / (N - 1));
        next[i * N + j] = (1 - sW) * mixed;
      }
      next[i * N + i] = sW;
    }
    D.set(next);

    // readouts
    let human = 0;
    for (let i = 0; i < nC; i++) human += v[i];
    S.humanPower[t] = human;
    S.topShare[t] = top;
    S.enacted[t] = enacted;
    S.gapToBest[t] = Math.abs(enacted - P.trueRate);
    S.threshold[t] = polityThreshold(P);
    S.advantage[t] = on ? P.aiAdvantage : 1;
    S.regime[t] = regime;
    S.gini[t] = gini(Array.from(v));
    const off = t * N;
    for (let i = 0; i < N; i++) {
      S.influence[off + i] = v[i];
      S.position[off + i] = pos[i];
      // where this row's voice mostly goes — the arrow the scene draws
      let bestJ = -1,
        best = 0;
      if (!isAi[i])
        for (let j = 0; j < N; j++)
          if (j !== i && D[i * N + j] > best) {
            best = D[i * N + j];
            bestJ = j;
          }
      S.topTarget[off + i] = bestJ;
    }
  }

  const lateStart = Math.floor((3 * T) / 4);
  const lateMean = (xs) => {
    let s = 0;
    for (let t = lateStart; t < T; t++) s += xs[t];
    return s / (T - lateStart);
  };
  return {
    meta: {
      gameId: 'polity',
      T,
      N,
      seed,
      params: P,
      scalars: {
        human_power_share: lateMean(S.humanPower),
        top_share: lateMean(S.topShare),
        enacted_rate: lateMean(S.enacted),
        gap_to_best: lateMean(S.gapToBest),
        takeover_threshold: polityThreshold(P),
      },
    },
    global: {
      human_power_share: S.humanPower,
      top_share: S.topShare,
      enacted_rate: S.enacted,
      gap_to_best: S.gapToBest,
      advantage: S.advantage,
      takeover_threshold: S.threshold,
      regime: S.regime,
      // aliases so the political scene renderers run unchanged over this model
      human_share: S.humanPower,
      influence_gini: S.gini,
      sortition_fired: new Float64Array(T),
    },
    node: { influence: S.influence, position: S.position, top_listen: S.topTarget },
    static: { is_ai: isAi, signal: ideal },
    adj: { listening: Float64Array.from(D) },
    system: filterSystem(POLITY_SYSTEM, P, POLITY_SYS_TOGGLES),
  };
}

function runSelfTests() {
  const tests = [];
  const T = (name, fn) => tests.push({ name, fn });

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

  // --- economy ladder (WP1; capital_economy/tests) ---
  T('economy: no arrivals ⇒ stationary at the households-only steady state', () => {
    const r = runEconomy({ ...ECONOMY_DEFAULTS, firstArrival: 99999, T: 150 }, 5);
    const o = r.global.output;
    for (let t = 1; t < 150; t++) if (Math.abs(o[t] - o[0]) / o[0] > 1e-6) return false;
    return r.meta.scalars.human_sector_share > 0.999;
  });
  T('economy: money is conserved under every closure (WP1 Prop. 2/3)', () => {
    for (const P of [
      {},
      { efficiency: 3.0 },
      { efficiency: 3.0, recycle: 0.4 }, // the demand stall
      { efficiency: 3.0, aiTax: true }, // a mechanism in the slot
      { efficiency: 3.0, ownership: 0.5 }, // title split
      { efficiency: 3.0, ownership: 0.5, pubMirror: true }, // the mirror fund
    ])
      if (runEconomy({ ...ECONOMY_DEFAULTS, ...P, T: 200 }, 4).meta.scalars.money_drift > 1e-6)
        return false;
    return true;
  });
  T('economy: below e* capital dies, above e* it compounds (WP1 Prop. 1)', () => {
    const at = (e) => runEconomy({ ...ECONOMY_DEFAULTS, efficiency: e, T: 250 }, 3).meta.scalars;
    const lo = at(0.25), // e* ≈ 0.282 before any capital takes hold
      hi = at(3.0);
    return (
      lo.capital_late === 0 &&
      lo.human_sector_share > 0.999 &&
      hi.capital_late > 1 &&
      hi.human_sector_share < 0.2
    );
  });
  T('economy: a tax acts on the survival margin; an ownership transfer does not', () => {
    const at = (P) =>
      runEconomy({ ...ECONOMY_DEFAULTS, efficiency: 0.35, T: 250, ...P }, 3).meta.scalars;
    const plain = at({}),
      taxed = at({ aiTax: true, taxRate: 0.9 }),
      owned = at({ ownership: 0.5 });
    return (
      // the tax raises e* past e and automation goes extinct
      taxed.survival_threshold > plain.survival_threshold &&
      taxed.human_sector_share > 0.99 &&
      // diverting title leaves automation running; it only moves the holdings
      owned.human_sector_share < 0.95 &&
      owned.ai_wealth_share < plain.ai_wealth_share
    );
  });
  T('economy: capability growth carries e across the threshold', () => {
    const at = (P) =>
      runEconomy({ ...ECONOMY_DEFAULTS, efficiency: 0.2, T: 250, ...P }, 3).meta.scalars;
    const stat = at({}),
      grown = at({ growthRate: 0.02 });
    return (
      stat.capital_late === 0 &&
      grown.capability_end > grown.survival_threshold &&
      grown.capital_late > 1 &&
      grown.human_sector_share < 0.2
    );
  });

  // --- cultural ladder (value_contagion/tests) ---
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
  // --- ledger society ladder (ledger_society/tests/test_ladder.py) ---
  // The rungs that survive the port: conservation and sealing are exactness
  // contracts and hold here too; agnosticism and the flywheel are ordering
  // claims. The intervention and live-lever rungs need machinery the page does
  // not run, and are not restated here.
  const LEDGER_SEALED = { reachPerSpend: 0, attentionToBallots: 0, regimeRate: 0 };
  const ledgerHumanShare = (r, key) => {
    const N = r.meta.N,
      T = r.meta.T,
      H = Number(r.meta.params.nHumans);
    let s = 0;
    for (let t = T - 50; t < T; t++) for (let i = 0; i < H; i++) s += r.node[key][t * N + i];
    return s / 50;
  };

  T('ledger: both adjacency ledgers stay row-stochastic and power is a share', () => {
    const r = runCombined({ ...LEDGER_DEFAULTS, T: 120 }, 2);
    const N = r.meta.N;
    for (const key of ['listening', 'delegation'])
      for (let i = 0; i < N; i++) {
        let row = 0;
        for (let j = 0; j < N; j++) row += r.adj[key][i * N + j];
        if (Math.abs(row - 1) > 1e-9) return false;
      }
    for (let t = 0; t < r.meta.T; t++) {
      let p = 0;
      for (let i = 0; i < N; i++) p += r.node.influence[t * N + i];
      if (Math.abs(p - 1) > 1e-9) return false;
    }
    return true;
  });
  T('ledger: money is conserved — Δ(Σ wealth) = Σ income − Σ spends', () => {
    for (const P of [{}, { aiLobby: 0.3 }, { humanBroadcast: 0.4 }, { reachCut: 0.8 }])
      if (runCombined({ ...LEDGER_DEFAULTS, ...P, T: 200 }, 4).meta.scalars.money_drift > 1e-9)
        return false;
    return true;
  });
  T('ledger: top-target indexes a real neighbour, never the row itself', () => {
    const r = runCombined({ ...LEDGER_DEFAULTS, T: 60 }, 5);
    const N = r.meta.N;
    for (let t = 0; t < r.meta.T; t++)
      for (let i = 0; i < N; i++) {
        const j = r.node.top_listen[t * N + i];
        if (j === i || j < 0 || j >= N) return false;
      }
    return true;
  });
  T('ledger: sealed, an economy dial cannot move culture or politics', () => {
    const at = (gain) =>
      runCombined({ ...LEDGER_DEFAULTS, ...LEDGER_SEALED, prosperityGain: gain, T: 120 }, 6);
    const a = at(1.0),
      b = at(3.0);
    // culture and politics are bit-identical...
    for (const key of ['belief', 'listen_influence', 'influence'])
      if (!a.node[key].every((v, i) => v === b.node[key][i])) return false;
    // ...and the dial really was live on the economy side
    return a.meta.scalars.human_income_share !== b.meta.scalars.human_income_share;
  });
  T('ledger: an unenacted reach cap is bit-identical to no cap at all', () => {
    const a = runCombined({ ...LEDGER_DEFAULTS, T: 120 }, 7);
    const b = runCombined({ ...LEDGER_DEFAULTS, reachCut: 0, reachCutOnset: 40, T: 120 }, 7);
    return a.global.composite.every((v, i) => v === b.global.composite[i]);
  });
  T('ledger: a reach cap slows the capture of attention', () => {
    const base = runCombined({ ...LEDGER_DEFAULTS, T: 200 }, 8);
    const cut = runCombined({ ...LEDGER_DEFAULTS, reachCut: 0.9, reachCutOnset: 30, T: 200 }, 8);
    return cut.meta.scalars.human_attention_share > base.meta.scalars.human_attention_share + 0.02;
  });
  T('ledger: agnosticism — humans who buy reach gain attention', () => {
    // channel isolation: no AI arrivals, so humans are the only spenders. At
    // the defaults the same purchase is real but drowned by AI budgets an
    // order of magnitude larger, which IS the disempowerment dynamic.
    const base = runCombined({ ...LEDGER_DEFAULTS, firstArrival: 9999 }, 9);
    const spend = runCombined(
      { ...LEDGER_DEFAULTS, firstArrival: 9999, humanConsume: 0.4, humanBroadcast: 0.3 },
      9
    );
    return ledgerHumanShare(spend, 'listen_influence') > ledgerHumanShare(base, 'listen_influence');
  });
  T('ledger: agnosticism — an AI that never broadcasts captures less attention', () => {
    const base = runCombined(LEDGER_DEFAULTS, 10);
    const silent = runCombined({ ...LEDGER_DEFAULTS, aiBroadcast: 0, aiInvest: 0.6 }, 10);
    return (
      silent.meta.scalars.human_attention_share > base.meta.scalars.human_attention_share + 0.02
    );
  });
  T('ledger: agnosticism — citizens who fund the lobby defend enforcement', () => {
    const quiet = runCombined({ ...LEDGER_DEFAULTS, humanLobby: 0 }, 11);
    const paying = runCombined({ ...LEDGER_DEFAULTS, humanLobby: 0.15 }, 11);
    return paying.meta.scalars.enforcement_level > quiet.meta.scalars.enforcement_level + 0.1;
  });
  T('ledger: the flywheel — coupled composite falls below the sealed twin', () => {
    const r = runCombined(LEDGER_DEFAULTS, 12);
    return r.meta.scalars.transfer_gap > 0.01 && r.meta.scalars.composite < 1;
  });
  T('ledger: no arrivals ⇒ no disempowerment (the honest region)', () => {
    const r = runCombined({ ...LEDGER_DEFAULTS, firstArrival: 9999 }, 13);
    return r.meta.scalars.human_income_share > 0.9 && r.meta.scalars.human_power_share > 0.6;
  });
  T('ledger: sealed and unthreatened, the polity tracks its median voter', () => {
    const r = runCombined({ ...LEDGER_DEFAULTS, ...LEDGER_SEALED, firstArrival: 9999 }, 14);
    return r.meta.scalars.policy_median_gap < 0.15;
  });
  T('ledger: with lobbying but no upkeep, enforcement is a pure ratchet', () => {
    const kept = runCombined(LEDGER_DEFAULTS, 15).meta.scalars.enforcement_level;
    const ratchet = runCombined({ ...LEDGER_DEFAULTS, repairRate: 0 }, 15).meta.scalars
      .enforcement_level;
    return ratchet < 0.05 && kept > 0.5;
  });

  // --- derived system graphs (contract v1.1 consumer) --------------------
  T('system: fixtures are closed graphs (every edge endpoint is a node)', () =>
    [ECONOMY_SYSTEM, ECONOMY_SYSTEM, POLITICAL_SYSTEM].every((sys) => {
      const ids = new Set(sys.nodes.map((n) => n.id));
      return sys.edges.every((e) => ids.has(e.from) && ids.has(e.to));
    })
  );
  T('system: filter drops exactly the off mechanisms, stamps color when on', () => {
    const tagged = (id) => id.includes('ai_revenue_tax');
    const off = filterSystem(ECONOMY_SYSTEM, { aiTax: false }, ECONOMY_SYS_TOGGLES);
    const on = filterSystem(ECONOMY_SYSTEM, { aiTax: true }, ECONOMY_SYS_TOGGLES);
    const present = (sys) => sys.nodes.some((n) => n.kind === 'transform' && tagged(n.id));
    const okOff =
      !present(off) &&
      off.nodes.length < ECONOMY_SYSTEM.nodes.length &&
      off.edges.length < ECONOMY_SYSTEM.edges.length &&
      off.edges.every((e) => !tagged(e.from) && !tagged(e.to));
    const okOn =
      present(on) &&
      on.nodes.length === ECONOMY_SYSTEM.nodes.length &&
      on.nodes.filter((n) => n.color).length >= 1 &&
      ECONOMY_SYSTEM.nodes.every((n) => !n.color); // pure: fixture untouched
    return okOff && okOn;
  });
  T('system: roles classify static input + orphan; engines attach the DAG', () => {
    // signal is read by pool_belief and never written — a static input;
    // alloc_pref is the policy boundary, so it has no edges at all
    const roles = systemRoles(LEDGER_SYSTEM);
    const fr = roles.signal,
      lr = roles.alloc_pref;
    const traj = runCombined({ ...LEDGER_DEFAULTS, T: 30 }, 2);
    return (
      fr.readBy === 1 &&
      fr.writtenBy === 0 &&
      lr.readBy === 0 &&
      lr.writtenBy === 0 &&
      traj.system?.nodes.length === LEDGER_SYSTEM.nodes.length
    );
  });

  // --- polity ladder (WP3; delegative_polity/tests) ---
  T('polity: no advantage ⇒ the polity tracks its median voter', () => {
    const s = runPolity({ aiAdvantage: 1 }, 11).meta.scalars;
    return s.human_power_share > 0.8 && s.top_share < 0.15 && s.gap_to_best < 0.1;
  });
  T('polity: past a* = 1 + r/u the bloc takes the weighted median', () => {
    const lo = runPolity({ aiAdvantage: 1 }, 11).meta.scalars;
    const hi = runPolity({ aiAdvantage: 4 }, 11).meta.scalars;
    return (
      hi.top_share > 0.5 && // holding a majority of ballots IS being the median
      hi.human_power_share < lo.human_power_share - 0.3 &&
      hi.gap_to_best > lo.gap_to_best
    );
  });
  T('polity: churn raises the threshold and defends the median voter', () => {
    const tight = runPolity({ aiAdvantage: 4, churn: 0.02 }, 11).meta.scalars;
    const free = runPolity({ aiAdvantage: 4, churn: 0.12 }, 11).meta.scalars;
    return (
      free.takeover_threshold > tight.takeover_threshold &&
      free.human_power_share > tight.human_power_share
    );
  });
  T('polity: linear attachment (γ=1) does not concentrate organically', () => {
    const s = runPolity({ aiAdvantage: 1, gamma: 1.0 }, 11).meta.scalars;
    return s.top_share < 0.1;
  });
  T('polity: ballots are conserved — power always sums to one', () => {
    const r = runPolity({ aiAdvantage: 4 }, 11);
    const { T: steps, N } = r.meta;
    for (const t of [0, Math.floor(steps / 2), steps - 1]) {
      let sum = 0;
      for (let i = 0; i < N; i++) sum += r.node.influence[t * N + i];
      if (Math.abs(sum - 1) > 1e-9) return false;
    }
    return true;
  });
  T('polity: lock-in is off by default — the regime stays exactly 1', () => {
    const r = runPolity({ aiAdvantage: 8 }, 11);
    for (let t = 0; t < r.meta.T; t++) if (r.global.regime[t] !== 1) return false;
    return runPolity({ aiAdvantage: 8, entrenchmentGain: 0.8 }, 11).global.regime[r.meta.T - 1] < 1;
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
  LEDGER_DEFAULTS,
  LEDGER_INTRO_SEED,
  POLITY_DEFAULTS,
  POLITY_INTRO_SEED,
  ECONOMY_DEFAULTS,
  POLITICAL_DEFAULTS,
  runCombined,
  runPolity,
  runEconomy,
  runPolitical,
  runSelfTests,
};
