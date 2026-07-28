// apps/site/scripts/gen-lorenz-mark.mjs
// Regenerate the Equilibria mark from the Lorenz system as a clean, SVG-friendly
// single <path> (the hero's cornerstone curve), instead of thousands of thin
// segments. Classic params (sigma 10, rho 28, beta 8/3). Projection: (x, z).
//
// Usage: node apps/site/scripts/gen-lorenz-mark.mjs
import { writeFileSync, mkdirSync } from 'node:fs';

const sigma = 10;
const rho = 28;
const beta = 8 / 3;
const dt = 0.005;
// Defaults tuned for a clean, minimal butterfly (~2-3 orbits per lobe): the mark
// reads as the Lorenz attractor without the "too many thin lines" scribble.
const STEPS = Number(process.argv[2] ?? 900);
const WARMUP = Number(process.argv[3] ?? 150); // discard transient so the curve starts on the attractor
const SAMPLE = Number(process.argv[4] ?? 3); // keep every Nth point -> fewer path nodes
const SEED_X = Number(process.argv[5] ?? -8);

function trajectory(seed) {
  let { x, y, z } = seed;
  const pts = [];
  for (let i = 0; i < STEPS; i++) {
    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = x * y - beta * z;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
    if (i > WARMUP && i % SAMPLE === 0) pts.push([x, z]);
  }
  return pts;
}

const pts = trajectory({ x: SEED_X, y: 8, z: 27 });

// bounds + normalise into a padded viewBox
const xs = pts.map((p) => p[0]);
const zs = pts.map((p) => p[1]);
const minX = Math.min(...xs),
  maxX = Math.max(...xs);
const minZ = Math.min(...zs),
  maxZ = Math.max(...zs);
const W = 200,
  H = 200,
  PAD = 18;
const sx = (W - 2 * PAD) / (maxX - minX);
const sz = (H - 2 * PAD) / (maxZ - minZ);
const s = Math.min(sx, sz);
const ox = (W - s * (maxX - minX)) / 2;
const oz = (H - s * (maxZ - minZ)) / 2;
const map = ([x, z]) => [
  +(ox + (x - minX) * s).toFixed(2),
  // flip z (up) to svg y (down)
  +(H - (oz + (z - minZ) * s)).toFixed(2),
];

// build a smooth path (Catmull-Rom -> cubic bezier)
const P = pts.map(map);
function smoothPath(p) {
  if (p.length < 2) return '';
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}
const d = smoothPath(P);

const navy = '#003B7E';
const accent = '#4AB3F4';

function svg({ stroke, width, fileNote }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Equilibria mark">
  <!-- ${fileNote} -->
  <path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
}

const outDir = 'public/img/brand/marks';
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/lorenz-thin.svg`, svg({ stroke: navy, width: 2, fileNote: 'thin' }));
writeFileSync(`${outDir}/lorenz-bold.svg`, svg({ stroke: navy, width: 4.5, fileNote: 'bold' }));
writeFileSync(
  `${outDir}/lorenz-accent.svg`,
  svg({ stroke: accent, width: 3.5, fileNote: 'accent' })
);
writeFileSync(
  `${outDir}/lorenz-white.svg`,
  svg({ stroke: '#ffffff', width: 3.5, fileNote: 'white (dark panels)' })
);

const bytes = svg({ stroke: navy, width: 4.5, fileNote: 'bold' }).length;
console.log(`points: ${P.length}, path bytes ~${bytes}, wrote 4 marks to ${outDir}`);
