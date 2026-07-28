// apps/site/scripts/gen-lorenz-mark.mjs
// Symmetric Equilibria mark: a butterfly of two mirror-identical leaf wings that
// meet ONLY at the base point (no overlap / no cut through the middle). Each wing
// is a Bezier leaf kept entirely in its own half-plane; the left wing is the right
// wing mirrored across x=0. Keeps the endorsed "thick outer contour + thin nested
// inner" treatment. Artistic liberty over the raw Lorenz attractor (a logo needs a
// clean, closed, symmetric silhouette).
//
// Usage: node apps/site/scripts/gen-lorenz-mark.mjs
import { writeFileSync, mkdirSync } from 'node:fs';

// Right wing as one closed path: tip at base (0,0), up the outer edge to the top,
// back down the inner edge to the tip. All control points x >= 0 so the wing never
// crosses the centre line. Coords are y-up; flipped for SVG below.
// [P0, c1, c2, P1(top), c3, c4]  -> M P0  C c1 c2 P1  C c3 c4 P0  Z
const WING = [
  [0.0, 0.0], // P0 tip (base, at centre)
  [1.35, 0.4], // c1  outer edge bows out...
  [1.35, 1.75], // c2  ...and up
  [0.55, 2.15], // P1  top of the wing (up, near centre so wings read as a body)
  [0.35, 1.6], // c3  inner edge stays close to centre (slim gap, no cut)
  [0.08, 0.7], // c4  ...into the tip
];

const centroid = (() => {
  const xs = WING.map((p) => p[0]),
    ys = WING.map((p) => p[1]);
  return [xs.reduce((a, b) => a + b, 0) / WING.length, ys.reduce((a, b) => a + b, 0) / WING.length];
})();

const scaleToward = (pts, f, c = centroid) =>
  pts.map(([x, y]) => [c[0] + (x - c[0]) * f, c[1] + (y - c[1]) * f]);
const mirror = (pts) => pts.map(([x, y]) => [-x, y]);
const jitter = (pts, amp, seedRef) =>
  pts.map(([x, y]) => {
    seedRef.s = (seedRef.s * 1103515245 + 12345) & 0x7fffffff;
    const r = (seedRef.s / 0x7fffffff - 0.5) * amp;
    return [x + r, y + r * 0.7];
  });

// ---- shared viewBox over both outer wings ----
const both = [...WING, ...mirror(WING)];
const xs = both.map((p) => p[0]),
  ys = both.map((p) => p[1]);
const minX = Math.min(...xs),
  maxX = Math.max(...xs),
  minY = Math.min(...ys),
  maxY = Math.max(...ys);
const W = 220,
  H = 210,
  PAD = 22;
const s = Math.min((W - 2 * PAD) / (maxX - minX), (H - 2 * PAD) / (maxY - minY));
const ox = (W - s * (maxX - minX)) / 2,
  oy = (H - s * (maxY - minY)) / 2;
const map = ([x, y]) => [
  +(ox + (x - minX) * s).toFixed(2),
  +(H - (oy + (y - minY) * s)).toFixed(2),
];

function leafPath(pts) {
  const p = pts.map(map);
  return `M ${p[0][0]} ${p[0][1]} C ${p[1][0]} ${p[1][1]}, ${p[2][0]} ${p[2][1]}, ${p[3][0]} ${p[3][1]} C ${p[4][0]} ${p[4][1]}, ${p[5][0]} ${p[5][1]}, ${p[0][0]} ${p[0][1]} Z`;
}

function svg(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Equilibria mark" fill="none" stroke-linecap="round" stroke-linejoin="round">
    ${inner}
</svg>
`;
}

function wingPair(pts, stroke, width) {
  return `<path d="${leafPath(pts)}" stroke="${stroke}" stroke-width="${width}"/><path d="${leafPath(mirror(pts))}" stroke="${stroke}" stroke-width="${width}"/>`;
}

function marks(stroke) {
  const outer = wingPair(WING, stroke, 5);
  const nested = (scales, w = 1.4) =>
    scales.map((f) => wingPair(scaleToward(WING, f), stroke, w)).join('');
  const seed = { s: 20260728 };
  const noisy = [0.72, 0.48, 0.26]
    .map((f) => wingPair(jitter(scaleToward(WING, f), 0.14, seed), stroke, 1.2))
    .join('');
  return {
    concentric: outer + nested([0.72, 0.48, 0.26]),
    noise: outer + noisy,
    outline: wingPair(WING, stroke, 6),
    duo: wingPair(WING, stroke, 5.5) + nested([0.5], 2),
  };
}

const outDir = 'public/img/brand/marks';
mkdirSync(outDir, { recursive: true });
const navy = '#003B7E',
  accent = '#4AB3F4';
const m = marks(navy);
for (const [k, v] of Object.entries(m)) writeFileSync(`${outDir}/sym-${k}.svg`, svg(v));
writeFileSync(`${outDir}/sym-concentric-white.svg`, svg(marks('#ffffff').concentric));
writeFileSync(`${outDir}/sym-concentric-accent.svg`, svg(marks(accent).concentric));
// keep a flat/infinity file name present but pointing at the butterfly (owner rejected flat)
writeFileSync(`${outDir}/sym-infinity.svg`, svg(m.concentric));
console.log('wrote symmetric butterfly marks to', outDir);
