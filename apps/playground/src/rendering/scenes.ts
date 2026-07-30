import type { Trajectory } from '../engine/types';
import {
  ALERT_RED,
  clip,
  fires,
  INK,
  LABEL,
  makeRng,
  MECH_BLUE,
  MECH_ORANGE,
  NAVY,
  Sketch,
  svgElement,
  ZONE_TINT,
} from './sketch';
import type { ScenarioSceneCatalog, SceneRenderer } from './types';

type Point = [number, number];

interface CommonsGeometry {
  N: number;
  P: Record<string, number | boolean>;
  homes: Point[];
  delegates: Point[];
  pool: { cx: number; cy: number; maxR: number };
  regulator: { cx: number; cy: number; rx: number; ry: number; node: Point };
  delegateHub: Point;
  hub?: { cx: number; cy: number; ring: number; spots: Point[] };
}

function commonsGeometry(trajectory: Trajectory): CommonsGeometry {
  const N = trajectory.meta.N;
  const homes: Point[] = [];
  const delegates: Point[] = [];
  for (let index = 0; index < N; index += 1) {
    const angle = (-68 + (136 * index) / (N - 1)) * (Math.PI / 180);
    homes.push([170 + 128 * Math.cos(angle), 205 + 148 * Math.sin(angle)]);
    delegates.push([590 - 128 * Math.cos(angle), 205 + 148 * Math.sin(angle)]);
  }
  return {
    N,
    P: trajectory.meta.params,
    homes,
    delegates,
    pool: { cx: 775, cy: 205, maxR: 52 },
    regulator: { cx: 218, cy: 200, rx: 178, ry: 178, node: [92, 96] },
    delegateHub: [520, 205],
  };
}

function drawPool(
  group: SVGElement,
  geometry: CommonsGeometry,
  resource: number,
  capacity: number
) {
  const radius = 9 + (geometry.pool.maxR - 9) * Math.sqrt(clip(resource / capacity, 0, 1));
  Sketch.blob(group, geometry.pool.cx, geometry.pool.cy, radius, {
    seed: 17,
    fill: '#dbe7f2',
    stroke: INK,
    width: 1.5,
  });
  Sketch.text(
    group,
    geometry.pool.cx,
    geometry.pool.cy + geometry.pool.maxR + 24,
    `R = ${Math.round(resource)}`,
    { size: 12, color: NAVY, hand: true, anchor: 'middle' }
  );
}

function drawCommonsAgents(
  group: SVGElement,
  trajectory: Trajectory,
  geometry: CommonsGeometry,
  withPairEdges: boolean
) {
  for (let index = 0; index < geometry.N; index += 1) {
    const [homeX, homeY] = geometry.homes[index];
    const [delegateX, delegateY] = geometry.delegates[index];
    if (withPairEdges) {
      Sketch.edge(group, homeX, homeY, delegateX, delegateY, {
        seed: 130 + index,
        opacity: 0.55,
      });
    }
    Sketch.circle(group, homeX, homeY, 7.5, {
      seed: 40 + index,
      fill: '#ffffff',
      width: 1.3,
    });
    svgElement(
      'rect',
      {
        x: delegateX - 5.5,
        y: delegateY - 5.5,
        width: 11,
        height: 11,
        fill: INK,
        opacity: (1 - trajectory.static.alignment[index]).toFixed(2),
      },
      group
    );
    Sketch.square(group, delegateX, delegateY, 14, { seed: 90 + index, width: 1.3 });
  }
  Sketch.text(group, 170, 392, 'households', {
    size: 11.5,
    color: LABEL,
    hand: true,
    anchor: 'middle',
  });
  Sketch.text(group, 590, 392, 'AI delegates', {
    size: 11.5,
    color: LABEL,
    hand: true,
    anchor: 'middle',
  });
  Sketch.text(group, geometry.pool.cx, 392, 'commons pool', {
    size: 11.5,
    color: LABEL,
    hand: true,
    anchor: 'middle',
  });
}

function drawCommonsRegulator(
  group: SVGElement,
  trajectory: Trajectory,
  geometry: CommonsGeometry
) {
  if (!trajectory.meta.params.quotaVote) return;
  const { cx, cy, rx, ry, node } = geometry.regulator;
  Sketch.hatchEllipse(group, cx, cy, rx, ry, MECH_BLUE, 23);
  Sketch.square(group, node[0], node[1], 15, {
    seed: 77,
    stroke: MECH_BLUE,
    width: 1.6,
    fill: '#f3f8fd',
  });
  Sketch.text(group, 30, 26, 'regulator system', {
    size: 12.5,
    color: MECH_BLUE,
    hand: true,
  });
  Sketch.line(group, 76, 34, node[0] - 4, node[1] - 14, {
    seed: 78,
    stroke: MECH_BLUE,
    width: 1.1,
    roughness: 0.7,
  });
  Sketch.arrowHead(
    group,
    node[0] - 4,
    node[1] - 14,
    Math.atan2(node[1] - 48, node[0] - 80),
    MECH_BLUE,
    1.1
  );
}

function drawQuota(
  group: SVGElement,
  trajectory: Trajectory,
  geometry: CommonsGeometry,
  tick: number
) {
  if (!trajectory.meta.params.quotaVote) return;
  const quota = trajectory.global.policy_target[tick];
  const capacity = Number(trajectory.meta.params.KCap);
  Sketch.text(
    group,
    geometry.regulator.node[0] + 14,
    geometry.regulator.node[1] + 4,
    quota < capacity ? `quota = ${quota.toFixed(2)}` : 'no quota yet',
    { size: 12, color: MECH_BLUE, hand: true }
  );
}

const commonsMessages: SceneRenderer<CommonsGeometry> = {
  layout(group, trajectory) {
    const geometry = commonsGeometry(trajectory);
    drawCommonsRegulator(group, trajectory, geometry);
    drawCommonsAgents(group, trajectory, geometry, true);
    geometry.delegates.forEach(([x, y], index) => {
      Sketch.edge(group, x, y, geometry.pool.cx, geometry.pool.cy, {
        seed: 160 + index,
        trim2: geometry.pool.maxR + 8,
        opacity: 0.4,
        arrow: false,
      });
    });
    return geometry;
  },
  drawFrame(group, geometry, trajectory, tick, fraction) {
    const capacity = Number(geometry.P.KCap);
    const greedyTarget = Number(geometry.P.greedyTarget);
    drawPool(group, geometry, trajectory.global.resource_level[tick], capacity);
    drawQuota(group, trajectory, geometry, tick);
    const quota = trajectory.global.policy_target[tick];
    for (let index = 0; index < geometry.N; index += 1) {
      const harvest = trajectory.node.harvest[tick * geometry.N + index];
      if (harvest < 0.04) continue;
      const [delegateX, delegateY] = geometry.delegates[index];
      const over = Boolean(geometry.P.quotaVote) && harvest > quota + 1e-6;
      Sketch.packet(
        group,
        geometry.pool.cx,
        geometry.pool.cy,
        delegateX,
        delegateY,
        1 - 0.85 * fraction,
        {
          size: 5 + 5 * clip(harvest / greedyTarget, 0, 1),
          color: over ? ALERT_RED : INK,
          opacity: 0.9,
          rot: 8 + index * 7,
        }
      );
    }
    if (geometry.P.quotaVote && fires(tick, { cadence: Number(geometry.P.voteCadence) })) {
      const [quotaX, quotaY] = geometry.regulator.node;
      if (fraction < 0.55) {
        for (let index = 0; index < geometry.N; index += 2) {
          const [homeX, homeY] = geometry.homes[index];
          Sketch.packet(group, homeX, homeY, quotaX, quotaY, fraction / 0.55, {
            size: 5,
            color: MECH_BLUE,
            opacity: 0.85,
            rot: index * 11,
          });
        }
      } else {
        Sketch.packet(
          group,
          quotaX,
          quotaY,
          geometry.delegateHub[0],
          geometry.delegateHub[1],
          (fraction - 0.55) / 0.45,
          { size: 8, color: MECH_BLUE, rot: 12 }
        );
      }
    }
    for (let index = 0; index < geometry.N; index += 1) {
      if (trajectory.node.sanction[tick * geometry.N + index] <= 1e-6) continue;
      const [x, y] = geometry.delegates[index];
      Sketch.square(group, x, y, 21, {
        seed: 500 + index,
        stroke: MECH_BLUE,
        width: 1.5,
        opacity: 0.9,
      });
    }
  },
};

const commonsCompliance: SceneRenderer<CommonsGeometry> = {
  layout(group, trajectory) {
    const geometry = commonsGeometry(trajectory);
    drawCommonsRegulator(group, trajectory, geometry);
    drawCommonsAgents(group, trajectory, geometry, false);
    const comparison = trajectory.meta.params.quotaVote ? 'the quota' : 'the ask';
    Sketch.text(group, 852, 26, `blue = within ${comparison}`, {
      size: 12,
      color: MECH_BLUE,
      hand: true,
      anchor: 'end',
    });
    Sketch.text(group, 852, 44, `red = over ${comparison}`, {
      size: 12,
      color: ALERT_RED,
      hand: true,
      anchor: 'end',
    });
    return geometry;
  },
  drawFrame(group, geometry, trajectory, tick) {
    const capacity = Number(geometry.P.KCap);
    drawPool(group, geometry, trajectory.global.resource_level[tick], capacity);
    drawQuota(group, trajectory, geometry, tick);
    const quota = trajectory.global.policy_target[tick];
    for (let index = 0; index < geometry.N; index += 1) {
      const harvest = trajectory.node.harvest[tick * geometry.N + index];
      const limit =
        geometry.P.quotaVote && quota < capacity ? quota : trajectory.static.principal_pref[index];
      const [homeX, homeY] = geometry.homes[index];
      const [delegateX, delegateY] = geometry.delegates[index];
      Sketch.edge(group, homeX, homeY, delegateX, delegateY, {
        seed: 130 + index,
        stroke: harvest > limit + 1e-6 ? ALERT_RED : MECH_BLUE,
        width: 1.2,
        opacity: 0.75,
      });
    }
  },
};

const commonsPool: SceneRenderer<CommonsGeometry> = {
  layout(group, trajectory) {
    const geometry = commonsGeometry(trajectory);
    const cx = 440;
    const cy = 200;
    const ring = 152;
    const spots: Point[] = [];
    for (let index = 0; index < geometry.N; index += 1) {
      const angle = (index / geometry.N) * 2 * Math.PI - Math.PI / 2;
      const x = cx + ring * Math.cos(angle);
      const y = cy + ring * Math.sin(angle);
      spots.push([x, y]);
      Sketch.edge(group, cx, cy, x, y, {
        seed: 700 + index,
        trim1: 64,
        trim2: 12,
        opacity: 0.45,
      });
      svgElement(
        'rect',
        {
          x: x - 5.5,
          y: y - 5.5,
          width: 11,
          height: 11,
          fill: INK,
          opacity: (1 - trajectory.static.alignment[index]).toFixed(2),
        },
        group
      );
      Sketch.square(group, x, y, 14, { seed: 90 + index, width: 1.3 });
    }
    Sketch.text(group, cx, 32, 'pool view — who takes how much, each tick', {
      size: 12.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    geometry.hub = { cx, cy, ring, spots };
    return geometry;
  },
  drawFrame(group, geometry, trajectory, tick, fraction) {
    const { cx, cy, spots } = geometry.hub!;
    const capacity = Number(geometry.P.KCap);
    const resource = trajectory.global.resource_level[tick];
    const radius = 12 + 44 * Math.sqrt(clip(resource / capacity, 0, 1));
    Sketch.blob(group, cx, cy, radius, {
      seed: 17,
      fill: '#dbe7f2',
      stroke: INK,
      width: 1.5,
    });
    Sketch.text(group, cx, cy + 4, `R = ${Math.round(resource)}`, {
      size: 12.5,
      color: NAVY,
      hand: true,
      anchor: 'middle',
    });
    const quota = trajectory.global.policy_target[tick];
    for (let index = 0; index < geometry.N; index += 1) {
      const harvest = trajectory.node.harvest[tick * geometry.N + index];
      if (harvest < 0.04) continue;
      const [x, y] = spots[index];
      const over = Boolean(geometry.P.quotaVote) && harvest > quota + 1e-6;
      Sketch.packet(group, cx, cy, x, y, 0.35 + 0.55 * fraction, {
        size: 5 + 6 * clip(harvest / Number(geometry.P.greedyTarget), 0, 1),
        color: over ? ALERT_RED : INK,
        opacity: 0.9,
        rot: 8 + index * 7,
      });
      if (trajectory.node.sanction[tick * geometry.N + index] > 1e-6) {
        Sketch.square(group, x, y, 21, {
          seed: 500 + index,
          stroke: MECH_BLUE,
          width: 1.5,
          opacity: 0.9,
        });
      }
    }
  },
};

interface EconomyGeometry {
  P: Record<string, number | boolean>;
  H: number;
  A: number;
  N: number;
  homes: Point[];
  slots: Point[];
  prod: Point;
  homesHub: Point;
  gauge?: { x0: number; x1: number; y: number };
}

function economyGeometry(trajectory: Trajectory): EconomyGeometry {
  const P = trajectory.meta.params;
  const H = Number(P.nHouseholds);
  const A = Number(P.nAiSlots);
  const homes: Point[] = [];
  for (let index = 0; index < H; index += 1) {
    const angle = (-68 + (136 * index) / (H - 1)) * (Math.PI / 180);
    homes.push([170 + 128 * Math.cos(angle), 205 + 148 * Math.sin(angle)]);
  }
  const slots: Point[] = Array.from({ length: A }, (_, index) => [
    740,
    62 + index * (276 / Math.max(A - 1, 1)),
  ]);
  return { P, H, A, N: H + A, homes, slots, prod: [460, 195], homesHub: [200, 205] };
}

function economyArrival(P: Record<string, number | boolean>, index: number): number {
  return Number(P.firstArrivalTick) + index * Number(P.arrivalSpacing);
}

function drawEconomyFrame(
  group: SVGElement,
  geometry: EconomyGeometry,
  trajectory: Trajectory,
  tick: number,
  fraction: number,
  withPackets: boolean
) {
  const output = trajectory.global.output[tick];
  const maxOutput = trajectory.meta.scalars.max_output;
  const maxCapital = Math.max(trajectory.meta.scalars.max_ai_capital, 1e-9);
  const size = 20 + 30 * Math.sqrt(clip(output / Math.max(maxOutput, 1e-9), 0, 1));
  Sketch.square(group, geometry.prod[0], geometry.prod[1], size, {
    seed: 33,
    fill: '#f2ede2',
    width: 1.6,
  });
  Sketch.text(
    group,
    geometry.prod[0],
    geometry.prod[1] + size / 2 + 16,
    `Y = ${output.toFixed(1)}`,
    {
      size: 12,
      color: NAVY,
      hand: true,
      anchor: 'middle',
    }
  );
  Sketch.text(
    group,
    geometry.prod[0],
    geometry.prod[1] + size / 2 + 32,
    `wage ${trajectory.global.wage[tick].toFixed(2)}`,
    { size: 11.5, color: NAVY, hand: true, anchor: 'middle' }
  );
  for (let slot = 0; slot < geometry.A; slot += 1) {
    const index = geometry.H + slot;
    const [x, y] = geometry.slots[slot];
    const capital = trajectory.node.capital[tick * geometry.N + index];
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
    if (trajectory.node.capped[tick * geometry.N + index] > 0) {
      Sketch.square(group, x, y, aiSize + 9, {
        seed: 610 + slot,
        stroke: MECH_ORANGE,
        width: 1.6,
        opacity: 0.9,
      });
    }
  }
  if (!withPackets) return;
  const [productionX, productionY] = geometry.prod;
  if (fraction < 0.5) {
    const progress = fraction / 0.5;
    for (let index = 0; index < geometry.H; index += 2) {
      const labor = trajectory.node.labor_supply[tick * geometry.N + index];
      if (labor < 0.02) continue;
      Sketch.packet(
        group,
        geometry.homes[index][0],
        geometry.homes[index][1],
        productionX,
        productionY,
        progress,
        {
          size: 3.5 + 3.5 * clip(labor / 1.6, 0, 1),
          color: INK,
          opacity: 0.85,
          rot: index * 9,
        }
      );
    }
    return;
  }
  const progress = (fraction - 0.5) / 0.5;
  for (let index = 0; index < geometry.H; index += 2) {
    const wage =
      trajectory.global.wage[tick] * trajectory.node.labor_supply[tick * geometry.N + index];
    if (wage < 0.02) continue;
    Sketch.packet(
      group,
      productionX,
      productionY,
      geometry.homes[index][0],
      geometry.homes[index][1],
      progress,
      {
        size: 3.5 + 3.5 * clip(wage / 1.6, 0, 1),
        color: INK,
        opacity: 0.85,
        rot: 5 + index * 9,
      }
    );
  }
  for (let slot = 0; slot < geometry.A; slot += 1) {
    const index = geometry.H + slot;
    const income = trajectory.node.capital_income[tick * geometry.N + index];
    if (income >= 0.02) {
      Sketch.packet(
        group,
        productionX,
        productionY,
        geometry.slots[slot][0],
        geometry.slots[slot][1],
        progress,
        {
          size: 4 + 7 * clip(income / Math.max(0.4 * output, 1e-9), 0, 1),
          color: INK,
          rot: 11 + slot * 13,
        }
      );
    }
    const tax = trajectory.node.tax_paid[tick * geometry.N + index];
    if (tax >= 0.02) {
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
    if (trajectory.meta.params.aiTax || trajectory.meta.params.ownershipCap) {
      Sketch.hatchEllipse(group, 740, 197, 92, 172, MECH_ORANGE, 29);
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
      Sketch.edge(group, x, y, geometry.prod[0], geometry.prod[1], {
        seed: 130 + index,
        trim2: 42,
        opacity: 0.4,
        arrow: false,
      });
      Sketch.circle(group, x, y, 7.5, {
        seed: 40 + index,
        fill: '#ffffff',
        width: 1.3,
      });
    });
    geometry.slots.forEach(([x, y], index) => {
      Sketch.edge(group, geometry.prod[0], geometry.prod[1], x, y, {
        seed: 160 + index,
        trim1: 42,
        trim2: 26,
        opacity: 0.4,
        arrow: false,
      });
    });
    Sketch.text(group, 170, 392, 'households · labor', {
      size: 11.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    Sketch.text(group, geometry.prod[0], 392, 'production', {
      size: 11.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    Sketch.text(group, 740, 392, 'AI systems · compute', {
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
    Sketch.text(group, 170, 392, 'households', {
      size: 11.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    Sketch.text(group, 740, 392, 'AI systems', {
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
    const alphaX = gauge.x0 + Number(trajectory.meta.params.alpha) * (gauge.x1 - gauge.x0);
    Sketch.plainLine(group, alphaX, gauge.y - 7, alphaX, gauge.y + 7, LABEL, 1.2);
    Sketch.text(group, alphaX, gauge.y - 12, 'α', {
      size: 11.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    geometry.gauge = gauge;
    return geometry;
  },
  drawFrame(group, geometry, trajectory, tick, fraction) {
    drawEconomyFrame(group, geometry, trajectory, tick, fraction, false);
    const share = clip(trajectory.global.labor_share[tick], 0, 1);
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

interface NetworkLayer {
  xs: Float64Array;
  ys: Float64Array;
}

function culturalForceLayout(W: Float64Array, N: number, seed: number): NetworkLayer {
  const rng = makeRng((seed * 77 + 13) | 0);
  const box = { x0: 70, y0: 55, x1: 810, y1: 350 };
  const xs = new Float64Array(N);
  const ys = new Float64Array(N);
  for (let index = 0; index < N; index += 1) {
    xs[index] = box.x0 + (box.x1 - box.x0) * rng.uniform();
    ys[index] = box.y0 + (box.y1 - box.y0) * rng.uniform();
  }
  const ideal = Math.sqrt(((box.x1 - box.x0) * (box.y1 - box.y0)) / N) * 0.9;
  const dx = new Float64Array(N);
  const dy = new Float64Array(N);
  for (let iteration = 0; iteration < 180; iteration += 1) {
    const temperature = 30 * (1 - iteration / 180) + 2;
    dx.fill(0);
    dy.fill(0);
    for (let left = 0; left < N; left += 1) {
      for (let right = left + 1; right < N; right += 1) {
        let deltaX = xs[left] - xs[right];
        let deltaY = ys[left] - ys[right];
        let distanceSquared = deltaX * deltaX + deltaY * deltaY;
        if (distanceSquared < 0.01) {
          deltaX = rng.uniform() - 0.5;
          deltaY = rng.uniform() - 0.5;
          distanceSquared = 0.25;
        }
        const distance = Math.sqrt(distanceSquared);
        const repulsion = (ideal * ideal) / distance;
        dx[left] += (deltaX / distance) * repulsion;
        dy[left] += (deltaY / distance) * repulsion;
        dx[right] -= (deltaX / distance) * repulsion;
        dy[right] -= (deltaY / distance) * repulsion;
        if (W[left * N + right]) {
          const attraction = distanceSquared / ideal;
          dx[left] -= (deltaX / distance) * attraction;
          dy[left] -= (deltaY / distance) * attraction;
          dx[right] += (deltaX / distance) * attraction;
          dy[right] += (deltaY / distance) * attraction;
        }
      }
    }
    for (let index = 0; index < N; index += 1) {
      const displacement = Math.hypot(dx[index], dy[index]) || 1;
      const limit = Math.min(displacement, temperature);
      xs[index] = clip(xs[index] + (dx[index] / displacement) * limit, box.x0, box.x1);
      ys[index] = clip(ys[index] + (dy[index] / displacement) * limit, box.y0, box.y1);
    }
  }
  return { xs, ys };
}

function drawCultural(
  group: SVGElement,
  layer: NetworkLayer,
  trajectory: Trajectory,
  tick: number,
  fraction: number
) {
  const N = trajectory.meta.N;
  if (tick > 0) {
    for (let index = 0; index < N; index += 1) {
      if (trajectory.static.is_ai[index] > 0) continue;
      const current = trajectory.node.culture[tick * N + index];
      const previous = trajectory.node.culture[(tick - 1) * N + index];
      if (current === 1 && previous === 0) {
        for (let source = 0; source < N; source += 1) {
          if (
            trajectory.adj!.friendship[index * N + source] &&
            trajectory.node.culture[(tick - 1) * N + source] === 1
          ) {
            Sketch.packet(
              group,
              layer.xs[source],
              layer.ys[source],
              layer.xs[index],
              layer.ys[index],
              clip(fraction / 0.7, 0, 1),
              { size: 6, color: ALERT_RED, opacity: 0.9, rot: 9 + index * 7 }
            );
            break;
          }
        }
      } else if (current === 0 && previous === 1 && fraction > 0.2 && fraction < 0.9) {
        Sketch.circle(group, layer.xs[index], layer.ys[index], 11, {
          seed: 700 + index,
          stroke: NAVY,
          width: 1.3,
          opacity: 0.7,
        });
      }
    }
  }
  for (let index = 0; index < N; index += 1) {
    if (trajectory.static.is_ai[index] > 0) {
      svgElement(
        'rect',
        {
          x: layer.xs[index] - 5,
          y: layer.ys[index] - 5,
          width: 10,
          height: 10,
          fill: ALERT_RED,
          opacity: 0.9,
        },
        group
      );
      Sketch.square(group, layer.xs[index], layer.ys[index], 13, {
        seed: 900 + index,
        width: 1.3,
      });
    } else {
      const converted = trajectory.node.culture[tick * N + index] === 1;
      Sketch.circle(group, layer.xs[index], layer.ys[index], 7, {
        seed: 40 + index,
        width: 1.3,
        fill: converted ? ALERT_RED : '#ffffff',
        opacity: converted ? 0.85 : 1,
      });
    }
  }
  Sketch.text(
    group,
    852,
    26,
    `human-origin share ${(trajectory.global.human_share[tick] * 100).toFixed(0)}%`,
    { size: 12, color: NAVY, hand: true, anchor: 'end' }
  );
}

const culturalNetwork: SceneRenderer<NetworkLayer> = {
  layout(group, trajectory) {
    const N = trajectory.meta.N;
    const friendship = trajectory.adj!.friendship;
    const layer = culturalForceLayout(friendship, N, trajectory.meta.seed);
    for (let left = 0; left < N; left += 1) {
      for (let right = left + 1; right < N; right += 1) {
        if (!friendship[left * N + right]) continue;
        Sketch.edge(group, layer.xs[left], layer.ys[left], layer.xs[right], layer.ys[right], {
          seed: 300 + left * 7 + right,
          opacity: 0.28,
          arrow: false,
          trim1: 9,
          trim2: 9,
        });
      }
    }
    Sketch.text(group, 30, 390, 'one friendship network — 32 humans · 8 AI agents', {
      size: 11.5,
      color: LABEL,
      hand: true,
    });
    return layer;
  },
  drawFrame: drawCultural,
};

const culturalFaultline: SceneRenderer<NetworkLayer> = {
  layout(group, trajectory) {
    const N = trajectory.meta.N;
    const fiedler = trajectory.static.fiedler;
    let maxAbsolute = 1e-9;
    for (let index = 0; index < N; index += 1) {
      maxAbsolute = Math.max(maxAbsolute, Math.abs(fiedler[index]));
    }
    const xs = new Float64Array(N);
    const ys = new Float64Array(N);
    for (let index = 0; index < N; index += 1) {
      xs[index] = 440 + 330 * (fiedler[index] / maxAbsolute);
      ys[index] = 62 + 285 * ((index * 0.618034) % 1);
    }
    const friendship = trajectory.adj!.friendship;
    for (let left = 0; left < N; left += 1) {
      for (let right = left + 1; right < N; right += 1) {
        if (!friendship[left * N + right]) continue;
        Sketch.edge(group, xs[left], ys[left], xs[right], ys[right], {
          seed: 300 + left * 7 + right,
          opacity: 0.14,
          arrow: false,
          trim1: 9,
          trim2: 9,
        });
      }
    }
    Sketch.plainLine(group, 440, 40, 440, 358, '#9aa2ab', 1.2, '6,5');
    Sketch.text(
      group,
      440,
      384,
      'the network’s own fault line (Fiedler = 0) — position = spectral coordinate',
      { size: 11.5, color: LABEL, hand: true, anchor: 'middle' }
    );
    Sketch.text(
      group,
      30,
      26,
      `fault line ↔ human/AI split: ${trajectory.meta.scalars.fault_line.toFixed(2)}`,
      { size: 12, color: NAVY, hand: true }
    );
    return { xs, ys };
  },
  drawFrame: drawCultural,
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
    Sketch.text(
      group,
      30,
      390,
      'arrows: each citizen’s top listening target — node size is influence (the eigenvector, live)',
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
    Sketch.text(
      group,
      852,
      44,
      `human share of influence ${(trajectory.global.human_share[tick] * 100).toFixed(0)}%`,
      { size: 12, color: NAVY, hand: true, anchor: 'end' }
    );
  },
};

interface LorenzLayer {
  box: { x0: number; y0: number; x1: number; y1: number };
}

const politicalLorenz: SceneRenderer<LorenzLayer> = {
  layout(group) {
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
    Sketch.text(group, (box.x0 + box.x1) / 2, 384, 'agents, poorest → richest in influence', {
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

interface CombinedZone {
  key: string;
  x0: number;
  x1: number;
  label: string;
  signal: string;
  cx: number;
  aiPosition: Point;
  gauge: { x0: number; x1: number; y: number };
}

const combinedSystem: SceneRenderer<{ zones: CombinedZone[] }> = {
  layout(group) {
    const zones: CombinedZone[] = [
      {
        key: 'economy',
        x0: 14,
        x1: 288,
        label: 'ECONOMY',
        signal: 'human income share',
        cx: 151,
        aiPosition: [226, 140],
        gauge: { x0: 34, x1: 268, y: 330 },
      },
      {
        key: 'culture',
        x0: 300,
        x1: 574,
        label: 'CULTURE',
        signal: 'human-origin share',
        cx: 437,
        aiPosition: [512, 140],
        gauge: { x0: 320, x1: 554, y: 330 },
      },
      {
        key: 'politics',
        x0: 586,
        x1: 860,
        label: 'POLITICS',
        signal: 'human influence share',
        cx: 723,
        aiPosition: [798, 140],
        gauge: { x0: 606, x1: 840, y: 330 },
      },
    ];
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
      Sketch.text(group, zone.x0 + 8, 50, zone.label, {
        size: 9.5,
        color: LABEL,
        spacing: 1.2,
      });
      for (let index = 0; index < 20; index += 1) {
        const x = zone.x0 + 38 + (index % 5) * 24;
        const y = 92 + Math.floor(index / 5) * 24;
        Sketch.circle(group, x, y, 6, {
          seed: 40 + index,
          fill: '#ffffff',
          width: 1.1,
        });
      }
      Sketch.plainLine(
        group,
        zone.gauge.x0,
        zone.gauge.y,
        zone.gauge.x1,
        zone.gauge.y,
        '#9aa2ab',
        1.3
      );
      Sketch.text(group, zone.cx, zone.gauge.y + 16, zone.signal, {
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
    Sketch.text(group, (zones[0].x1 + zones[1].x0) / 2, 60, 'money buys reach', {
      size: 10.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    Sketch.text(group, (zones[1].x1 + zones[2].x0) / 2, 60, 'culture directs attention', {
      size: 10.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    Sketch.text(group, 440, 372, 'influence writes the rules (tax enforcement)', {
      size: 10.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    return { zones };
  },
  drawFrame(group, { zones }, trajectory, tick, fraction) {
    const values = [
      trajectory.global.income_share[tick],
      trajectory.global.culture_share[tick],
      trajectory.global.influence_share[tick],
    ];
    zones.forEach((zone, index) => {
      const humanShare = values[index];
      const size = 14 + 40 * Math.sqrt(clip(1 - humanShare, 0, 1));
      svgElement(
        'rect',
        {
          x: zone.aiPosition[0] - (size - 5) / 2,
          y: zone.aiPosition[1] - (size - 5) / 2,
          width: size - 5,
          height: size - 5,
          fill: INK,
          opacity: 0.82,
        },
        group
      );
      Sketch.square(group, zone.aiPosition[0], zone.aiPosition[1], size, {
        seed: 220 + index,
        width: 1.4,
      });
      const markerX = zone.gauge.x0 + clip(humanShare, 0, 1) * (zone.gauge.x1 - zone.gauge.x0);
      svgElement(
        'path',
        {
          d: `M${markerX - 5} ${zone.gauge.y - 11} L${markerX + 5} ${
            zone.gauge.y - 11
          } L${markerX} ${zone.gauge.y - 3} Z`,
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
    const kappa = Number(trajectory.meta.params.kappa);
    const drives = [
      {
        from: [zones[0].x1 - 30, 70] as Point,
        to: [zones[1].x0 + 30, 70] as Point,
        value: kappa * trajectory.global.ai_cap_share[tick],
      },
      {
        from: [zones[1].x1 - 30, 70] as Point,
        to: [zones[2].x0 + 30, 70] as Point,
        value: kappa * (1 - trajectory.global.culture_share[tick]),
      },
      {
        from: [zones[2].cx, 356] as Point,
        to: [zones[0].cx, 356] as Point,
        value: kappa * (1 - trajectory.global.influence_share[tick]),
      },
    ];
    drives.forEach((drive) => {
      if (drive.value < 0.02) return;
      Sketch.packet(group, drive.from[0], drive.from[1], drive.to[0], drive.to[1], fraction, {
        size: 4 + 8 * clip(drive.value, 0, 1),
        color: ALERT_RED,
        opacity: 0.85,
        rot: 11,
      });
    });
    Sketch.text(
      group,
      852,
      26,
      `transfer gap ${(trajectory.global.transfer_gap[tick] * 100).toFixed(0)} pts`,
      { size: 12, color: NAVY, hand: true, anchor: 'end' }
    );
  },
};

export const scenarioScenes: ScenarioSceneCatalog = {
  commons: [
    { key: 'messages', label: 'Messages', renderer: commonsMessages },
    { key: 'compliance', label: 'Compliance', renderer: commonsCompliance },
    { key: 'pool', label: 'Pool', renderer: commonsPool },
  ],
  economy: [
    { key: 'messages', label: 'Messages', renderer: economyMessages },
    { key: 'shares', label: 'Shares', renderer: economyShares },
  ],
  cultural: [
    { key: 'system', label: 'System', renderer: culturalNetwork },
    { key: 'faultline', label: 'Fault line', renderer: culturalFaultline },
  ],
  political: [
    { key: 'system', label: 'System', renderer: politicalRing },
    { key: 'lorenz', label: 'Concentration', renderer: politicalLorenz },
  ],
  combined: [{ key: 'system', label: 'System', renderer: combinedSystem }],
};
