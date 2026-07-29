// Generate the Equilibria Lorenz-butterfly mark.
//
// A heavy closed figure-eight provides the stable outer silhouette. Three fine
// contours are scaled independently inside each wing, keeping the central
// intersection clean.
//
// Usage (from either the repository root or apps/site):
//   node apps/site/scripts/gen-lorenz-mark.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const W = 240;
const H = 240;

function outerContour() {
  const lowerTip = 65;
  const lowerControl = 88;
  const outerControl = 10;
  const mirror = (x) => W - x;

  return [
    'M120 119',
    'C94 79 53 25 27 18',
    `C2 11 ${outerControl} 124 ${lowerTip} 205`,
    `C${lowerControl} 239 108 226 110 190`,
    'C111 157 112 135 120 119',
    'C128 135 129 157 130 190',
    `C132 226 ${mirror(lowerControl)} 239 ${mirror(lowerTip)} 205`,
    `C${mirror(outerControl)} 124 238 11 213 18`,
    'C187 25 146 79 120 119',
    'Z',
  ].join(' ');
}

function wingContours(stroke, width, opacity) {
  const leftWing = [
    'M120 119',
    'C94 79 53 25 27 18',
    'C2 11 10 124 65 205',
    'C88 239 108 226 110 190',
    'C111 157 112 135 120 119',
    'Z',
  ].join(' ');
  const rightWing = [
    'M120 119',
    'C128 135 129 157 130 190',
    'C132 226 152 239 175 205',
    'C230 124 238 11 213 18',
    'C187 25 146 79 120 119',
    'Z',
  ].join(' ');

  return [0.78, 0.57, 0.38]
    .flatMap((scale) => [
      `<path d="${leftWing}" transform="translate(68 120) scale(${scale}) translate(-68 -120)" stroke="${stroke}" stroke-width="${width}" stroke-opacity="${opacity}" vector-effect="non-scaling-stroke"/>`,
      `<path d="${rightWing}" transform="translate(172 120) scale(${scale}) translate(-172 -120)" stroke="${stroke}" stroke-width="${width}" stroke-opacity="${opacity}" vector-effect="non-scaling-stroke"/>`,
    ])
    .join('\n  ');
}

function svg(stroke, innerWidth, outerWidth, opacity = 1, includeInternals = true) {
  const contour = outerContour();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Equilibria Lorenz attractor mark" fill="none">
  <path d="${contour}" stroke="${stroke}" stroke-width="${outerWidth}" stroke-linecap="round" stroke-linejoin="round"/>${includeInternals ? `\n  ${wingContours(stroke, innerWidth, opacity)}` : ''}
</svg>
`;
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const outDir = join(scriptDir, '..', 'public', 'img', 'brand', 'marks');
mkdirSync(outDir, { recursive: true });

const variants = {
  'sym-concentric.svg': svg('#003B7E', 1.15, 8),
  'sym-outline.svg': svg('#003B7E', 0, 8, 1, false),
  'sym-outline-white.svg': svg('#FFFFFF', 0, 8, 1, false),
  'sym-outline-accent.svg': svg('#4AB3F4', 0, 8, 1, false),
  'sym-concentric-white.svg': svg('#FFFFFF', 1.15, 8),
  'sym-concentric-accent.svg': svg('#4AB3F4', 1.15, 8),
};

for (const [name, contents] of Object.entries(variants)) {
  writeFileSync(join(outDir, name), contents);
}

console.log('wrote canonical Equilibria marks to', outDir);
