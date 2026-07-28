// apps/site/scripts/gen-lorenz-mark.mjs
// Symmetric Equilibria mark: two mirror-identical wings (a cardioid pair) that sit
// halfway between an infinity symbol and a butterfly. Artistic liberty over the raw
// (asymmetric, open) Lorenz attractor: both wings share one shape, cusps meeting at
// centre, tiltable from horizontal (infinity) to raised (butterfly). Keeps the
// endorsed "thick outer contour + thin inner lines" idea, in three inner topologies:
//   concentric  - nested scaled contours (clean, blueprint)
//   noise       - jittered contours (organic / hand-drawn)
//   spiral      - one continuous inner spiral per wing (different topology)
//
// Usage: node apps/site/scripts/gen-lorenz-mark.mjs [tiltDeg]
import { writeFileSync, mkdirSync } from 'node:fs';

const TAU = Math.PI * 2;
const TILT = Number(process.argv[2] ?? 52); // 0 = infinity (flat), higher = butterfly (raised)

// deterministic PRNG so the "noise" variant is stable across runs
let _s = 1337;
const rand = () => {
  _s = (_s * 1103515245 + 12345) & 0x7fffffff;
  return _s / 0x7fffffff;
};

const rot = ([x, y], t) => [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t)];

// one wing: a cardioid r = a(1+cos θ), cusp at origin, rotated so the body points
// up-and-out. jitter adds organic radial noise (for the "noise" variant).
function wing(a, tiltDeg, side, { jitter = 0, steps = 240 } = {}) {
  const t = (tiltDeg * Math.PI) / 180;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const th = (i / steps) * TAU;
    let r = a * (1 + Math.cos(th));
    if (jitter) r *= 1 + (rand() - 0.5) * jitter;
    let p = rot([r * Math.cos(th), r * Math.sin(th)], t);
    if (side === 'L') p = [-p[0], p[1]]; // mirror across the vertical centre axis
    pts.push(p);
  }
  return pts;
}

// inward spiral wing (topology variant): θ sweeps several turns while a shrinks
function spiralWing(a, tiltDeg, side, turns = 2.6, steps = 520) {
  const t = (tiltDeg * Math.PI) / 180;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const k = i / steps;
    const th = k * TAU * turns;
    const aa = a * (1 - 0.82 * k);
    let p = rot([aa * (1 + Math.cos(th)) * Math.cos(th), aa * (1 + Math.cos(th)) * Math.sin(th)], t);
    if (side === 'L') p = [-p[0], p[1]];
    pts.push(p);
  }
  return pts;
}

// ---- shared normalisation across every wing we might draw, for one viewBox ----
const A = 30;
const probe = [
  ...wing(A, TILT, 'R'),
  ...wing(A, TILT, 'L'),
  ...wing(A, TILT + 3, 'R'),
];
const xs = probe.map((p) => p[0]),
  ys = probe.map((p) => p[1]);
const minX = Math.min(...xs),
  maxX = Math.max(...xs),
  minY = Math.min(...ys),
  maxY = Math.max(...ys);
const W = 220,
  H = 200,
  PAD = 20;
const s = Math.min((W - 2 * PAD) / (maxX - minX), (H - 2 * PAD) / (maxY - minY));
const ox = (W - s * (maxX - minX)) / 2,
  oy = (H - s * (maxY - minY)) / 2;
// flip y so the cusps sit at the bottom (butterfly opens upward)
const map = ([x, y]) => [
  +(ox + (x - minX) * s).toFixed(2),
  +(H - (oy + (y - minY) * s)).toFixed(2),
];

function path(ptsData, close = true) {
  const p = ptsData.map(map);
  const n = p.length;
  let d = `M ${p[0][0]} ${p[0][1]}`;
  const N = close ? n : n - 1;
  for (let i = 0; i < N; i++) {
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
  return close ? d + ' Z' : d;
}

function svg(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Equilibria mark" fill="none" stroke-linecap="round" stroke-linejoin="round">
    ${inner}
</svg>
`;
}

function marks(stroke, tilt = TILT) {
  const outer = `<path d="${path(wing(A, tilt, 'R'))}" stroke="${stroke}" stroke-width="5"/><path d="${path(wing(A, tilt, 'L'))}" stroke="${stroke}" stroke-width="5"/>`;
  const nested = (scales) =>
    scales
      .map(
        (f) =>
          `<path d="${path(wing(A * f, tilt, 'R'))}" stroke="${stroke}" stroke-width="1.4"/><path d="${path(wing(A * f, tilt, 'L'))}" stroke="${stroke}" stroke-width="1.4"/>`
      )
      .join('');
  return {
    // 1) concentric nested contours
    concentric: outer + nested([0.72, 0.48, 0.26]),
    // 2) noisy / hand-drawn inner contours
    noise:
      outer +
      [0.72, 0.48, 0.26]
        .map(
          (f) =>
            `<path d="${path(wing(A * f, tilt, 'R', { jitter: 0.28 }))}" stroke="${stroke}" stroke-width="1.2"/><path d="${path(wing(A * f, tilt, 'L', { jitter: 0.28 }))}" stroke="${stroke}" stroke-width="1.2"/>`
        )
        .join(''),
    // 3) different topology: continuous inner spiral
    spiral:
      outer +
      `<path d="${path(spiralWing(A * 0.9, tilt, 'R'), false)}" stroke="${stroke}" stroke-width="1.2"/><path d="${path(spiralWing(A * 0.9, tilt, 'L'), false)}" stroke="${stroke}" stroke-width="1.2"/>`,
    // bare outline
    outline: `<path d="${path(wing(A, tilt, 'R'))}" stroke="${stroke}" stroke-width="6"/><path d="${path(wing(A, tilt, 'L'))}" stroke="${stroke}" stroke-width="6"/>`,
  };
}

const outDir = 'public/img/brand/marks';
mkdirSync(outDir, { recursive: true });
const navy = '#003B7E',
  accent = '#4AB3F4';
const m = marks(navy);
for (const [k, v] of Object.entries(m)) writeFileSync(`${outDir}/sym-${k}.svg`, svg(v));
// a flatter, more-infinity tilt for comparison
writeFileSync(`${outDir}/sym-infinity.svg`, svg(marks(navy, 22).concentric));
// reversed + accent of the primary (concentric)
writeFileSync(`${outDir}/sym-concentric-white.svg`, svg(marks('#ffffff').concentric));
writeFileSync(`${outDir}/sym-concentric-accent.svg`, svg(marks(accent).concentric));
console.log(`wrote symmetric marks (tilt ${TILT}) to ${outDir}`);
