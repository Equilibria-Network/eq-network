import type { MetricDefinition, ScenarioId, Trajectory } from '../engine/types';

function gini(values: number[]): number {
  if (!values.length) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  if (mean <= 1e-12) return 0;
  let difference = 0;
  for (const left of values) {
    for (const right of values) difference += Math.abs(left - right);
  }
  return difference / (2 * values.length * values.length * mean);
}

function cumulativeNodes(series: Float64Array, tick: number, nodeCount: number): number[] {
  const totals = new Array<number>(nodeCount).fill(0);
  for (let time = 0; time <= tick; time += 1) {
    for (let node = 0; node < nodeCount; node += 1) {
      totals[node] += series[time * nodeCount + node] ?? 0;
    }
  }
  return totals;
}

function correlation(left: Float64Array, right: Float64Array, tick: number): number {
  const count = tick + 1;
  if (count < 2) return 0;
  let leftMean = 0;
  let rightMean = 0;
  for (let index = 0; index < count; index += 1) {
    leftMean += left[index];
    rightMean += right[index];
  }
  leftMean /= count;
  rightMean /= count;
  let numerator = 0;
  let leftVariance = 0;
  let rightVariance = 0;
  for (let index = 0; index < count; index += 1) {
    const leftDelta = left[index] - leftMean;
    const rightDelta = right[index] - rightMean;
    numerator += leftDelta * rightDelta;
    leftVariance += leftDelta ** 2;
    rightVariance += rightDelta ** 2;
  }
  const denominator = Math.sqrt(leftVariance * rightVariance);
  return denominator > 1e-9 ? numerator / denominator : 0;
}

export function metricValueAt(
  scenario: ScenarioId,
  trajectory: Trajectory,
  metric: MetricDefinition,
  requestedTick: number
): number {
  const tick = Math.max(0, Math.min(requestedTick, trajectory.meta.T - 1));
  const N = trajectory.meta.N;

  if (scenario === 'commons') {
    if (metric.key === 'stock_pct') {
      return trajectory.global.resource_level[tick] / Number(trajectory.meta.params.KCap);
    }
    if (metric.key === 'exercised_influence') {
      return trajectory.global.exercised_influence?.[tick] ?? trajectory.meta.scalars[metric.key];
    }
    if (metric.key === 'compliance_rate') return trajectory.global.compliance[tick];
    if (metric.key === 'harvest_gini') {
      return gini(cumulativeNodes(trajectory.node.harvest, tick, N));
    }
  }

  if (scenario === 'economy') {
    if (metric.key === 'labor_share') return trajectory.global.labor_share[tick];
    if (metric.key === 'influence_now') {
      return trajectory.global.influence_now?.[tick] ?? trajectory.meta.scalars[metric.key];
    }
    if (metric.key === 'human_income_share' || metric.key === 'income_gini') {
      const income = cumulativeNodes(trajectory.node.last_reward, tick, N);
      if (metric.key === 'income_gini') return gini(income);
      const humanCount = Number(trajectory.meta.params.nHouseholds);
      const human = income.slice(0, humanCount).reduce((sum, value) => sum + value, 0);
      const total = income.reduce((sum, value) => sum + value, 0);
      return total > 1e-12 ? human / total : 1;
    }
  }

  if (scenario === 'cultural') {
    if (metric.key === 'human_origin_share') return trajectory.global.human_share[tick];
    if (metric.key === 'regime_code') {
      const separated = trajectory.meta.scalars.fault_line >= 0.5 ? 2 : 0;
      const displaced = trajectory.global.human_share[tick] < 0.5 ? 1 : 0;
      return separated + displaced;
    }
    return trajectory.meta.scalars[metric.key];
  }

  if (scenario === 'political') {
    const seriesKey = metric.key === 'human_influence_share' ? 'human_share' : metric.key;
    return trajectory.global[seriesKey]?.[tick] ?? trajectory.meta.scalars[metric.key];
  }

  if (scenario === 'combined') {
    if (metric.key === 'human_income_share') return trajectory.global.income_share[tick];
    if (metric.key === 'transfer_gap' || metric.key === 'composite') {
      return trajectory.global[metric.key][tick];
    }
    if (metric.key === 'correlated_decline') {
      const income = trajectory.global.income_share;
      const culture = trajectory.global.culture_share;
      const influence = trajectory.global.influence_share;
      return (
        (correlation(income, culture, tick) +
          correlation(culture, influence, tick) +
          correlation(income, influence, tick)) /
        3
      );
    }
  }

  return trajectory.meta.scalars[metric.key];
}
