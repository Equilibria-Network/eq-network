// src/components/lab/visuals/curve.ts
// The shared influence sparkline: every scenario's bottom strip, revealed with progress t.
import type { DrawContext } from './types';
import { addNode, svgText, sketchOpts, plainLine, NAVY, lerp } from './types';

export function drawInfluenceCurve(ctx: DrawContext, curve: number[]): void {
  const { rc, svg, width, height, t, seed, inDesign } = ctx;
  if (curve.length < 2) return;

  const left = 0.08 * width;
  const right = 0.94 * width;
  const top = 0.74 * height;
  const bottom = 0.95 * height;

  // Plain, quiet axes — the sketch character belongs to the network above.
  plainLine(svg, left, bottom, right, bottom, '#c3ccd6', 1, undefined, 0.9);
  plainLine(svg, left, bottom, left, top, '#c3ccd6', 1, undefined, 0.9);
  svgText(svg, left + 4, top - 5, 'collective influence', 9, 0.55, '#8a94a0', 0.5);

  const xAt = (index: number) => left + (index / (curve.length - 1)) * (right - left);
  const yAt = (value: number) => bottom - value * (bottom - top) * 0.92;

  const progress = t * (curve.length - 1);
  const fullSegments = Math.floor(progress);
  const points: [number, number][] = [];
  for (let i = 0; i <= fullSegments && i < curve.length; i++) {
    points.push([xAt(i), yAt(curve[i] ?? 0)]);
  }
  const frac = progress - fullSegments;
  if (fullSegments < curve.length - 1 && frac > 0.02) {
    const x = lerp(xAt(fullSegments), xAt(fullSegments + 1), frac);
    const value = lerp(curve[fullSegments] ?? 0, curve[fullSegments + 1] ?? 0, frac);
    points.push([x, yAt(value)]);
  }

  if (points.length >= 2) {
    addNode(
      svg,
      rc.linearPath(points, {
        stroke: NAVY,
        strokeWidth: 2.5,
        seed: seed + 902,
        ...sketchOpts(inDesign),
      })
    );
  }

  const last = points[points.length - 1];
  if (last) {
    addNode(
      svg,
      rc.circle(last[0], last[1], 7, {
        stroke: NAVY,
        fill: NAVY,
        fillStyle: 'solid',
        roughness: 1,
        seed: seed + 903,
      })
    );
  }
}
