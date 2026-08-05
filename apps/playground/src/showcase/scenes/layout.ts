/** Pure, DOM-free geometry for the network scenes: deterministic scatter
    positions and edge derivation from the engine's per-tick index series.
    Kept import-free so node --test can exercise it directly. */

export type Point = [number, number];

export interface Region {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** Same integer-hash generator as rendering/sketch.ts makeRng — duplicated
    (10 lines) so this module stays dependency-free for the test runner. */
export function seededRng(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** Mitchell's best-candidate sampling: each node takes the candidate that
    maximizes its distance to everything already placed. Deterministic for a
    given (seed, count, region, existing) — positions must never jump between
    runs or dial changes. */
export function scatter(
  seed: number,
  count: number,
  region: Region,
  existing: Point[] = [],
  candidates = 14
): Point[] {
  const rng = seededRng(seed);
  const placed: Point[] = [...existing];
  const out: Point[] = [];
  for (let index = 0; index < count; index += 1) {
    let best: Point = [region.x0, region.y0];
    let bestScore = -1;
    for (let candidate = 0; candidate < candidates; candidate += 1) {
      const x = region.x0 + rng() * (region.x1 - region.x0);
      const y = region.y0 + rng() * (region.y1 - region.y0);
      let nearest = Number.POSITIVE_INFINITY;
      for (const [px, py] of placed) {
        nearest = Math.min(nearest, Math.hypot(x - px, y - py));
      }
      if (nearest > bestScore) {
        bestScore = nearest;
        best = [x, y];
      }
    }
    placed.push(best);
    out.push(best);
  }
  return out;
}

/** The k most frequent targets of one node across the whole run, from an
    index series laid out [t*N + i]. Skips -1 (no target) and self. */
export function topTargets(
  series: ArrayLike<number>,
  T: number,
  N: number,
  node: number,
  k: number
): number[] {
  const counts = new Map<number, number>();
  for (let t = 0; t < T; t += 1) {
    const target = series[t * N + node];
    if (target < 0 || target === node) continue;
    counts.set(target, (counts.get(target) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .slice(0, k)
    .map(([target]) => target);
}

/** Persistent edge set: for every node, its k most frequent targets across
    the run, over one or more index series, deduplicated as undirected pairs.
    Honest by construction — built only from real per-tick data; the caption
    should read "most frequent links this run", not "the weighted matrix". */
export function deriveEdgeSet(
  seriesList: ArrayLike<number>[],
  T: number,
  N: number,
  k = 3
): Array<[number, number]> {
  const seen = new Set<string>();
  const edges: Array<[number, number]> = [];
  for (let node = 0; node < N; node += 1) {
    for (const series of seriesList) {
      for (const target of topTargets(series, T, N, node, k)) {
        const key = node < target ? `${node}-${target}` : `${target}-${node}`;
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push([node, target]);
      }
    }
  }
  return edges;
}
