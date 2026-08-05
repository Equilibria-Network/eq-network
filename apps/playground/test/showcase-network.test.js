import assert from 'node:assert/strict';
import test from 'node:test';

import { deriveEdgeSet, scatter, topTargets } from '../src/showcase/scenes/layout.ts';

test('scatter is deterministic and stays inside its region', () => {
  const region = { x0: 70, y0: 70, x1: 560, y1: 330 };
  const first = scatter(101, 20, region);
  const second = scatter(101, 20, region);
  assert.deepEqual(first, second, 'same seed must give identical positions');

  for (const [x, y] of first) {
    assert.ok(x >= region.x0 && x <= region.x1, `x ${x} inside region`);
    assert.ok(y >= region.y0 && y <= region.y1, `y ${y} inside region`);
  }

  let minimum = Number.POSITIVE_INFINITY;
  for (let a = 0; a < first.length; a += 1) {
    for (let b = a + 1; b < first.length; b += 1) {
      minimum = Math.min(minimum, Math.hypot(first[a][0] - first[b][0], first[a][1] - first[b][1]));
    }
  }
  assert.ok(minimum > 18, `best-candidate spacing collapsed: min distance ${minimum}`);
});

test('scatter respects existing points and separate regions do not overlap', () => {
  const humanRegion = { x0: 70, y0: 70, x1: 560, y1: 330 };
  const aiRegion = { x0: 620, y0: 70, x1: 830, y1: 300 };
  const humans = scatter(101, 20, humanRegion);
  const ai = scatter(102, 6, aiRegion, humans);
  for (const [x] of ai) {
    assert.ok(x >= aiRegion.x0, 'AI nodes stay in the AI region');
  }
});

test('topTargets counts across the run and never returns -1 or self', () => {
  const N = 4;
  const T = 5;
  // Node 0 targets: 3, 3, 1, -1, 0(self) → [3, 1]
  const series = new Float64Array(T * N).fill(-1);
  series[0 * N + 0] = 3;
  series[1 * N + 0] = 3;
  series[2 * N + 0] = 1;
  series[3 * N + 0] = -1;
  series[4 * N + 0] = 0;
  assert.deepEqual(topTargets(series, T, N, 0, 3), [3, 1]);
  assert.deepEqual(topTargets(series, T, N, 0, 1), [3]);
  assert.deepEqual(topTargets(series, T, N, 1, 3), [], 'no targets, no edges');
});

test('deriveEdgeSet unions series and deduplicates undirected pairs', () => {
  const N = 3;
  const T = 2;
  // listen: 0→1 both ticks; delegate: 1→0 both ticks — one undirected edge.
  const listen = new Float64Array([1, -1, -1, 1, -1, -1]);
  const delegate = new Float64Array([-1, 0, -1, -1, 0, -1]);
  const edges = deriveEdgeSet([listen, delegate], T, N, 3);
  assert.equal(edges.length, 1);
  assert.deepEqual(edges[0], [0, 1]);
});
