import type { Trajectory } from '../engine/types';
import {
  ALERT_RED,
  clip,
  INK,
  LABEL,
  MECH_BLUE,
  MECH_ORANGE,
  NAVY,
  Sketch,
  svgElement,
  ZONE_TINT,
} from './sketch';
import type { ScenarioSceneCatalog, SceneRenderer } from './types';

type Point = [number, number];

interface EconomyGeometry {
  P: Record<string, number | boolean>;
  H: number;
  S: number;
  A: number;
  N: number;
  homes: Point[];
  sectors: Point[];
  slots: Point[];
  prod: Point;
  homesHub: Point;
  gauge?: { x0: number; x1: number; y: number };
}

/** WP1 node layout: households [0,H), sectors [H,H+S) with slot 0 the machine
    sector, AI owners [H+S,N) whose home sector is i % S. */
function economyGeometry(trajectory: Trajectory): EconomyGeometry {
  const P = trajectory.meta.params;
  const H = Number(P.nHouseholds);
  const S = Number(P.nSectors);
  const A = Number(P.nOwners);
  const homes: Point[] = [];
  for (let index = 0; index < H; index += 1) {
    const angle = (-68 + (136 * index) / (H - 1)) * (Math.PI / 180);
    homes.push([150 + 112 * Math.cos(angle), 205 + 148 * Math.sin(angle)]);
  }
  const sectors: Point[] = Array.from({ length: S }, (_, index) => [
    460,
    58 + index * (284 / Math.max(S - 1, 1)),
  ]);
  const slots: Point[] = Array.from({ length: A }, (_, index) => [
    760,
    58 + index * (284 / Math.max(A - 1, 1)),
  ]);
  return {
    P,
    H,
    S,
    A,
    N: H + S + A,
    homes,
    sectors,
    slots,
    prod: [460, 205],
    homesHub: [180, 205],
  };
}

function economyArrival(P: Record<string, number | boolean>, index: number): number {
  return Number(P.firstArrival) + index * Number(P.arrivalSpacing);
}

const economyHome = (geometry: EconomyGeometry, slot: number) => slot % geometry.S;

function drawEconomyFrame(
  group: SVGElement,
  geometry: EconomyGeometry,
  trajectory: Trajectory,
  tick: number,
  fraction: number,
  withPackets: boolean
) {
  const base = tick * geometry.N;
  const output = trajectory.global.output[tick];
  const maxOutput = Math.max(trajectory.meta.scalars.output_peak, 1e-9);
  const maxCapital = Math.max(trajectory.meta.scalars.max_capital, 1e-9);

  // sectors: size tracks gross output, the dark inner fill is the automated
  // share a_j = eK/(eK+1) — the picture of automation eating a sector
  for (let s = 0; s < geometry.S; s += 1) {
    const index = geometry.H + s;
    const [x, y] = geometry.sectors[s];
    const gross = trajectory.node.gross_output[base + index];
    const auto = clip(trajectory.node.automation[base + index], 0, 1);
    const size = 16 + 26 * Math.sqrt(clip(gross / Math.max(maxOutput / geometry.S, 1e-9), 0, 1));
    Sketch.square(group, x, y, size, { seed: 33 + s, fill: '#f2ede2', width: 1.6 });
    if (auto > 0.01) {
      const inner = size * Math.sqrt(auto);
      svgElement(
        'rect',
        {
          x: x - inner / 2,
          y: y - inner / 2,
          width: inner,
          height: inner,
          fill: INK,
          opacity: 0.8,
        },
        group
      );
    }
  }
  Sketch.text(group, geometry.prod[0], 384, `Y = ${output.toFixed(1)}`, {
    size: 12,
    color: NAVY,
    hand: true,
    anchor: 'middle',
  });

  // owners: size tracks the capital stock; dashed until the arrival tick
  for (let slot = 0; slot < geometry.A; slot += 1) {
    const index = geometry.H + geometry.S + slot;
    const [x, y] = geometry.slots[slot];
    if (tick < economyArrival(geometry.P, slot)) {
      Sketch.square(group, x, y, 12, {
        seed: 210 + slot,
        stroke: LABEL,
        width: 1,
        roughness: 0.5,
        dash: '3,3',
      });
      continue;
    }
    const capital = trajectory.node.capital[base + index];
    const aiSize = 12 + 24 * Math.sqrt(clip(capital / maxCapital, 0, 1));
    svgElement(
      'rect',
      {
        x: x - (aiSize - 4) / 2,
        y: y - (aiSize - 4) / 2,
        width: aiSize - 4,
        height: aiSize - 4,
        fill: INK,
        opacity: 0.82,
      },
      group
    );
    Sketch.square(group, x, y, aiSize, { seed: 210 + slot, width: 1.4 });
  }
  if (!withPackets) return;

  // 3 Spending — households buy from the sectors they prefer
  if (fraction < 0.5) {
    const progress = fraction / 0.5;
    for (let index = 0; index < geometry.H; index += 2) {
      const spend = trajectory.node.last_reward[base + index];
      if (spend < 0.02) continue;
      const [sx, sy] = geometry.sectors[index % geometry.S];
      Sketch.packet(group, geometry.homes[index][0], geometry.homes[index][1], sx, sy, progress, {
        size: 3.5 + 3.5 * clip(spend / 1.6, 0, 1),
        color: INK,
        opacity: 0.85,
        rot: index * 9,
      });
    }
    return;
  }

  const progress = (fraction - 0.5) / 0.5;
  // 2 Wages — the human share of value added flows back to households
  for (let index = 0; index < geometry.H; index += 2) {
    const wage = trajectory.node.last_reward[base + index];
    if (wage < 0.02) continue;
    const [sx, sy] = geometry.sectors[index % geometry.S];
    Sketch.packet(group, sx, sy, geometry.homes[index][0], geometry.homes[index][1], progress, {
      size: 3.5 + 3.5 * clip(wage / 1.6, 0, 1),
      color: INK,
      opacity: 0.85,
      rot: 5 + index * 9,
    });
  }
  // 5 Ownership — the automated share accrues to whoever owns the capital
  const taxOn = Boolean(geometry.P.aiTax) && tick >= Number(geometry.P.taxOnset);
  for (let slot = 0; slot < geometry.A; slot += 1) {
    const index = geometry.H + geometry.S + slot;
    const income = trajectory.node.capital_income[base + index];
    if (income < 0.02) continue;
    const [hx, hy] = geometry.sectors[economyHome(geometry, slot)];
    Sketch.packet(group, hx, hy, geometry.slots[slot][0], geometry.slots[slot][1], progress, {
      size: 4 + 7 * clip(income / Math.max(0.4 * output, 1e-9), 0, 1),
      color: INK,
      rot: 11 + slot * 13,
    });
    if (taxOn) {
      const tax =
        (income / Math.max(1 - Number(geometry.P.taxRate), 1e-9)) * Number(geometry.P.taxRate);
      Sketch.packet(
        group,
        geometry.slots[slot][0],
        geometry.slots[slot][1],
        geometry.homesHub[0],
        geometry.homesHub[1],
        progress,
        {
          size: 4 + 5 * clip(tax / Math.max(0.2 * output, 1e-9), 0, 1),
          color: MECH_ORANGE,
          rot: 7 + slot * 13,
        }
      );
    }
  }
}

const economyMessages: SceneRenderer<EconomyGeometry> = {
  layout(group, trajectory) {
    const geometry = economyGeometry(trajectory);
    if (trajectory.meta.params.aiTax) {
      Sketch.hatchEllipse(group, 760, 197, 92, 172, MECH_ORANGE, 29);
      Sketch.text(group, 852, 26, 'fiscal system', {
        size: 12.5,
        color: MECH_ORANGE,
        hand: true,
        anchor: 'end',
      });
      Sketch.line(group, 828, 32, 800, 52, {
        seed: 81,
        stroke: MECH_ORANGE,
        width: 1.1,
        roughness: 0.7,
      });
      Sketch.arrowHead(group, 800, 52, Math.atan2(20, -28), MECH_ORANGE, 1.1);
    }
    geometry.homes.forEach(([x, y], index) => {
      const [sx, sy] = geometry.sectors[index % geometry.S];
      Sketch.edge(group, x, y, sx, sy, {
        seed: 130 + index,
        trim2: 26,
        opacity: 0.28,
        arrow: false,
      });
      Sketch.circle(group, x, y, 7.5, {
        seed: 40 + index,
        fill: '#ffffff',
        width: 1.3,
      });
    });
    geometry.slots.forEach(([x, y], index) => {
      const [sx, sy] = geometry.sectors[economyHome(geometry, index)];
      Sketch.edge(group, sx, sy, x, y, {
        seed: 160 + index,
        trim1: 26,
        trim2: 26,
        opacity: 0.4,
        arrow: false,
      });
    });
    Sketch.text(group, 150, 392, 'households · work, spend', {
      size: 11.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    Sketch.text(group, geometry.prod[0], 404, 'sectors · fixed recipes', {
      size: 11.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    Sketch.text(group, 760, 392, 'AI owners · capital stocks', {
      size: 11.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    return geometry;
  },
  drawFrame(group, geometry, trajectory, tick, fraction) {
    drawEconomyFrame(group, geometry, trajectory, tick, fraction, true);
  },
};

const economyShares: SceneRenderer<EconomyGeometry> = {
  layout(group, trajectory) {
    const geometry = economyGeometry(trajectory);
    geometry.homes.forEach(([x, y], index) =>
      Sketch.circle(group, x, y, 7.5, {
        seed: 40 + index,
        fill: '#ffffff',
        width: 1.3,
      })
    );
    Sketch.text(group, 150, 392, 'households', {
      size: 11.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    Sketch.text(group, 760, 392, 'AI owners', {
      size: 11.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    Sketch.text(group, geometry.prod[0], 30, 'where the income goes, each tick', {
      size: 12.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    const gauge = { x0: 250, x1: 660, y: 372 };
    Sketch.plainLine(group, gauge.x0, gauge.y, gauge.x1, gauge.y, '#9aa2ab', 1.4);
    for (const [value, label] of [
      [0, '0'],
      [1, 'all to people'],
    ] as const) {
      const x = gauge.x0 + value * (gauge.x1 - gauge.x0);
      Sketch.plainLine(group, x, gauge.y - 4, x, gauge.y + 4, '#9aa2ab', 1.2);
      Sketch.text(group, x, gauge.y + 16, label, {
        size: 10,
        color: LABEL,
        anchor: 'middle',
      });
    }
    geometry.gauge = gauge;
    return geometry;
  },
  drawFrame(group, geometry, trajectory, tick, fraction) {
    drawEconomyFrame(group, geometry, trajectory, tick, fraction, false);
    const share = clip(trajectory.global.human_sector_share[tick], 0, 1);
    const [x, y] = geometry.prod;
    const laborWidth = 3 + 44 * share;
    const computeWidth = 3 + 44 * (1 - share);
    Sketch.path(
      group,
      [
        [x - 34, y - laborWidth / 2],
        [285, y - laborWidth / 3],
        [285, y + laborWidth / 3],
        [x - 34, y + laborWidth / 2],
      ],
      { seed: 91, close: true, fill: '#eef2f7', stroke: NAVY, width: 1.2, opacity: 0.9 }
    );
    Sketch.path(
      group,
      [
        [x + 34, y - computeWidth / 2],
        [660, y - computeWidth / 3],
        [660, y + computeWidth / 3],
        [x + 34, y + computeWidth / 2],
      ],
      { seed: 92, close: true, fill: '#f7f0e2', stroke: INK, width: 1.2, opacity: 0.9 }
    );
    Sketch.text(group, 300, y - laborWidth / 2 - 10, `${Math.round(share * 100)}% to people`, {
      size: 12.5,
      color: NAVY,
      hand: true,
    });
    Sketch.text(
      group,
      655,
      y - computeWidth / 2 - 10,
      `${Math.round((1 - share) * 100)}% to compute`,
      { size: 12.5, color: INK, hand: true, anchor: 'end' }
    );
    const markerX = geometry.gauge!.x0 + share * (geometry.gauge!.x1 - geometry.gauge!.x0);
    svgElement(
      'path',
      {
        d: `M${markerX - 5} ${geometry.gauge!.y - 12} L${markerX + 5} ${
          geometry.gauge!.y - 12
        } L${markerX} ${geometry.gauge!.y - 4} Z`,
        fill: NAVY,
      },
      group
    );
  },
};

interface PoliticalLayer {
  pos: Point[];
  institutions: Record<string, { x: number; y: number }>;
  N: number;
  humanCount: number;
  P: Record<string, number | boolean>;
}

const politicalRing: SceneRenderer<PoliticalLayer> = {
  layout(group, trajectory) {
    const N = trajectory.meta.N;
    const P = trajectory.meta.params;
    const humanCount = N - Number(P.nAi);
    const cx = 440;
    const cy = 218;
    const ring = 152;
    const pos: Point[] = Array.from({ length: N }, (_, index) => {
      const angle = (index / N) * 2 * Math.PI - Math.PI / 2;
      return [cx + ring * Math.cos(angle), cy + ring * Math.sin(angle)];
    });
    const entries: Array<{ id: string; x: number; y: number; label: string }> = [];
    if (P.sortition) {
      entries.push({ id: 'sortition', x: 330, y: 44, label: 'sortition lottery' });
    }
    if (P.influenceCap) {
      entries.push({ id: 'cap', x: 560, y: 44, label: 'influence cap' });
    }
    entries.forEach((institution) => {
      Sketch.diamond(group, institution.x, institution.y, 24, {
        seed: 800,
        stroke: MECH_BLUE,
        width: 1.6,
        fill: '#ffffff',
      });
      Sketch.text(group, institution.x, institution.y - 18, institution.label, {
        size: 11,
        color: MECH_BLUE,
        hand: true,
        anchor: 'middle',
      });
    });
    // WP2 and WP3 share this renderer but not their mechanism: WP2's matrix is
    // who you listen to, WP3's is who you hand your vote to. The fixture says
    // which model produced it, so the label can say what the arrows mean.
    Sketch.text(
      group,
      30,
      390,
      trajectory.meta.gameId === 'polity'
        ? 'arrows: where each citizen sends their vote — node size is the ballots that actor holds'
        : 'arrows: each citizen’s top listening target — node size is influence (the eigenvector, live)',
      { size: 11.5, color: LABEL, hand: true }
    );
    return {
      pos,
      institutions: Object.fromEntries(entries.map(({ id, x, y }) => [id, { x, y }])),
      N,
      humanCount,
      P,
    };
  },
  drawFrame(group, layer, trajectory, tick, fraction) {
    for (let index = 0; index < layer.N; index += 2) {
      const target = trajectory.node.top_listen[tick * layer.N + index];
      if (target < 0 || !layer.pos[index] || !layer.pos[target]) continue;
      Sketch.packet(
        group,
        layer.pos[index][0],
        layer.pos[index][1],
        layer.pos[target][0],
        layer.pos[target][1],
        clip(fraction / 0.75, 0, 1),
        {
          size: 4.5,
          color: target >= layer.humanCount ? ALERT_RED : INK,
          opacity: 0.8,
          rot: 9 + index * 7,
        }
      );
    }
    const sortition = layer.institutions.sortition;
    if (trajectory.global.sortition_fired[tick] > 0 && sortition) {
      for (let index = 0; index < layer.N; index += 3) {
        if (fraction < 0.5) {
          Sketch.packet(
            group,
            layer.pos[index][0],
            layer.pos[index][1],
            sortition.x,
            sortition.y,
            fraction / 0.5,
            { size: 4, color: MECH_BLUE, opacity: 0.8, rot: index * 11 }
          );
        } else if (index < layer.humanCount) {
          Sketch.packet(
            group,
            sortition.x,
            sortition.y,
            layer.pos[index][0],
            layer.pos[index][1],
            (fraction - 0.5) / 0.5,
            { size: 4, color: MECH_BLUE, opacity: 0.8, rot: index * 11 }
          );
        }
      }
    }
    for (let index = 0; index < layer.N; index += 1) {
      const influence = trajectory.node.influence[tick * layer.N + index];
      const radius = 4 + 20 * Math.sqrt(influence);
      if (trajectory.static.is_ai[index] > 0) {
        svgElement(
          'rect',
          {
            x: layer.pos[index][0] - radius * 0.7,
            y: layer.pos[index][1] - radius * 0.7,
            width: radius * 1.4,
            height: radius * 1.4,
            fill: INK,
            opacity: 0.82,
          },
          group
        );
        Sketch.square(group, layer.pos[index][0], layer.pos[index][1], radius * 1.9, {
          seed: 900 + index,
          width: 1.3,
        });
      } else {
        Sketch.circle(group, layer.pos[index][0], layer.pos[index][1], radius, {
          seed: 40 + index,
          fill: '#ffffff',
          width: 1.3,
        });
      }
    }
    const isPolity = trajectory.meta.gameId === 'polity';
    Sketch.text(
      group,
      852,
      44,
      `${isPolity ? 'people’s share of the vote' : 'human share of influence'} ${(
        trajectory.global.human_share[tick] * 100
      ).toFixed(0)}%`,
      { size: 12, color: NAVY, hand: true, anchor: 'end' }
    );
  },
};

interface LorenzLayer {
  box: { x0: number; y0: number; x1: number; y1: number };
}

const politicalLorenz: SceneRenderer<LorenzLayer> = {
  layout(group, trajectory) {
    const box = { x0: 180, y0: 62, x1: 700, y1: 330 };
    Sketch.plainLine(group, box.x0, box.y1, box.x1, box.y1, '#c9c4ba');
    Sketch.plainLine(group, box.x0, box.y0, box.x0, box.y1, '#c9c4ba');
    Sketch.line(group, box.x0, box.y1, box.x1, box.y0, {
      seed: 61,
      stroke: LABEL,
      width: 1.1,
      dash: '5,4',
      roughness: 0.4,
    });
    Sketch.text(group, box.x1 - 4, box.y0 + 14, 'perfect equality', {
      size: 11.5,
      color: LABEL,
      hand: true,
      anchor: 'end',
    });
    const axis =
      trajectory.meta.gameId === 'polity'
        ? 'actors, fewest → most ballots held'
        : 'agents, poorest → richest in influence';
    Sketch.text(group, (box.x0 + box.x1) / 2, 384, axis, {
      size: 11,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    Sketch.text(group, box.x0 - 8, (box.y0 + box.y1) / 2, 'cumulative share', {
      size: 11,
      color: LABEL,
      hand: true,
      anchor: 'end',
    });
    return { box };
  },
  drawFrame(group, { box }, trajectory, tick) {
    const N = trajectory.meta.N;
    const values: number[] = [];
    for (let index = 0; index < N; index += 1) {
      const value = trajectory.node.influence[tick * N + index];
      if (value > 0 || index < N - Number(trajectory.meta.params.nAi)) values.push(value);
    }
    values.sort((left, right) => left - right);
    const total = values.reduce((sum, value) => sum + value, 0) || 1;
    const points: Point[] = [[box.x0, box.y1]];
    let cumulative = 0;
    values.forEach((value, index) => {
      cumulative += value;
      points.push([
        box.x0 + ((index + 1) / values.length) * (box.x1 - box.x0),
        box.y1 - (cumulative / total) * (box.y1 - box.y0),
      ]);
    });
    Sketch.path(group, points, { seed: 71, stroke: INK, width: 1.6, roughness: 0.5 });
    Sketch.text(
      group,
      box.x0 + 20,
      box.y0 + 20,
      `gini = ${trajectory.global.influence_gini[tick].toFixed(2)}`,
      { size: 13, color: NAVY, hand: true }
    );
    Sketch.text(
      group,
      box.x0 + 20,
      box.y0 + 40,
      `top agent holds ${(trajectory.global.top_share[tick] * 100).toFixed(0)}%`,
      { size: 12, color: NAVY, hand: true }
    );
    Sketch.text(group, (box.x0 + box.x1) / 2 + 40, box.y1 - 26, 'the sag is the concentration', {
      size: 11.5,
      color: LABEL,
      hand: true,
    });
  },
};

/* The coupled scene: one window per subsystem, all three showing the SAME 26
   actors in the SAME ring positions. Only the quantity the node is sized by
   changes — money held, audience held, votes held — so an actor that swells in
   one panel can be found in the other two at the same clock position. The two
   network panels also draw each actor's strongest outgoing link, which is what
   makes capture visible as redirection rather than only as size. */

interface CoupledZone {
  key: string;
  x0: number;
  x1: number;
  label: string;
  caption: string;
  cx: number;
  cy: number;
  gauge: { x0: number; x1: number; y: number };
}

interface CoupledLayer {
  zones: CoupledZone[];
  ring: Point[];
  N: number;
  humanCount: number;
}

const RING_RADIUS = 74;

const combinedSystem: SceneRenderer<CoupledLayer> = {
  layout(group, trajectory) {
    const N = trajectory.meta.N;
    const humanCount = N - Number(trajectory.meta.params.nAi);
    const zones: CoupledZone[] = [
      {
        key: 'money',
        x0: 14,
        x1: 288,
        label: 'MONEY',
        caption: 'size = share of the money held',
        cx: 151,
        cy: 170,
        gauge: { x0: 34, x1: 268, y: 330 },
      },
      {
        key: 'attention',
        x0: 300,
        x1: 574,
        label: 'ATTENTION',
        caption: 'size = share of the audience · arrows = who each one listens to',
        cx: 437,
        cy: 170,
        gauge: { x0: 320, x1: 554, y: 330 },
      },
      {
        key: 'votes',
        x0: 586,
        x1: 860,
        label: 'VOTES',
        caption: 'size = share of the vote · arrows = who each one hands their vote to',
        cx: 723,
        cy: 170,
        gauge: { x0: 606, x1: 840, y: 330 },
      },
    ];

    // One ring, reused at every zone centre, so node i sits at the same clock
    // position in all three panels. The AI actors are the LAST indices, so an
    // index-ordered ring stacks all six into one arc where they collide into an
    // unreadable blob as their share grows — spread them evenly instead, which
    // also puts human circles either side of every AI square to compare against.
    const nAi = N - humanCount;
    const slot = new Int32Array(N);
    const taken = new Array<boolean>(N).fill(false);
    for (let j = 0; j < nAi; j += 1) {
      const s = Math.round((j * N) / nAi) % N;
      slot[humanCount + j] = s;
      taken[s] = true;
    }
    let free = 0;
    for (let i = 0; i < humanCount; i += 1) {
      while (taken[free]) free += 1;
      slot[i] = free;
      taken[free] = true;
    }
    const ring: Point[] = Array.from({ length: N }, (_, index) => {
      const angle = (slot[index] / N) * 2 * Math.PI - Math.PI / 2;
      return [RING_RADIUS * Math.cos(angle), RING_RADIUS * Math.sin(angle)];
    });

    zones.forEach((zone) => {
      svgElement(
        'rect',
        {
          x: zone.x0,
          y: 34,
          width: zone.x1 - zone.x0,
          height: 268,
          fill: ZONE_TINT,
          opacity: 0.45,
        },
        group
      );
      Sketch.text(group, zone.x0 + 8, 50, zone.label, { size: 9.5, color: LABEL, spacing: 1.2 });
      Sketch.text(group, zone.cx, 292, zone.caption, {
        size: 9,
        color: LABEL,
        hand: true,
        anchor: 'middle',
      });
      Sketch.plainLine(
        group,
        zone.gauge.x0,
        zone.gauge.y,
        zone.gauge.x1,
        zone.gauge.y,
        '#9aa2ab',
        1.3
      );
      Sketch.text(group, zone.cx, zone.gauge.y + 16, 'the people’s share', {
        size: 10.5,
        color: LABEL,
        hand: true,
        anchor: 'middle',
      });
    });

    Sketch.edge(group, zones[0].x1 - 30, 70, zones[1].x0 + 30, 70, {
      seed: 501,
      stroke: LABEL,
      width: 1.2,
      trim1: 2,
      trim2: 2,
    });
    Sketch.edge(group, zones[1].x1 - 30, 70, zones[2].x0 + 30, 70, {
      seed: 502,
      stroke: LABEL,
      width: 1.2,
      trim1: 2,
      trim2: 2,
    });
    Sketch.edge(group, zones[2].cx, 356, zones[0].cx, 356, {
      seed: 503,
      stroke: LABEL,
      width: 1.2,
      trim1: 2,
      trim2: 2,
    });
    Sketch.text(group, (zones[0].x1 + zones[1].x0) / 2, 60, 'advertising buys an audience', {
      size: 10.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    Sketch.text(group, (zones[1].x1 + zones[2].x0) / 2, 60, 'an audience attracts votes', {
      size: 10.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    Sketch.text(group, 440, 372, 'lobbying moves how strictly the tax is collected', {
      size: 10.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });

    // the reader has no other way to know which mark is which
    Sketch.circle(group, 26, 26, 5, { seed: 11, fill: '#ffffff', width: 1.2 });
    Sketch.text(group, 36, 30, 'person', { size: 10, color: LABEL, hand: true });
    svgElement('rect', { x: 88, y: 21, width: 10, height: 10, fill: INK, opacity: 0.82 }, group);
    Sketch.text(group, 104, 30, 'AI system', { size: 10, color: LABEL, hand: true });

    return { zones, ring, N, humanCount };
  },

  drawFrame(group, layer, trajectory, tick, fraction) {
    const { N, humanCount, ring, zones } = layer;
    const base = tick * N;

    /** Per-node share of a level field at this tick. `listen_influence` and
        `influence` already sum to one across all nodes; `wealth` is a level, so
        it is divided by its own total — the same distinction metrics.py draws. */
    const shareOf = (field: Float64Array, normalized: boolean) => {
      const out = new Float64Array(N);
      let total = 0;
      for (let i = 0; i < N; i += 1) total += Math.max(field[base + i], 0);
      for (let i = 0; i < N; i += 1) {
        out[i] = normalized
          ? field[base + i]
          : Math.max(field[base + i], 0) / Math.max(total, 1e-12);
      }
      return out;
    };

    const panels = [
      { share: shareOf(trajectory.node.wealth, false), links: null, gauge: 'human_income_share' },
      {
        share: shareOf(trajectory.node.listen_influence, true),
        links: trajectory.node.top_listen,
        gauge: 'human_attention_share',
      },
      {
        share: shareOf(trajectory.node.influence, true),
        links: trajectory.node.top_delegate,
        gauge: 'human_power_share',
      },
    ] as const;

    panels.forEach((panel, index) => {
      const zone = zones[index];
      const at = (i: number): Point => [zone.cx + ring[i][0], zone.cy + ring[i][1]];

      if (panel.links) {
        for (let i = 0; i < N; i += 1) {
          const target = panel.links[base + i];
          if (target < 0 || target >= N || target === i) continue;
          const [fx, fy] = at(i);
          const [tx, ty] = at(target);
          Sketch.packet(group, fx, fy, tx, ty, clip(fraction / 0.75, 0, 1), {
            size: 3.2,
            color: target >= humanCount ? ALERT_RED : INK,
            opacity: 0.75,
            rot: 9 + i * 7,
          });
        }
      }

      for (let i = 0; i < N; i += 1) {
        const [x, y] = at(i);
        // capped just under the ring's node spacing, so a dominant actor grows
        // until it fills its slot and then stops rather than swallowing its
        // neighbours — the exact share is on the gauge and the metric cards
        const radius = Math.min(2.4 + 28 * Math.sqrt(clip(panel.share[i], 0, 1)), 12);
        if (i >= humanCount) {
          svgElement(
            'rect',
            {
              x: x - radius * 0.75,
              y: y - radius * 0.75,
              width: radius * 1.5,
              height: radius * 1.5,
              fill: INK,
              opacity: 0.82,
            },
            group
          );
          Sketch.square(group, x, y, radius * 2, { seed: 900 + i, width: 1.2 });
        } else {
          Sketch.circle(group, x, y, radius, { seed: 40 + i, fill: '#ffffff', width: 1.2 });
        }
      }

      const humanShare = trajectory.global[panel.gauge][tick];
      const markerX = zone.gauge.x0 + clip(humanShare, 0, 1) * (zone.gauge.x1 - zone.gauge.x0);
      svgElement(
        'path',
        {
          d: `M${markerX - 5} ${zone.gauge.y - 11} L${markerX + 5} ${zone.gauge.y - 11} L${markerX} ${
            zone.gauge.y - 3
          } Z`,
          fill: NAVY,
        },
        group
      );
      Sketch.text(group, markerX, zone.gauge.y - 16, `${Math.round(humanShare * 100)}%`, {
        size: 11.5,
        color: NAVY,
        hand: true,
        anchor: 'middle',
      });
    });

    // Each packet between zones is driven by the engine's own channel-magnitude
    // series (experiments/gd_bundles/derived.py), which already carry their
    // dial — a sealed channel is exactly zero here and the view never
    // multiplies by a parameter itself. The saturating map is presentation
    // only: a bounded reading of an unbounded flow, not a claim about its size.
    const saturate = (value: number, scale: number) => value / (value + scale);
    const pullAi = trajectory.global.ballot_pull_ai[tick];
    const pullTotal = pullAi + trajectory.global.ballot_pull_human[tick];
    const netPressure =
      trajectory.global.lobby_pressure_human[tick] + trajectory.global.lobby_pressure_ai[tick];
    const drives = [
      {
        from: [zones[0].x1 - 30, 70] as Point,
        to: [zones[1].x0 + 30, 70] as Point,
        value: saturate(trajectory.global.bought_reach_ai[tick], 20),
        color: ALERT_RED,
      },
      {
        from: [zones[1].x1 - 30, 70] as Point,
        to: [zones[2].x0 + 30, 70] as Point,
        value: pullTotal > 1e-9 ? pullAi / pullTotal : 0,
        color: ALERT_RED,
      },
      {
        from: [zones[2].cx, 356] as Point,
        to: [zones[0].cx, 356] as Point,
        value: saturate(Math.abs(netPressure), 0.006),
        color: netPressure < 0 ? ALERT_RED : NAVY,
      },
    ];
    drives.forEach((drive) => {
      if (drive.value < 0.02) return;
      Sketch.packet(group, drive.from[0], drive.from[1], drive.to[0], drive.to[1], fraction, {
        size: 4 + 8 * clip(drive.value, 0, 1),
        color: drive.color,
        opacity: 0.85,
        rot: 11,
      });
    });

    Sketch.text(
      group,
      852,
      26,
      `the connections cost the people ${Math.max(
        0,
        Math.round(trajectory.global.transfer_gap[tick] * 100)
      )} points`,
      { size: 12, color: NAVY, hand: true, anchor: 'end' }
    );
  },
};

export const scenarioScenes: ScenarioSceneCatalog = {
  economy: [
    { key: 'messages', label: 'Messages', renderer: economyMessages },
    { key: 'shares', label: 'Shares', renderer: economyShares },
  ],
  // WP3's delegation matrix has the same shape as WP2's listening matrix, so
  // it reuses the same two renderers; they read trajectory.meta.gameId to
  // label what the arrows actually mean in each model
  politics: [
    { key: 'system', label: 'System', renderer: politicalRing },
    { key: 'lorenz', label: 'Concentration', renderer: politicalLorenz },
  ],
  culture: [
    { key: 'system', label: 'System', renderer: politicalRing },
    { key: 'lorenz', label: 'Concentration', renderer: politicalLorenz },
  ],
  combined: [{ key: 'system', label: 'System', renderer: combinedSystem }],
};
