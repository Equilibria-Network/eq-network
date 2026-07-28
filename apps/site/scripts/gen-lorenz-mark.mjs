// apps/site/scripts/gen-lorenz-mark.mjs
// Equilibria mark = the Lorenz attractor as two tilted, nested elliptical lobes
// (matching the owner reference public/download.png): each lobe is a set of
// concentric tilted ellipses around a focus; the lobes splay open at the top and
// cross near the bottom centre, like the real attractor. Symmetric: the left lobe
// is the right lobe mirrored across x=0. Treatment: thick outer contour + thin
// nested inner contours ("01 / concentric").
//
// Usage: node apps/site/scripts/gen-lorenz-mark.mjs
import { writeFileSync, mkdirSync } from 'node:fs';

const TAU = Math.PI * 2;
const deg = (d) => (d * Math.PI) / 180;

// Right lobe: an ellipse focus/centre up and to the right of the crossing point,
// long axis tilted so the lobe leans up-and-out. Tuned to the reference.
const LOBE = { cx: 15, cy: 19, a: 31, b: 13, tilt: 57 }; // a=long semi-axis, b=short
const SCALES = [1, 0.76, 0.55, 0.37, 0.21]; // outer + 4 nested inner contours

function ellipse({ cx, cy, a, b, tilt }, f, steps = 160) {
  const th = deg(tilt);
  const pts = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * TAU;
    const x0 = a * f * Math.cos(t),
      y0 = b * f * Math.sin(t);
    pts.push([
      cx + x0 * Math.cos(th) - y0 * Math.sin(th),
      cy + x0 * Math.sin(th) + y0 * Math.cos(th),
    ]);
  }
  return pts;
}
const mirror = (pts) => pts.map(([x, y]) => [-x, y]);
const jitterRing = (pts, amp, seedRef) =>
  pts.map(([x, y]) => {
    seedRef.s = (seedRef.s * 1103515245 + 12345) & 0x7fffffff;
    const r = (seedRef.s / 0x7fffffff - 0.5) * amp;
    return [x + r, y + r];
  });

// ---- shared viewBox over both outer lobes ----
const outerR = ellipse(LOBE, 1);
const both = [...outerR, ...mirror(outerR)];
const xs = both.map((p) => p[0]),
  ys = both.map((p) => p[1]);
const minX = Math.min(...xs),
  maxX = Math.max(...xs),
  minY = Math.min(...ys),
  maxY = Math.max(...ys);
const W = 230,
  H = 210,
  PAD = 20;
const s = Math.min((W - 2 * PAD) / (maxX - minX), (H - 2 * PAD) / (maxY - minY));
const ox = (W - s * (maxX - minX)) / 2,
  oy = (H - s * (maxY - minY)) / 2;
const map = ([x, y]) => [
  +(ox + (x - minX) * s).toFixed(2),
  +(H - (oy + (y - minY) * s)).toFixed(2),
];

// closed Catmull-Rom -> cubic bezier (smooth ring)
function ringPath(ptsData) {
  const p = ptsData.map(map);
  const n = p.length;
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n],
      p1 = p[i],
      p2 = p[(i + 1) % n],
      p3 = p[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6,
      c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6,
      c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0]} ${p2[1]}`;
  }
  return d + ' Z';
}

function svg(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Equilibria mark" fill="none" stroke-linecap="round" stroke-linejoin="round">
    ${inner}
</svg>
`;
}

// draw one lobe (right or mirrored) as nested rings; both lobes together = mark
function lobeRings(scales, stroke, widths, { jitter = 0 } = {}) {
  const seed = { s: 20260728 };
  return scales
    .map((f, i) => {
      let r = ellipse(LOBE, f);
      if (jitter) r = jitterRing(r, jitter, seed);
      const w = widths(i, f);
      let l = mirror(ellipse(LOBE, f));
      if (jitter) l = jitterRing(l, jitter, seed);
      return `<path d="${ringPath(r)}" stroke="${stroke}" stroke-width="${w}"/><path d="${ringPath(l)}" stroke="${stroke}" stroke-width="${w}"/>`;
    })
    .join('');
}

function marks(stroke) {
  const wThick = (i) => (i === 0 ? 5 : 1.3);
  return {
    concentric: lobeRings(SCALES, stroke, wThick),
    duo: lobeRings([1, 0.6], stroke, (i) => (i === 0 ? 5.5 : 2)),
    outline: lobeRings([1], stroke, () => 6),
    noise: lobeRings(SCALES, stroke, (i) => (i === 0 ? 5 : 1.2), { jitter: 1.4 }),
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
console.log('wrote Lorenz-lobe (tilted nested ellipse) marks to', outDir);
