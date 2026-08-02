import type { MetricDefinition, ScenarioId, Trajectory } from '../engine/types';

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

  if (scenario === 'economy') {
    // every WP1 readout is already a per-tick series on the trajectory
    const seriesKey = metric.key === 'capability_end' ? 'capability' : metric.key;
    return trajectory.global[seriesKey]?.[tick] ?? trajectory.meta.scalars[metric.key];
  }

  if (scenario === 'culture') {
    const seriesKey = metric.key === 'human_influence_share' ? 'human_share' : metric.key;
    return trajectory.global[seriesKey]?.[tick] ?? trajectory.meta.scalars[metric.key];
  }

  if (scenario === 'politics') {
    // WP3's four readouts are all per-tick series on the trajectory. Without
    // this branch every card fell through to meta.scalars — the late-window
    // average of the whole run — and sat frozen while the playhead moved.
    if (metric.key === 'human_power_share') return trajectory.global.human_power_share[tick];
    return trajectory.global[metric.key]?.[tick] ?? trajectory.meta.scalars[metric.key];
  }

  if (scenario === 'combined') {
    // every ledger readout is already a per-tick series on the trajectory —
    // the engine's default_trace carries the four human shares itself, so the
    // page never has to work out which nodes are the humans
    if (metric.key === 'correlated_decline') {
      const income = trajectory.global.human_income_share;
      const attention = trajectory.global.human_attention_share;
      const power = trajectory.global.human_power_share;
      return (
        (correlation(income, attention, tick) +
          correlation(attention, power, tick) +
          correlation(income, power, tick)) /
        3
      );
    }
    if (metric.key === 'enforcement_level') return trajectory.global.enforcement[tick];
    return trajectory.global[metric.key]?.[tick] ?? trajectory.meta.scalars[metric.key];
  }

  return trajectory.meta.scalars[metric.key];
}
