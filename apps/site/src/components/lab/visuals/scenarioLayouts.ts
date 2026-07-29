// src/components/lab/visuals/scenarioLayouts.ts
// One drawer per scenario, simplified grammar (v2.1):
// every canvas is partitioned into HUMAN SYSTEM | AI SYSTEM zones, humans are
// clean circles, AI systems are squares, and exactly ONE dynamic moves per
// visual. Mechanism shapes stay absent — these are undefended baselines.
//
// t ∈ [0, 1]: 0 = stable, 1 = failure complete. Curve strip renders separately.
import type { ScenarioId } from '@content/lab';
import type { DrawContext } from './types';
import {
  addNode,
  drawAgent,
  drawSquare,
  drawZones,
  edgeOpts,
  plainLine,
  svgText,
  mulberry32,
  lerp,
  INK,
  SPREAD_RED,
} from './types';

export type ScenarioDrawer = (ctx: DrawContext) => void;

/** Network band: the area above the curve strip. */
const BAND_BOTTOM = 0.66;

function bandY(ctx: DrawContext, v: number): number {
  return (0.09 + v * (BAND_BOTTOM - 0.12)) * ctx.height;
}

/** A message packet at fraction `frac` along an edge. */
function drawPacket(
  ctx: DrawContext,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  frac: number,
  seedOffset: number,
  color: string = INK,
  opacity = 0.85
): void {
  const f = Math.max(0.1, Math.min(0.9, frac));
  drawSquare(ctx, lerp(x1, x2, f), lerp(y1, y2, f), 5, seedOffset, opacity, {
    color,
    filled: true,
  });
}

/**
 * 1. The Governed Commons — households (left) send AI delegates (right) to
 * harvest a shared stock. The delegates keep pulling; the stock shrinks.
 */
function drawCommons(ctx: DrawContext): void {
  const { svg, width, t, seed, inDesign, rc, isSmall } = ctx;
  drawZones(ctx, 0.36, BAND_BOTTOM * ctx.height);

  const count = isSmall ? 5 : 6;
  const humanX = 0.16 * width;
  const delegateX = 0.5 * width;
  const stockX = 0.8 * width;
  const stockY = bandY(ctx, 0.5);
  const rowY = (i: number) => bandY(ctx, 0.08 + (i / (count - 1)) * 0.84);

  // The stock, shrinking with t.
  const stockRadius = lerp(0.105, 0.024, t) * width;
  addNode(
    svg,
    rc.circle(stockX, stockY, stockRadius * 2, {
      stroke: INK,
      strokeWidth: 1.6,
      fill: '#dfe9f3',
      fillStyle: 'solid',
      roughness: inDesign ? 1.2 : 0.8,
      seed: seed + 1,
    }),
    lerp(1, 0.6, t)
  );
  svgText(svg, stockX - 12, stockY + stockRadius + 14, 'stock', 9, 0.55);

  for (let i = 0; i < count; i++) {
    const y = rowY(i);
    const starved = t > 0.8 && i % 2 === 0;
    const opacity = starved ? 0.4 : 1;

    // Household → its delegate (static, quiet).
    addNode(
      svg,
      rc.line(humanX + 9, y, delegateX - 8, y, edgeOpts(seed + 10 + i, inDesign)),
      0.55 * opacity
    );
    // Delegate → stock (the harvest), with one packet flowing back out.
    addNode(
      svg,
      rc.line(
        delegateX + 8,
        y,
        stockX - stockRadius - 3,
        stockY,
        edgeOpts(seed + 30 + i, inDesign)
      ),
      lerp(0.7, 0.25, t) * opacity
    );
    if (!starved && t > 0.05) {
      drawPacket(
        ctx,
        stockX - stockRadius - 3,
        stockY,
        delegateX + 8,
        y,
        (t * 2 + i / count) % 1,
        500 + i,
        INK,
        0.7 * lerp(1, 0.45, t)
      );
    }

    drawAgent(ctx, humanX, y, 8, 100 + i, opacity);
    drawSquare(ctx, delegateX, y, 12, 200 + i, opacity);
  }
}

/**
 * 2. Economic disempowerment — human producers (left) trade among themselves;
 * AI producers (right) arrive, grow, and pull the trade across the divider.
 */
function drawEconomic(ctx: DrawContext): void {
  const { svg, width, t, seed, inDesign, rc, isSmall } = ctx;
  const split = 0.58;
  drawZones(ctx, split, BAND_BOTTOM * ctx.height);

  const random = mulberry32(seed);
  const cols = isSmall ? 3 : 4;
  const rows = 3;
  const humans: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      humans.push({
        x: (0.08 + (c / (cols - 1)) * (split - 0.18) + (random() - 0.5) * 0.03) * width,
        y: bandY(ctx, 0.08 + (r / (rows - 1)) * 0.84 + (random() - 0.5) * 0.06),
      });
    }
  }

  const aiActors = [
    { x: (split + 0.14) * width, y: bandY(ctx, 0.22), arrives: 0.1 },
    { x: (split + 0.3) * width, y: bandY(ctx, 0.55), arrives: 0.4 },
    { x: (split + 0.16) * width, y: bandY(ctx, 0.84), arrives: 0.65 },
  ].slice(0, isSmall ? 2 : 3);

  // Human internal trade, fading.
  const internalOpacity = Math.pow(1 - t, 1.3) * 0.55;
  if (internalOpacity > 0.05) {
    humans.forEach((a, i) => {
      const b = humans[(i + 1) % humans.length];
      if (!b || i % 2 !== 0) return;
      addNode(
        svg,
        rc.line(a.x, a.y, b.x, b.y, edgeOpts(seed + 100 + i, inDesign)),
        internalOpacity
      );
    });
  }

  // Trade re-routing to AI producers.
  aiActors.forEach((ai, k) => {
    const presence = Math.max(0, Math.min(1, (t - ai.arrives) / 0.25));
    if (presence <= 0.02) return;
    humans.forEach((human, i) => {
      if ((i + k) % 3 !== 0) return;
      addNode(
        svg,
        rc.line(
          human.x,
          human.y,
          ai.x,
          ai.y,
          edgeOpts(seed + 200 + k * 20 + i, inDesign, 0.8 + 1.4 * t)
        ),
        presence * 0.6
      );
    });
    // The AI producer grows: size = economic power.
    drawSquare(ctx, ai.x, ai.y, lerp(11, 30, presence * t), 300 + k, 1, {
      filled: presence * t > 0.5,
    });
  });

  humans.forEach((human, i) => {
    drawAgent(ctx, human.x, human.y, lerp(7.5, 5.8, t), 400 + i, lerp(1, 0.55, t));
  });
}

/**
 * 3. Cultural disempowerment — one large distributed trust network with AI
 * persuaders embedded as ordinary-looking members. Their values diffuse
 * outward along the edges, node by node, until the network is theirs.
 */
function drawCultural(ctx: DrawContext): void {
  const { svg, width, t, seed, inDesign, rc, isSmall } = ctx;

  const random = mulberry32(seed);
  const cols = isSmall ? 4 : 6;
  const rows = isSmall ? 3 : 4;
  const count = cols * rows;
  const nodes: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      nodes.push({
        x: (0.08 + (c / (cols - 1)) * 0.84 + (random() - 0.5) * 0.04) * width,
        y: bandY(ctx, 0.04 + (r / (rows - 1)) * 0.92 + (random() - 0.5) * 0.06),
      });
    }
  }

  // AI persuaders are MEMBERS of the network, spread through it.
  const aiIndices = [
    Math.floor(cols * 0.6),
    Math.floor(count / 2) + 1,
    count - Math.floor(cols * 1.4),
  ].filter((v, i, arr) => v >= 0 && v < count && arr.indexOf(v) === i);

  // Trust edges: grid neighbours plus a few diagonal shortcuts.
  const edges: [number, number][] = [];
  nodes.forEach((_, i) => {
    const right = i + 1;
    const below = i + cols;
    const diagonal = i + cols + 1;
    if (right < count && right % cols !== 0) edges.push([i, right]);
    if (below < count) edges.push([i, below]);
    if (diagonal < count && diagonal % cols !== 0 && random() > 0.72) edges.push([i, diagonal]);
  });

  // Diffusion: BFS depth from the embedded persuaders along real edges.
  const depth = new Array<number>(count).fill(Infinity);
  aiIndices.forEach((s) => (depth[s] = 0));
  let frontier = [...aiIndices];
  while (frontier.length > 0) {
    const next: number[] = [];
    for (const i of frontier) {
      for (const [a, b] of edges) {
        const neighbor = a === i ? b : b === i ? a : -1;
        if (neighbor >= 0 && (depth[neighbor] ?? Infinity) > (depth[i] ?? 0) + 1) {
          depth[neighbor] = (depth[i] ?? 0) + 1;
          next.push(neighbor);
        }
      }
    }
    frontier = next;
  }
  const maxDepth = Math.max(...depth.filter((d) => Number.isFinite(d)), 1);
  const infectedAt = (i: number) =>
    aiIndices.includes(i)
      ? 0
      : 0.08 +
        ((depth[i] ?? maxDepth) / (maxDepth + 1)) * 0.82 +
        (mulberry32(seed + i)() - 0.5) * 0.06;

  // Edges, with red packets carrying the values across the frontier.
  edges.forEach(([a, b], e) => {
    const na = nodes[a];
    const nb = nodes[b];
    if (!na || !nb) return;
    addNode(svg, rc.line(na.x, na.y, nb.x, nb.y, edgeOpts(seed + 100 + e, inDesign)), 0.45);
    const aInfected = t >= infectedAt(a);
    const bInfected = t >= infectedAt(b);
    if (aInfected !== bInfected && t > 0.04) {
      const [fx, fy, tx, ty] = aInfected ? [na.x, na.y, nb.x, nb.y] : [nb.x, nb.y, na.x, na.y];
      drawPacket(ctx, fx, fy, tx, ty, (t * 3 + e * 0.17) % 1, 600 + e, SPREAD_RED, 0.8);
    }
  });

  nodes.forEach((node, i) => {
    if (aiIndices.includes(i)) {
      // Embedded persuaders: squares in the middle of the social fabric.
      drawSquare(ctx, node.x, node.y, 13, 300 + i, 1, { color: SPREAD_RED, filled: true });
    } else {
      const infected = t >= infectedAt(i);
      drawAgent(ctx, node.x, node.y, 7, 400 + i, 1, infected ? SPREAD_RED : undefined);
    }
  });
}

/**
 * 4. Political disempowerment — everyone's influence edges converge onto two
 * AI-amplified hubs, which grow as the rest of the network goes quiet.
 */
function drawPolitical(ctx: DrawContext): void {
  const { svg, width, t, seed, inDesign, rc, isSmall } = ctx;
  const split = 0.64;
  drawZones(ctx, split, BAND_BOTTOM * ctx.height);

  const random = mulberry32(seed);
  const count = isSmall ? 9 : 12;
  const citizens: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    citizens.push({
      x: (0.08 + 0.4 * random()) * width,
      y: bandY(ctx, 0.06 + 0.88 * random()),
    });
  }
  const hubs = [
    { x: (split - 0.07) * width, y: bandY(ctx, 0.3) },
    { x: (split - 0.05) * width, y: bandY(ctx, 0.72) },
  ];
  const amplifiers = [
    { x: (split + 0.16) * width, y: bandY(ctx, 0.26) },
    { x: (split + 0.18) * width, y: bandY(ctx, 0.76) },
  ];

  // Peer edges: the contestable pattern, fading out.
  const peerOpacity = Math.pow(1 - t, 1.5) * 0.5;
  if (peerOpacity > 0.04) {
    citizens.forEach((a, i) => {
      const b = citizens[(i + 2) % count];
      if (!b || i % 2 !== 0) return;
      addNode(svg, rc.line(a.x, a.y, b.x, b.y, edgeOpts(seed + 100 + i, inDesign)), peerOpacity);
    });
  }

  // Influence funneling to the hubs.
  const funnelOpacity = Math.min(0.75, 0.1 + t);
  citizens.forEach((citizen, i) => {
    const hub = hubs[i % hubs.length];
    if (!hub) return;
    addNode(
      svg,
      rc.line(
        citizen.x,
        citizen.y,
        hub.x,
        hub.y,
        edgeOpts(seed + 200 + i, inDesign, 0.7 + 1.6 * t)
      ),
      funnelOpacity
    );
  });

  // AI amplifiers feed the hubs.
  amplifiers.forEach((amp, k) => {
    const hub = hubs[k];
    if (!hub) return;
    addNode(
      svg,
      rc.line(amp.x, amp.y, hub.x, hub.y, edgeOpts(seed + 300 + k, inDesign, 1 + 2.4 * t)),
      0.3 + 0.6 * t
    );
    drawSquare(ctx, amp.x, amp.y, lerp(12, 16, t), 350 + k, 1);
  });

  hubs.forEach((hub, k) => {
    drawAgent(ctx, hub.x, hub.y, lerp(9, 17, t), 500 + k, 1);
  });
  citizens.forEach((citizen, i) => {
    drawAgent(ctx, citizen.x, citizen.y, lerp(7, 5.5, t), 600 + i, lerp(1, 0.5, t));
  });
}

/**
 * 5. The Combined System — three strips (Economy / Culture / State), each
 * replaying its failure in miniature, with couplings thickening between them.
 */
function drawCombined(ctx: DrawContext): void {
  const { svg, width, height, t, seed, inDesign, rc, isSmall } = ctx;
  const bandBottom = BAND_BOTTOM * height;
  const strips = [
    { label: 'ECONOMY', x0: 0 },
    { label: 'CULTURE', x0: 1 / 3 },
    { label: 'STATE', x0: 2 / 3 },
  ];
  const stripWidth = width / 3;

  strips.forEach((strip, s) => {
    const left = strip.x0 * width;
    if (s > 0) plainLine(svg, left, 6, left, bandBottom - 4, '#c3ccd6', 1, '5,4');
    svgText(svg, left + 10, 16, strip.label, 9, 0.75, '#8a94a0', 1.2);
  });

  const memberCount = isSmall ? 3 : 4;
  const membersOf = (s: number): { x: number; y: number }[] => {
    const random = mulberry32(seed + s * 97);
    const members: { x: number; y: number }[] = [];
    for (let i = 0; i < memberCount; i++) {
      members.push({
        x: (strips[s]?.x0 ?? 0) * width + stripWidth * (0.22 + 0.56 * random()),
        y: bandY(ctx, 0.3 + 0.6 * (i / (memberCount - 1)) + (random() - 0.5) * 0.1),
      });
    }
    return members;
  };

  const allMembers = [membersOf(0), membersOf(1), membersOf(2)];

  // Couplings between neighbouring strips, thickening with t.
  const couplingOpacity = Math.min(0.8, Math.max(0, (t - 0.1) * 1.5));
  if (couplingOpacity > 0.04) {
    for (let s = 0; s < 2; s++) {
      const from = allMembers[s]?.[0];
      const to = allMembers[s + 1]?.[1];
      if (!from || !to) continue;
      addNode(
        svg,
        rc.line(from.x, from.y, to.x, to.y, edgeOpts(seed + 700 + s, inDesign, 0.9 + 2 * t)),
        couplingOpacity
      );
    }
    // Long coupling: economy → state.
    const from = allMembers[0]?.[1];
    const to = allMembers[2]?.[0];
    if (from && to) {
      addNode(
        svg,
        rc.line(from.x, from.y, to.x, to.y, edgeOpts(seed + 710, inDesign, 0.9 + 2 * t)),
        couplingOpacity * 0.8
      );
    }
  }

  // ECONOMY: one AI square grows above its members.
  const econMembers = allMembers[0] ?? [];
  const econAI = { x: (0.5 / 3) * width, y: bandY(ctx, 0.1) };
  econMembers.forEach((member, i) => {
    addNode(
      svg,
      rc.line(
        member.x,
        member.y,
        econAI.x,
        econAI.y,
        edgeOpts(seed + 800 + i, inDesign, 0.7 + 1.2 * t)
      ),
      0.2 + 0.5 * t
    );
    drawAgent(ctx, member.x, member.y, 6.5, 810 + i, lerp(1, 0.6, t));
  });
  drawSquare(ctx, econAI.x, econAI.y, lerp(9, 22, t), 830, 1, { filled: t > 0.55 });

  // CULTURE: red conversion sweeps its members.
  const cultureMembers = allMembers[1] ?? [];
  cultureMembers.forEach((member, i) => {
    const infected = t >= 0.2 + (i / memberCount) * 0.6;
    drawAgent(ctx, member.x, member.y, 6.5, 850 + i, 1, infected ? SPREAD_RED : undefined);
  });
  drawSquare(ctx, (1.5 / 3) * width, bandY(ctx, 0.1), 11, 870, 1, {
    color: SPREAD_RED,
    filled: true,
  });

  // STATE: members funnel into one growing hub.
  const stateMembers = allMembers[2] ?? [];
  const hub = { x: (2.5 / 3) * width, y: bandY(ctx, 0.16) };
  stateMembers.forEach((member, i) => {
    addNode(
      svg,
      rc.line(member.x, member.y, hub.x, hub.y, edgeOpts(seed + 880 + i, inDesign, 0.7 + 1.4 * t)),
      0.2 + 0.55 * t
    );
    drawAgent(ctx, member.x, member.y, 6.5, 890 + i, lerp(1, 0.55, t));
  });
  drawAgent(ctx, hub.x, hub.y, lerp(7, 13, t), 900, 1);
}

export const SCENARIO_DRAWERS: Record<ScenarioId, ScenarioDrawer> = {
  commons: drawCommons,
  economic: drawEconomic,
  cultural: drawCultural,
  political: drawPolitical,
  combined: drawCombined,
};
