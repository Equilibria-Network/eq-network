// src/components/lab/visuals/types.ts
//
// Visual grammar, simplified (v2.1):
//   - every scenario canvas is PARTITIONED into a human zone and an AI zone
//     (faint tint + small label) so the eye finds the structure instantly
//   - humans: near-clean circles; AI systems: squares; one dynamic per visual
//   - structural elements (zones, dividers, axes) are plain SVG, not roughjs —
//     the sketch character lives in the agents only, and gently
//   - dashes mean "edge"; in-design status is a corner stamp, never dashes.
import rough from 'roughjs';

export type RoughSVG = ReturnType<typeof rough.svg>;

export interface DrawContext {
  rc: RoughSVG;
  svg: SVGSVGElement;
  width: number;
  height: number;
  /** Progress through the failure story: 0 (stable) → 1 (fully unfolded). */
  t: number;
  seed: number;
  /** In-design scenarios render slightly rougher and get a corner stamp. */
  inDesign: boolean;
  isSmall: boolean;
}

/** Brand navy — reserved for the metrics strip. */
export const NAVY = '#003B7E';
/** Agents, edges — the sketch ink. */
export const INK = '#1e1e1e';
/** AI systems. */
export const AI_ZONE_TINT = '#edf3f9';
export const ZONE_LABEL = '#8a94a0';
/** Mechanism colors (reading key + future teaching visuals; not in baselines). */
export const MECH_DEMOCRACY = '#1c7ed6';
export const MECH_MARKET = '#f08c00';
/** Spreading dynamics / contagion. */
export const SPREAD_RED = '#e03131';

/** Status → sketch roughness. Kept LOW: legibility beats sketchiness. */
export function sketchOpts(inDesign: boolean): { roughness: number } {
  return { roughness: inDesign ? 1.2 : 0.8 };
}

/** Dashed-edge options: thin, light, quiet — nodes carry the story. */
export function edgeOpts(
  seed: number,
  inDesign: boolean,
  strokeWidth = 1
): {
  stroke: string;
  strokeWidth: number;
  strokeLineDash: number[];
  roughness: number;
  seed: number;
} {
  return {
    stroke: '#9aa2ab',
    strokeWidth,
    strokeLineDash: [4, 4],
    roughness: inDesign ? 0.9 : 0.6,
    seed,
  };
}

export function addNode(svg: SVGSVGElement, node: SVGGElement, opacity?: number): void {
  if (opacity !== undefined && opacity < 1) {
    node.setAttribute('opacity', String(Math.max(0, opacity)));
  }
  svg.appendChild(node);
}

/** Plain (non-rough) rectangle — for zone tints. */
export function plainRect(
  svg: SVGSVGElement,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  opacity = 1
): void {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', String(x));
  rect.setAttribute('y', String(y));
  rect.setAttribute('width', String(w));
  rect.setAttribute('height', String(h));
  rect.setAttribute('fill', fill);
  rect.setAttribute('opacity', String(opacity));
  svg.appendChild(rect);
}

/** Plain (non-rough) line — for dividers and axes. */
export function plainLine(
  svg: SVGSVGElement,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  stroke: string,
  strokeWidth = 1,
  dash?: string,
  opacity = 1
): void {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', String(x1));
  line.setAttribute('y1', String(y1));
  line.setAttribute('x2', String(x2));
  line.setAttribute('y2', String(y2));
  line.setAttribute('stroke', stroke);
  line.setAttribute('stroke-width', String(strokeWidth));
  if (dash) line.setAttribute('stroke-dasharray', dash);
  line.setAttribute('opacity', String(opacity));
  svg.appendChild(line);
}

/**
 * The canvas partition: human zone (left) | AI zone (right, tinted), with
 * small uppercase labels. `splitX` is the divider as a fraction of width.
 * `bandBottom` is where the network band ends (the curve strip starts below).
 */
export function drawZones(
  ctx: DrawContext,
  splitX: number,
  bandBottom: number,
  leftLabel = 'HUMAN SYSTEM',
  rightLabel = 'AI SYSTEM'
): void {
  const { svg, width } = ctx;
  const divider = splitX * width;
  plainRect(svg, divider, 0, width - divider, bandBottom, AI_ZONE_TINT, 0.9);
  plainLine(svg, divider, 6, divider, bandBottom - 4, '#c3ccd6', 1, '5,4');
  svgText(svg, 10, 16, leftLabel, 9, 0.75, ZONE_LABEL, 1.2);
  svgText(svg, divider + 10, 16, rightLabel, 9, 0.75, ZONE_LABEL, 1.2);
}

/** Human agent: a near-clean circle. */
export function drawAgent(
  ctx: DrawContext,
  x: number,
  y: number,
  radius: number,
  seedOffset: number,
  opacity = 1,
  fill?: string
): void {
  addNode(
    ctx.svg,
    ctx.rc.circle(x, y, radius * 2, {
      stroke: INK,
      strokeWidth: 1.4,
      ...(fill ? { fill, fillStyle: 'solid' } : { fill: '#ffffff', fillStyle: 'solid' }),
      ...sketchOpts(ctx.inDesign),
      seed: ctx.seed + seedOffset,
    }),
    opacity
  );
}

/** Small square — an AI system, delegate, or message packet. */
export function drawSquare(
  ctx: DrawContext,
  x: number,
  y: number,
  size: number,
  seedOffset: number,
  opacity = 1,
  options?: { color?: string; filled?: boolean }
): void {
  const color = options?.color ?? INK;
  addNode(
    ctx.svg,
    ctx.rc.rectangle(x - size / 2, y - size / 2, size, size, {
      stroke: color,
      strokeWidth: 1.4,
      ...(options?.filled
        ? { fill: color, fillStyle: 'solid' }
        : { fill: '#ffffff', fillStyle: 'solid' }),
      ...sketchOpts(ctx.inDesign),
      seed: ctx.seed + seedOffset,
    }),
    opacity
  );
}

export function svgText(
  svg: SVGSVGElement,
  x: number,
  y: number,
  content: string,
  fontSize: number,
  opacity: number,
  color: string = INK,
  letterSpacing?: number
): void {
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', String(x));
  text.setAttribute('y', String(y));
  text.setAttribute('font-size', String(fontSize));
  text.setAttribute('fill', color);
  text.setAttribute('opacity', String(opacity));
  if (letterSpacing) text.setAttribute('letter-spacing', String(letterSpacing));
  text.style.fontFamily = 'inherit';
  text.textContent = content;
  svg.appendChild(text);
}

/** Deterministic PRNG, same convention as explainer/visuals/networkLayout.ts. */
export function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let x = Math.imul(state ^ (state >>> 15), 1 | state);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Interpolated value of a keyframed trajectory at progress t ∈ [0, 1]. */
export function sampleCurve(curve: number[], t: number): number {
  if (curve.length === 0) return 0;
  if (curve.length === 1) return curve[0] ?? 0;
  const progress = Math.max(0, Math.min(1, t)) * (curve.length - 1);
  const index = Math.min(Math.floor(progress), curve.length - 2);
  const frac = progress - index;
  return lerp(curve[index] ?? 0, curve[index + 1] ?? 0, frac);
}
