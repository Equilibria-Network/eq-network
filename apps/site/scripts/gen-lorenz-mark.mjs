// apps/site/scripts/gen-lorenz-mark.mjs
// Generate CLOSED, logo-friendly Lorenz marks. The raw attractor never closes
// (that's the point of chaos) but a logo needs a clean silhouette, so we take
// artistic liberty: compute the outer envelope of each lobe (max radius per
// angular bin around the lobe's fixed point), close it, and nest scaled-down
// copies inside for the "fill" — a thick outer contour + thin inner rings, which
// also reads like blueprint contour lines.
//
// Usage: node apps/site/scripts/gen-lorenz-mark.mjs
import { writeFileSync, mkdirSync } from 'node:fs';

const sigma = 10,
  rho = 28,
  beta = 8 / 3,
  dt = 0.005;
const STEPS = 9000,
  WARMUP = 400;

// integrate, project to (x, z)
function trajectory(seed) {
  let { x, y, z } = seed;
  const pts = [];
  for (let i = 0; i < STEPS; i++) {
    const dx = sigma * (y - x),
      dy = x * (rho - z) - y,
      dz = x * y - beta * z;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
    if (i > WARMUP) pts.push([x, z]);
  }
  return pts;
}

// fixed points (lobe centres) projected to (x, z)
const c = Math.sqrt(beta * (rho - 1)); // ~8.485
const centres = { L: [-c, rho - 1], R: [c, rho - 1] };

// outer envelope of a lobe: max radius per angular bin, reconstructed as a smooth
// closed ring around the lobe centre
function envelope(pts, centre, bins = 140) {
  const [cx, cz] = centre;
  const maxR = new Array(bins).fill(-1);
  for (const [x, z] of pts) {
    const a = Math.atan2(z - cz, x - cx);
    const idx = Math.floor(((a + Math.PI) / (2 * Math.PI)) * bins) % bins;
    const r = Math.hypot(x - cx, z - cz);
    if (r > maxR[idx]) maxR[idx] = r;
  }
  // fill empty bins by circular interpolation
  for (let i = 0; i < bins; i++) {
    if (maxR[i] < 0) {
      let lo = i,
        hi = i;
      while (maxR[(lo + bins) % bins] < 0) lo--;
      while (maxR[hi % bins] < 0) hi++;
      const a = maxR[(lo + bins) % bins],
        b = maxR[hi % bins];
      maxR[i] = a + ((b - a) * (i - lo)) / (hi - lo);
    }
  }
  // several smoothing passes so the envelope reads as a clean contour, not jagged
  let sm = maxR.slice();
  for (let pass = 0; pass < 4; pass++) {
    sm = sm.map(
      (_, i) =>
        (sm[(i - 2 + bins) % bins] +
          2 * sm[(i - 1 + bins) % bins] +
          3 * sm[i] +
          2 * sm[(i + 1) % bins] +
          sm[(i + 2) % bins]) /
        9
    );
  }
  const ring = [];
  for (let i = 0; i < bins; i++) {
    const a = -Math.PI + (i / bins) * 2 * Math.PI;
    ring.push([cx + sm[i] * Math.cos(a), cz + sm[i] * Math.sin(a)]);
  }
  return { ring, centre };
}

function scaleRing({ ring, centre }, s) {
  const [cx, cz] = centre;
  return ring.map(([x, z]) => [cx + (x - cx) * s, cz + (z - cz) * s]);
}

const traj = trajectory({ x: -8, y: 8, z: 27 });
const envL = envelope(
  traj.filter((p) => p[0] < 0),
  centres.L
);
const envR = envelope(
  traj.filter((p) => p[0] >= 0),
  centres.R
);

// global bounds across everything we might draw, for a shared viewBox
const all = [...envL.ring, ...envR.ring];
const xs = all.map((p) => p[0]),
  zs = all.map((p) => p[1]);
const minX = Math.min(...xs),
  maxX = Math.max(...xs),
  minZ = Math.min(...zs),
  maxZ = Math.max(...zs);
const W = 220,
  H = 220,
  PAD = 22;
const s = Math.min((W - 2 * PAD) / (maxX - minX), (H - 2 * PAD) / (maxZ - minZ));
const ox = (W - s * (maxX - minX)) / 2,
  oz = (H - s * (maxZ - minZ)) / 2;
const map = ([x, z]) => [
  +(ox + (x - minX) * s).toFixed(2),
  +(H - (oz + (z - minZ) * s)).toFixed(2),
];

// closed Catmull-Rom -> cubic bezier
function closedPath(ptsData) {
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

const navy = '#003B7E',
  accent = '#4AB3F4';
const outerL = closedPath(envL.ring),
  outerR = closedPath(envR.ring);

function marks(stroke) {
  const inner = (env, s2) => closedPath(scaleRing(env, s2));
  return {
    // V1: thick outer + 3 nested thin inner rings (contour fill)
    contour: `<path d="${outerL}" fill="none" stroke="${stroke}" stroke-width="5"/>
    <path d="${outerR}" fill="none" stroke="${stroke}" stroke-width="5"/>
    ${[0.72, 0.48, 0.26].map((f) => `<path d="${inner(envL, f)}" fill="none" stroke="${stroke}" stroke-width="1.4"/><path d="${inner(envR, f)}" fill="none" stroke="${stroke}" stroke-width="1.4"/>`).join('\n    ')}`,
    // V2: thick outer + 2 inner, a bit heavier inner
    duo: `<path d="${outerL}" fill="none" stroke="${stroke}" stroke-width="5.5"/>
    <path d="${outerR}" fill="none" stroke="${stroke}" stroke-width="5.5"/>
    <path d="${inner(envL, 0.5)}" fill="none" stroke="${stroke}" stroke-width="2"/><path d="${inner(envR, 0.5)}" fill="none" stroke="${stroke}" stroke-width="2"/>`,
    // V3: filled lobes (tint) + thick outer + thin inner
    fill: `<path d="${outerL}" fill="${stroke}" fill-opacity="0.08" stroke="${stroke}" stroke-width="5"/>
    <path d="${outerR}" fill="${stroke}" fill-opacity="0.08" stroke="${stroke}" stroke-width="5"/>
    ${[0.66, 0.38].map((f) => `<path d="${inner(envL, f)}" fill="none" stroke="${stroke}" stroke-width="1.4"/><path d="${inner(envR, f)}" fill="none" stroke="${stroke}" stroke-width="1.4"/>`).join('\n    ')}`,
    // V4: just the two thick closed outer loops, minimal
    outline: `<path d="${outerL}" fill="none" stroke="${stroke}" stroke-width="6"/>
    <path d="${outerR}" fill="none" stroke="${stroke}" stroke-width="6"/>`,
  };
}

function svg(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Equilibria mark" stroke-linecap="round" stroke-linejoin="round">
    ${inner}
</svg>
`;
}

const outDir = 'public/img/brand/marks';
mkdirSync(outDir, { recursive: true });
const navyMarks = marks(navy);
for (const [k, v] of Object.entries(navyMarks)) writeFileSync(`${outDir}/v-${k}.svg`, svg(v));
writeFileSync(`${outDir}/v-contour-white.svg`, svg(marks('#ffffff').contour));
writeFileSync(`${outDir}/v-contour-accent.svg`, svg(marks(accent).contour));
console.log(`wrote ${Object.keys(navyMarks).length + 2} closed marks to ${outDir}`);
