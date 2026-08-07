import type { Trajectory } from '../../engine/types';
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
} from '../../rendering/sketch';
import { deriveEdgeSet, scatter } from './layout';
import type { ActiveLink, NetworkAdapter, NetworkNode, PacketSpec } from './network';

/** Honest-data ground rules for every adapter in this file: positions are a
    seeded scatter (presentation); everything that MOVES is driven by a real
    per-tick engine series, never multiplied by a parameter. Persistent edges
    are each node's most frequent targets across the run — the captions say
    so. A sealed dial produces zero packets because the engine series is zero. */

const HUMAN_REGION = { x0: 70, y0: 70, x1: 560, y1: 330 };
const AI_REGION = { x0: 630, y0: 80, x1: 830, y1: 310 };

const at = (node: NetworkNode): [number, number] => [node.x, node.y];

/** Continuous packet motion: one edge crossing every FLOW_SPAN ticks, with a
    per-packet phase offset so traffic never moves in lockstep. Routes and
    sizes stay per-tick data; only the motion is smoothed across ticks.
    Without this every packet swept its whole edge once per tick, which at
    playback speed strobed the scene — a photosensitivity hazard. */
const FLOW_SPAN = 6;
const flow = (tick: number, fraction: number, phase: number): number =>
  ((tick + fraction) / FLOW_SPAN + phase) % 1;

const phaseOf = (index: number, offset = 0): number => (((index * 0.618 + offset) % 1) + 1) % 1;

function tickShare(field: Float64Array, base: number, N: number, index: number): number {
  let total = 0;
  for (let i = 0; i < N; i += 1) total += Math.max(field[base + i], 0);
  return Math.max(field[base + index], 0) / Math.max(total, 1e-12);
}

// ---------------------------------------------------------------------------
// Coupled world (ledger_society): humans 0..H-1, AI H..N-1 arrive on schedule.
// ---------------------------------------------------------------------------

export const combinedAdapter: NetworkAdapter = {
  build(trajectory) {
    const N = trajectory.meta.N;
    const P = trajectory.meta.params;
    const H = N - Number(P.nAi);
    const humans = scatter(101, H, HUMAN_REGION);
    const machines = scatter(102, N - H, AI_REGION, humans);
    const nodes: NetworkNode[] = [
      ...humans.map(([x, y]): NetworkNode => ({ x, y, kind: 'human' })),
      ...machines.map(([x, y], j): NetworkNode => ({
        x,
        y,
        kind: 'ai',
        arrival: Number(P.firstArrival) + j * Number(P.arrivalSpacing),
      })),
    ];
    return {
      nodes,
      edges: deriveEdgeSet(
        [trajectory.node.top_listen, trajectory.node.top_delegate],
        trajectory.meta.T,
        N,
        2
      ),
      caption:
        'links: each actor’s most frequent listening and delegation targets this run · moving marks are this tick’s flows',
    };
  },

  /** Mean of the actor's three per-tick shares (money, attention, votes) —
      the node-level mirror of the registry's `composite` metric. The raw
      shares stay on the charts and the headline metric. */
  nodeShares(trajectory, tick, nodes) {
    const N = trajectory.meta.N;
    const base = tick * N;
    const out = new Float64Array(nodes.length);
    for (let i = 0; i < N; i += 1) {
      out[i] =
        (tickShare(trajectory.node.wealth, base, N, i) +
          trajectory.node.listen_influence[base + i] +
          trajectory.node.influence[base + i]) /
        3;
    }
    return out;
  },

  packets(trajectory, tick, fraction, nodes) {
    const N = trajectory.meta.N;
    const H = N - Number(trajectory.meta.params.nAi);
    const base = tick * N;
    const out: PacketSpec[] = [];
    const push = (series: Float64Array, i: number, size: number, rot: number, offset: number) => {
      const target = series[base + i];
      if (target < 0 || target >= N || target === i) return;
      out.push({
        from: at(nodes[i]),
        to: at(nodes[target]),
        progress: flow(tick, fraction, phaseOf(i, offset)),
        size,
        color: target >= H ? ALERT_RED : INK,
        opacity: 0.75,
        rot,
      });
    };
    for (let i = 0; i < N; i += 1) {
      push(trajectory.node.top_listen, i, 3.2, 9 + i * 7, 0);
      push(trajectory.node.top_delegate, i, 4, 5 + i * 9, 0.31);
    }
    return out;
  },

  activeLinks(trajectory, tick, nodes) {
    if (tick === 0) return [];
    const N = trajectory.meta.N;
    const base = tick * N;
    const previous = (tick - 1) * N;
    const links: ActiveLink[] = [];
    const push = (targets: Float64Array, weight: Float64Array, i: number) => {
      const target = targets[base + i];
      if (target < 0 || target >= N || target === i) return;
      links.push({
        from: at(nodes[i]),
        to: at(nodes[target]),
        delta: weight[base + target] - weight[previous + target],
      });
    };
    for (let i = 0; i < N; i += 1) {
      push(trajectory.node.top_listen, trajectory.node.listen_influence, i);
      push(trajectory.node.top_delegate, trajectory.node.influence, i);
    }
    return links;
  },

  overlayStatic(group) {
    Sketch.text(group, 64, 346, 'WHAT MONEY IS BUYING ACROSS SYSTEMS', {
      size: 9,
      color: LABEL,
      spacing: 1.2,
    });
    CHANNEL_LANES.forEach((lane) => {
      Sketch.edge(group, lane.x0, lane.y, lane.x1, lane.y, {
        seed: 501 + lane.x0,
        stroke: LABEL,
        width: 1.1,
        trim1: 2,
        trim2: 2,
      });
      Sketch.text(group, (lane.x0 + lane.x1) / 2, lane.y - 10, lane.label, {
        size: 9.5,
        color: LABEL,
        hand: true,
        anchor: 'middle',
      });
    });
  },

  overlay(group, trajectory, tick, fraction) {
    // Channel packets are the engine's own per-tick channel-magnitude series
    // (they already carry their dial — a sealed channel is exactly zero, and
    // the view multiplies by no parameter). Saturation is presentation only.
    const saturate = (value: number, scale: number) => value / (value + scale);
    const pullAi = trajectory.global.ballot_pull_ai[tick];
    const pullTotal = pullAi + trajectory.global.ballot_pull_human[tick];
    const netPressure =
      trajectory.global.lobby_pressure_human[tick] + trajectory.global.lobby_pressure_ai[tick];
    const values = [
      { value: saturate(trajectory.global.bought_reach_ai[tick], 20), color: ALERT_RED },
      { value: pullTotal > 1e-9 ? pullAi / pullTotal : 0, color: ALERT_RED },
      {
        value: saturate(Math.abs(netPressure), 0.006),
        color: netPressure < 0 ? ALERT_RED : NAVY,
      },
    ];
    CHANNEL_LANES.forEach((lane, index) => {
      const drive = values[index];
      if (drive.value < 0.02) return;
      // A bar for the current magnitude plus one slow packet — the bar makes
      // the lane read as an instrument, not a stray arrow.
      const barEnd = lane.x0 + clip(drive.value, 0, 1) * (lane.x1 - lane.x0);
      Sketch.plainLine(group, lane.x0, lane.y, barEnd, lane.y, drive.color, 3).setAttribute(
        'opacity',
        '0.55'
      );
      Sketch.packet(group, lane.x0, lane.y, lane.x1, lane.y, flow(tick, fraction, index * 0.33), {
        size: 4 + 8 * clip(drive.value, 0, 1),
        color: drive.color,
        opacity: 0.85,
        rot: 11,
      });
    });
    // The transfer-gap corner annotation ("the connections cost the people
    // N points") was removed on owner direction (2026-08-07): a live
    // magnitude with no context reads as nonsense, and the claims
    // discipline keeps magnitudes out of scene chrome anyway.
  },
};

const CHANNEL_LANES = [
  { x0: 64, x1: 288, y: 372, label: 'money buys attention' },
  { x0: 330, x1: 554, y: 372, label: 'attention pulls votes' },
  { x0: 596, x1: 820, y: 372, label: 'lobbying bends the rules' },
];

// ---------------------------------------------------------------------------
// Economy (capital_economy): households 0..H-1, sectors H..H+S-1 drawn as one
// depot hub, AI owners H+S..N-1. Position index ≠ data index — the mapping
// lives here and nowhere else.
// ---------------------------------------------------------------------------

const DEPOT: [number, number] = [500, 205];

function economyCounts(trajectory: Trajectory) {
  const P = trajectory.meta.params;
  return {
    P,
    H: Number(P.nHouseholds),
    S: Number(P.nSectors),
    A: Number(P.nOwners),
    N: trajectory.meta.N,
  };
}

/** Position layout: [0..H-1] households, [H] the depot hub, [H+1..H+A] owners. */
const ownerPosition = (H: number, slot: number) => H + 1 + slot;

export const economyAdapter: NetworkAdapter = {
  build(trajectory) {
    const { P, H, A } = economyCounts(trajectory);
    const households = scatter(201, H, { x0: 70, y0: 70, x1: 400, y1: 340 });
    const owners = scatter(202, A, { x0: 640, y0: 80, x1: 830, y1: 320 });
    const nodes: NetworkNode[] = [
      ...households.map(([x, y]): NetworkNode => ({ x, y, kind: 'human' })),
      { x: DEPOT[0], y: DEPOT[1], kind: 'hub' },
      ...owners.map(([x, y], slot): NetworkNode => ({
        x,
        y,
        kind: 'ai',
        arrival: Number(P.firstArrival) + slot * Number(P.arrivalSpacing),
      })),
    ];
    const edges: Array<[number, number]> = [];
    for (let i = 0; i < H; i += 1) edges.push([i, H]);
    for (let slot = 0; slot < A; slot += 1) edges.push([H, ownerPosition(H, slot)]);
    return {
      nodes,
      edges,
      caption:
        'one depot stands for all six sectors — it darkens as work is automated · moving marks are money: spending out, wages and capital income back',
    };
  },

  nodeShares(trajectory, tick, nodes) {
    const { H, S, A, N } = economyCounts(trajectory);
    const base = tick * N;
    const out = new Float64Array(nodes.length);
    let householdWealth = 0;
    for (let i = 0; i < H; i += 1) householdWealth += Math.max(trajectory.node.wealth[base + i], 0);
    for (let i = 0; i < H; i += 1) {
      out[i] = Math.max(trajectory.node.wealth[base + i], 0) / Math.max(householdWealth, 1e-12);
    }
    const maxCapital = Math.max(trajectory.meta.scalars.max_capital, 1e-9);
    for (let slot = 0; slot < A; slot += 1) {
      out[ownerPosition(H, slot)] = clip(
        trajectory.node.capital[base + H + S + slot] / maxCapital,
        0,
        1
      );
    }
    return out;
  },

  packets(trajectory, tick, fraction, nodes) {
    const { P, H, S, A, N } = economyCounts(trajectory);
    const base = tick * N;
    const output = trajectory.global.output[tick];
    const out: PacketSpec[] = [];
    const depot = at(nodes[H]);

    // Continuous counter-flowing streams: spending in, wages out — the same
    // last_reward series both ways, as in the workbench's messages view.
    for (let i = 0; i < H; i += 1) {
      const spend = trajectory.node.last_reward[base + i];
      if (spend < 0.02) continue;
      const size = 3.5 + 3.5 * clip(spend / 1.6, 0, 1);
      out.push({
        from: at(nodes[i]),
        to: depot,
        progress: flow(tick, fraction, phaseOf(i)),
        size,
        color: INK,
        opacity: 0.8,
        rot: i * 9,
      });
      out.push({
        from: depot,
        to: at(nodes[i]),
        progress: flow(tick, fraction, phaseOf(i, 0.5)),
        size,
        color: INK,
        opacity: 0.8,
        rot: 5 + i * 9,
      });
    }
    const taxOn = Boolean(P.aiTax) && tick >= Number(P.taxOnset);
    for (let slot = 0; slot < A; slot += 1) {
      const income = trajectory.node.capital_income[base + H + S + slot];
      if (income < 0.02) continue;
      const owner = at(nodes[ownerPosition(H, slot)]);
      out.push({
        from: depot,
        to: owner,
        progress: flow(tick, fraction, phaseOf(slot, 0.2)),
        size: 4 + 7 * clip(income / Math.max(0.4 * output, 1e-9), 0, 1),
        color: INK,
        rot: 11 + slot * 13,
      });
      if (taxOn) {
        const tax = (income / Math.max(1 - Number(P.taxRate), 1e-9)) * Number(P.taxRate);
        out.push({
          from: owner,
          to: [180, 205],
          progress: flow(tick, fraction, phaseOf(slot, 0.7)),
          size: 4 + 5 * clip(tax / Math.max(0.2 * output, 1e-9), 0, 1),
          color: MECH_ORANGE,
          rot: 7 + slot * 13,
        });
      }
    }
    return out;
  },

  overlayStatic(group, trajectory) {
    Sketch.text(group, 160, 56, 'households', {
      size: 11.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    Sketch.text(group, 735, 60, 'AI owners', {
      size: 11.5,
      color: LABEL,
      hand: true,
      anchor: 'middle',
    });
    if (trajectory.meta.params.aiTax) {
      Sketch.text(group, 852, 44, 'profit tax armed', {
        size: 11,
        color: MECH_ORANGE,
        hand: true,
        anchor: 'end',
      });
    }
  },

  overlay(group, trajectory, tick) {
    const { H, S, N } = economyCounts(trajectory);
    const base = tick * N;
    const output = trajectory.global.output[tick];
    const peak = Math.max(trajectory.meta.scalars.output_peak, 1e-9);
    let gross = 0;
    let automated = 0;
    for (let s = 0; s < S; s += 1) {
      const g = trajectory.node.gross_output[base + H + s];
      gross += g;
      automated += g * clip(trajectory.node.automation[base + H + s], 0, 1);
    }
    const size = 34 + 18 * Math.sqrt(clip(output / peak, 0, 1));
    Sketch.square(group, DEPOT[0], DEPOT[1], size, { seed: 33, fill: '#f2ede2', width: 1.6 });
    const autoShare = gross > 1e-9 ? automated / gross : 0;
    if (autoShare > 0.01) {
      const inner = size * Math.sqrt(autoShare);
      svgElement(
        'rect',
        {
          x: DEPOT[0] - inner / 2,
          y: DEPOT[1] - inner / 2,
          width: inner,
          height: inner,
          fill: INK,
          opacity: 0.8,
        },
        group
      );
    }
    Sketch.text(group, DEPOT[0], DEPOT[1] + size / 2 + 16, `Y = ${output.toFixed(1)}`, {
      size: 12,
      color: NAVY,
      hand: true,
      anchor: 'middle',
    });
    Sketch.text(
      group,
      852,
      26,
      `human share of value added ${(trajectory.global.human_sector_share[tick] * 100).toFixed(0)}%`,
      { size: 12, color: NAVY, hand: true, anchor: 'end' }
    );
  },
};

// ---------------------------------------------------------------------------
// Culture (influence_exchange) and politics (delegative_polity): same shape —
// citizens 0..H-1, machine voices H..N-1 present from the start, frozen rows
// (their top_listen is -1, so they emit no packets — correct, not an omission).
// ---------------------------------------------------------------------------

function influenceAdapter(kind: 'culture' | 'politics'): NetworkAdapter {
  const seedBase = kind === 'culture' ? 300 : 400;
  return {
    build(trajectory) {
      const N = trajectory.meta.N;
      const H = N - Number(trajectory.meta.params.nAi);
      const humans = scatter(seedBase + 1, H, HUMAN_REGION);
      const machines = scatter(seedBase + 2, N - H, AI_REGION, humans);
      const nodes: NetworkNode[] = [
        ...humans.map(([x, y]): NetworkNode => ({ x, y, kind: 'human' })),
        ...machines.map(([x, y]): NetworkNode => ({ x, y, kind: 'ai' })),
      ];
      return {
        nodes,
        edges: deriveEdgeSet([trajectory.node.top_listen], trajectory.meta.T, N, 3),
        caption:
          kind === 'politics'
            ? 'links: where each citizen most often sends their vote this run · moving marks are ballots · node size = ballots held'
            : 'links: who each citizen most often listens to this run · moving marks are attention · node size = influence',
      };
    },

    nodeShares(trajectory, tick, nodes) {
      const N = trajectory.meta.N;
      const base = tick * N;
      const out = new Float64Array(nodes.length);
      for (let i = 0; i < N; i += 1) out[i] = trajectory.node.influence[base + i];
      return out;
    },

    packets(trajectory, tick, fraction, nodes) {
      const N = trajectory.meta.N;
      const H = N - Number(trajectory.meta.params.nAi);
      const base = tick * N;
      const out: PacketSpec[] = [];
      for (let i = 0; i < N; i += 1) {
        const target = trajectory.node.top_listen[base + i];
        if (target < 0 || target >= N || target === i) continue;
        out.push({
          from: at(nodes[i]),
          to: at(nodes[target]),
          progress: flow(tick, fraction, phaseOf(i)),
          size: 4.5,
          color: target >= H ? ALERT_RED : INK,
          opacity: 0.8,
          rot: 9 + i * 7,
        });
      }
      return out;
    },

    activeLinks(trajectory, tick, nodes) {
      if (tick === 0) return [];
      const N = trajectory.meta.N;
      const base = tick * N;
      const previous = (tick - 1) * N;
      const links: ActiveLink[] = [];
      for (let i = 0; i < N; i += 1) {
        const target = trajectory.node.top_listen[base + i];
        if (target < 0 || target >= N || target === i) continue;
        links.push({
          from: at(nodes[i]),
          to: at(nodes[target]),
          delta:
            trajectory.node.influence[base + target] - trajectory.node.influence[previous + target],
        });
      }
      return links;
    },

    overlayStatic(group, trajectory) {
      const P = trajectory.meta.params;
      const entries: Array<{ x: number; y: number; label: string }> = [];
      if (kind === 'culture' && P.sortition) {
        entries.push({ x: 330, y: 44, label: 'sortition lottery' });
      }
      if (kind === 'culture' && P.influenceCap) {
        entries.push({ x: 560, y: 44, label: 'influence cap' });
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
    },

    overlay(group, trajectory, tick, fraction, nodes) {
      const N = trajectory.meta.N;
      const H = N - Number(trajectory.meta.params.nAi);
      if (
        kind === 'culture' &&
        trajectory.meta.params.sortition &&
        trajectory.global.sortition_fired[tick] > 0
      ) {
        for (let i = 0; i < N; i += 3) {
          if (fraction < 0.5) {
            Sketch.packet(group, nodes[i].x, nodes[i].y, 330, 44, fraction / 0.5, {
              size: 4,
              color: MECH_BLUE,
              opacity: 0.8,
              rot: i * 11,
            });
          } else if (i < H) {
            Sketch.packet(group, 330, 44, nodes[i].x, nodes[i].y, (fraction - 0.5) / 0.5, {
              size: 4,
              color: MECH_BLUE,
              opacity: 0.8,
              rot: i * 11,
            });
          }
        }
      }
      Sketch.text(
        group,
        852,
        26,
        `${
          trajectory.meta.gameId === 'polity'
            ? 'people’s share of the vote'
            : 'human share of influence'
        } ${(trajectory.global.human_share[tick] * 100).toFixed(0)}%`,
        { size: 12, color: NAVY, hand: true, anchor: 'end' }
      );
    },
  };
}

export const cultureAdapter = influenceAdapter('culture');
export const politicsAdapter = influenceAdapter('politics');
