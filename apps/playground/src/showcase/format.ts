import type { MetricDefinition } from '../engine/types';

// Duplicated from App.tsx, which keeps its formatter private; shared by the
// showcase's stages so it exists once on this side.
export function formatMetric(value: number, metric: MetricDefinition): string {
  if (!Number.isFinite(value)) return '—';
  if (metric.format === 'percent') return `${Math.round(value * 100)}%`;
  if (metric.format === 'integer') return Math.round(value).toLocaleString();
  if (metric.format === 'points') return `${(value * 100).toFixed(1)} pt`;
  return value.toFixed(3);
}
