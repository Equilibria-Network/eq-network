import type { Trajectory } from '../../engine/types';
import type { SceneRenderer } from '../../rendering/types';
import { ALERT_RED, clip, INK, LABEL, MECH_BLUE, Sketch, svgElement } from '../../rendering/sketch';

export interface NetworkNode {
  x: number;
  y: number;
  kind: 'human' | 'ai' | 'hub';
  /** Tick before which the node is drawn as a dashed outline (not yet
      arrived). Undefined = present from the start. */
  arrival?: number;
}

export interface PacketSpec {
  from: [number, number];
  to: [number, number];
  progress: number;
  size: number;
  color: string;
  opacity?: number;
  rot?: number;
}

export interface ActiveLink {
  from: [number, number];
  to: [number, number];
  /** Sign colors the overdraw: > 0 blue (gaining), < 0 red (losing). */
  delta: number;
}

export interface NetworkBuild {
  nodes: NetworkNode[];
  /** Persistent grey edges, as node-index pairs. */
  edges: Array<[number, number]>;
  caption: string;
}

/** Everything scenario-specific: which engine series drive positions, edges,
    packets, sizes, and chrome. The renderer itself never reads a parameter —
    a sealed dial shows nothing because the driving series is zero. */
export interface NetworkAdapter {
  build(trajectory: Trajectory): NetworkBuild;
  /** Radius-driving share in [0, 1] per node index; hub entries are ignored. */
  nodeShares(trajectory: Trajectory, tick: number, nodes: NetworkNode[]): Float64Array;
  packets(
    trajectory: Trajectory,
    tick: number,
    fraction: number,
    nodes: NetworkNode[]
  ): PacketSpec[];
  activeLinks?(trajectory: Trajectory, tick: number, nodes: NetworkNode[]): ActiveLink[];
  overlayStatic?(group: SVGElement, trajectory: Trajectory, nodes: NetworkNode[]): void;
  overlay?(
    group: SVGElement,
    trajectory: Trajectory,
    tick: number,
    fraction: number,
    nodes: NetworkNode[]
  ): void;
}

interface NetworkLayer {
  build: NetworkBuild;
}

const EDGE_GREY = '#d9dfe6';

/** Influence-share shift per tick below which an active link stays grey.
    The coloring marks meaningful redistribution events; without a floor the
    constant small churn washes the whole canvas blue. */
const DELTA_FLOOR = 3e-4;

export function networkRenderer(adapter: NetworkAdapter): SceneRenderer<NetworkLayer> {
  return {
    layout(group, trajectory) {
      const build = adapter.build(trajectory);
      for (const [a, b] of build.edges) {
        const from = build.nodes[a];
        const to = build.nodes[b];
        if (!from || !to) continue;
        Sketch.plainLine(group, from.x, from.y, to.x, to.y, EDGE_GREY, 1);
      }
      Sketch.circle(group, 26, 26, 5, { seed: 11, fill: '#ffffff', width: 1.2 });
      Sketch.text(group, 36, 30, 'person', { size: 10, color: LABEL, hand: true });
      svgElement('rect', { x: 88, y: 21, width: 10, height: 10, fill: INK, opacity: 0.82 }, group);
      Sketch.text(group, 104, 30, 'AI system', { size: 10, color: LABEL, hand: true });
      Sketch.text(group, 30, 392, build.caption, { size: 11, color: LABEL, hand: true });
      adapter.overlayStatic?.(group, trajectory, build.nodes);
      return { build };
    },

    drawFrame(group, layer, trajectory, tick, fraction) {
      const nodes = layer.build.nodes;

      for (const link of adapter.activeLinks?.(trajectory, tick, nodes) ?? []) {
        if (Math.abs(link.delta) < DELTA_FLOOR) continue;
        Sketch.plainLine(
          group,
          link.from[0],
          link.from[1],
          link.to[0],
          link.to[1],
          link.delta > 0 ? MECH_BLUE : ALERT_RED,
          1.2
        ).setAttribute('opacity', '0.35');
      }

      for (const packet of adapter.packets(trajectory, tick, fraction, nodes)) {
        Sketch.packet(
          group,
          packet.from[0],
          packet.from[1],
          packet.to[0],
          packet.to[1],
          clip(packet.progress, 0, 1),
          {
            size: packet.size,
            color: packet.color,
            opacity: packet.opacity ?? 0.82,
            rot: packet.rot ?? 8,
          }
        );
      }

      const shares = adapter.nodeShares(trajectory, tick, nodes);
      nodes.forEach((node, index) => {
        if (node.kind === 'hub') return;
        if (node.arrival !== undefined && tick < node.arrival) {
          Sketch.square(group, node.x, node.y, 12, {
            seed: 210 + index,
            stroke: LABEL,
            width: 1,
            roughness: 0.5,
            dash: '3,3',
          });
          return;
        }
        const radius = Math.min(3 + 26 * Math.sqrt(clip(shares[index], 0, 1)), 13);
        if (node.kind === 'ai') {
          svgElement(
            'rect',
            {
              x: node.x - radius * 0.75,
              y: node.y - radius * 0.75,
              width: radius * 1.5,
              height: radius * 1.5,
              fill: INK,
              opacity: 0.82,
            },
            group
          );
          Sketch.square(group, node.x, node.y, radius * 2, { seed: 900 + index, width: 1.2 });
        } else {
          Sketch.circle(group, node.x, node.y, radius, {
            seed: 40 + index,
            fill: '#ffffff',
            width: 1.2,
          });
        }
      });

      adapter.overlay?.(group, trajectory, tick, fraction, nodes);
    },
  };
}
