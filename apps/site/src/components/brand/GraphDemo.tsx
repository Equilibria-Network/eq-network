// src/components/brand/GraphDemo.tsx
// PROTOTYPE island for the "blueprint / measured" brand study. A small society
// network laid out with d3-force and restyled in the blueprint aesthetic
// (true-white panel, faint graph-paper grid, hairlines, sharp navy squares,
// mono annotations). It demonstrates two things the settled thesis visuals need:
//   1. the layout is programmatic (d3) and fully styleable to our aesthetic, and
//   2. the graph can TRANSFORM / animate to communicate a point ("propagate"
//      spreads a cooperative equilibrium across the network over ~1.5s).
// Rendered with client:only="react" so d3 / DOM never run during SSR. Everything
// touching the DOM is guarded in effects and cleaned up on unmount.
import { useEffect, useRef, useState } from 'react';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force';
import { drag, type D3DragEvent } from 'd3-drag';
import { select } from 'd3-selection';

// ── Palette (kept local so the island is self-contained) ──────────────
const INK = '#003B7E';
const ACCENT = '#4AB3F4';
const HAIRLINE = 'rgba(0,59,126,0.35)';
const GRID = '#e7edf5';

// ── Coordinate space (SVG viewBox; scales responsively via CSS) ───────
const W = 760;
const H = 480;

type NodeState = 'cooperate' | 'defect';

interface SimNode extends SimulationNodeDatum {
  id: string;
  /** normalized 0..1 seed position, scaled to the viewBox at init */
  nx: number;
  ny: number;
}

interface SimLink extends SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
  /** weak / inactive tie -> rendered dashed */
  weak?: boolean;
}

// ── Network definition (16 nodes, 27 edges) ───────────────────────────
const RAW_NODES: Omit<SimNode, keyof SimulationNodeDatum>[] = [
  { id: 'n0', nx: 0.15, ny: 0.2 },
  { id: 'n1', nx: 0.3, ny: 0.12 },
  { id: 'n2', nx: 0.5, ny: 0.15 },
  { id: 'n3', nx: 0.68, ny: 0.1 },
  { id: 'n4', nx: 0.85, ny: 0.22 },
  { id: 'n5', nx: 0.12, ny: 0.45 },
  { id: 'n6', nx: 0.32, ny: 0.38 },
  { id: 'n7', nx: 0.5, ny: 0.45 },
  { id: 'n8', nx: 0.68, ny: 0.4 },
  { id: 'n9', nx: 0.88, ny: 0.5 },
  { id: 'n10', nx: 0.2, ny: 0.7 },
  { id: 'n11', nx: 0.4, ny: 0.75 },
  { id: 'n12', nx: 0.55, ny: 0.68 },
  { id: 'n13', nx: 0.72, ny: 0.72 },
  { id: 'n14', nx: 0.88, ny: 0.8 },
  { id: 'n15', nx: 0.35, ny: 0.55 },
];

const RAW_LINKS: SimLink[] = [
  { source: 'n0', target: 'n1' },
  { source: 'n1', target: 'n2' },
  { source: 'n2', target: 'n3' },
  { source: 'n3', target: 'n4' },
  { source: 'n0', target: 'n5' },
  { source: 'n1', target: 'n6' },
  { source: 'n2', target: 'n7' },
  { source: 'n3', target: 'n8' },
  { source: 'n4', target: 'n9' },
  { source: 'n5', target: 'n6', weak: true },
  { source: 'n6', target: 'n7' },
  { source: 'n7', target: 'n8' },
  { source: 'n8', target: 'n9', weak: true },
  { source: 'n5', target: 'n10' },
  { source: 'n6', target: 'n15' },
  { source: 'n7', target: 'n12' },
  { source: 'n8', target: 'n13' },
  { source: 'n9', target: 'n14' },
  { source: 'n10', target: 'n11' },
  { source: 'n11', target: 'n12' },
  { source: 'n12', target: 'n13' },
  { source: 'n13', target: 'n14', weak: true },
  { source: 'n15', target: 'n11' },
  { source: 'n15', target: 'n7' },
  { source: 'n6', target: 'n2', weak: true },
  { source: 'n10', target: 'n15' },
  { source: 'n1', target: 'n7', weak: true },
];

// The two "cooperate" seeds the propagation starts from.
const SEEDS = ['n0', 'n9'];

const NODE = 11; // side length of a node square, in viewBox units
const HALF = NODE / 2;

function initialStates(): Record<string, NodeState> {
  const s: Record<string, NodeState> = {};
  for (const n of RAW_NODES) s[n.id] = SEEDS.includes(n.id) ? 'cooperate' : 'defect';
  return s;
}

// Undirected adjacency, for BFS propagation.
function buildAdjacency(): Record<string, string[]> {
  const adj: Record<string, string[]> = {};
  for (const n of RAW_NODES) adj[n.id] = [];
  for (const l of RAW_LINKS) {
    const s = l.source as string;
    const t = l.target as string;
    adj[s].push(t);
    adj[t].push(s);
  }
  return adj;
}

export default function GraphDemo() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const linksRef = useRef<SimLink[]>([]);
  const byIdRef = useRef<Map<string, SimNode>>(new Map());
  const timeoutsRef = useRef<number[]>([]);
  const reducedRef = useRef(false);

  // Bump this to force a re-render from the latest simulated positions.
  const [, setFrame] = useState(0);
  const [states, setStates] = useState<Record<string, NodeState>>(initialStates);

  // Build the node/link objects exactly once (survives re-renders).
  if (nodesRef.current.length === 0) {
    nodesRef.current = RAW_NODES.map((n) => ({
      ...n,
      x: n.nx * W,
      y: n.ny * H,
    }));
    byIdRef.current = new Map(nodesRef.current.map((n) => [n.id, n]));
    // clone links so d3 can mutate source/target into node refs without
    // touching our RAW_LINKS module constant
    linksRef.current = RAW_LINKS.map((l) => ({ ...l }));
  }

  function clearTimeouts() {
    for (const id of timeoutsRef.current) window.clearTimeout(id);
    timeoutsRef.current = [];
  }

  // ── Set up the force simulation + drag once, on mount ───────────────
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    reducedRef.current =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const nodes = nodesRef.current;
    const links = linksRef.current;

    const sim = forceSimulation<SimNode, SimLink>(nodes)
      .force(
        'link',
        forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(78)
          .strength(0.35)
      )
      .force('charge', forceManyBody<SimNode>().strength(-220))
      .force('center', forceCenter(W / 2, H / 2))
      .force('collide', forceCollide<SimNode>(20));

    simRef.current = sim;

    if (reducedRef.current) {
      // No animation: settle synchronously and render once, statically.
      sim.stop();
      sim.tick(300);
      clampToBounds();
      sim.stop();
      setFrame((f) => f + 1);
    } else {
      sim.on('tick', () => {
        clampToBounds();
        setFrame((f) => f + 1);
      });
      sim.alpha(1).restart();
    }

    // Draggable nodes via d3-drag. selectAll binds `nodes` by index to the
    // already-rendered <g> elements (stable keys => React keeps the DOM nodes,
    // so these listeners persist across re-renders).
    const dragBehavior = drag<SVGGElement, SimNode>()
      .on('start', (event: D3DragEvent<SVGGElement, SimNode, SimNode>, d) => {
        if (!event.active && !reducedRef.current) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event: D3DragEvent<SVGGElement, SimNode, SimNode>, d) => {
        d.fx = event.x;
        d.fy = event.y;
        if (reducedRef.current) {
          // no running sim to redraw us; update directly
          d.x = event.x;
          d.y = event.y;
          setFrame((f) => f + 1);
        }
      })
      .on('end', (event: D3DragEvent<SVGGElement, SimNode, SimNode>, d) => {
        if (!event.active && !reducedRef.current) sim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    select(svg).selectAll<SVGGElement, SimNode>('g.gd-node').data(nodes).call(dragBehavior);

    return () => {
      sim.on('tick', null);
      sim.stop();
      simRef.current = null;
      clearTimeouts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep nodes inside the drawable area (squares + labels have margin).
  function clampToBounds() {
    const m = 20;
    for (const n of nodesRef.current) {
      if (n.x == null || n.y == null) continue;
      n.x = Math.max(m, Math.min(W - m, n.x));
      n.y = Math.max(m, Math.min(H - m, n.y));
    }
  }

  // ── Controls ────────────────────────────────────────────────────────
  function handleReheat() {
    const sim = simRef.current;
    if (!sim) return;
    if (reducedRef.current) {
      sim.tick(300);
      clampToBounds();
      setFrame((f) => f + 1);
      return;
    }
    sim.alpha(1).restart();
  }

  function handleReset() {
    clearTimeouts();
    setStates(initialStates());
  }

  // The money demo: spread "cooperate" outward from the seeds along edges,
  // one BFS layer at a time, so an equilibrium visibly settles across the net.
  function handlePropagate() {
    clearTimeouts();
    const adj = buildAdjacency();

    // BFS layering from the seed set.
    const layer = new Map<string, number>();
    let frontier = [...SEEDS];
    for (const s of SEEDS) layer.set(s, 0);
    let depth = 0;
    while (frontier.length) {
      const next: string[] = [];
      for (const id of frontier) {
        for (const nb of adj[id]) {
          if (!layer.has(nb)) {
            layer.set(nb, depth + 1);
            next.push(nb);
          }
        }
      }
      frontier = next;
      depth += 1;
    }

    const maxDepth = Math.max(0, ...Array.from(layer.values()));

    if (reducedRef.current || maxDepth === 0) {
      // instant: everything reachable cooperates
      setStates(() => {
        const s: Record<string, NodeState> = {};
        for (const n of RAW_NODES) s[n.id] = layer.has(n.id) ? 'cooperate' : 'defect';
        return s;
      });
      return;
    }

    const total = 1500; // ms
    const step = total / maxDepth;
    // start from the disordered baseline, then flip layer by layer
    setStates(initialStates());
    for (let d = 1; d <= maxDepth; d++) {
      const ids = Array.from(layer.entries())
        .filter(([, dep]) => dep === d)
        .map(([id]) => id);
      const t = window.setTimeout(() => {
        setStates((prev) => {
          const nextS = { ...prev };
          for (const id of ids) nextS[id] = 'cooperate';
          return nextS;
        });
      }, step * d);
      timeoutsRef.current.push(t);
    }
  }

  // ── Render helpers ──────────────────────────────────────────────────
  function endpoint(e: string | SimNode): SimNode | undefined {
    return typeof e === 'string' ? byIdRef.current.get(e) : e;
  }

  const nodes = nodesRef.current;
  const links = linksRef.current;

  return (
    <div className="gd-root">
      <style>{CSS}</style>

      <div className="gd-panel">
        <span className="gd-title ff-mono">fig. / society network</span>

        <svg
          ref={svgRef}
          className="gd-svg"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Interactive society-network graph in the blueprint style. Nodes can be dragged; controls re-run the force layout and animate a cooperative equilibrium spreading across the network."
        >
          <defs>
            <pattern id="gd-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0 H0 V20" fill="none" stroke={GRID} strokeWidth="1" />
            </pattern>
            <pattern id="gd-grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M100 0 H0 V100" fill="none" stroke={GRID} strokeWidth="1.4" />
            </pattern>
          </defs>

          {/* graph-paper ground */}
          <rect x="0" y="0" width={W} height={H} fill="#ffffff" />
          <rect x="0" y="0" width={W} height={H} fill="url(#gd-grid)" />
          <rect x="0" y="0" width={W} height={H} fill="url(#gd-grid-major)" />

          {/* edges */}
          <g>
            {links.map((l, i) => {
              const s = endpoint(l.source);
              const t = endpoint(l.target);
              if (!s || !t || s.x == null || s.y == null || t.x == null || t.y == null) return null;
              return (
                <line
                  key={`e${i}`}
                  x1={s.x}
                  y1={s.y}
                  x2={t.x}
                  y2={t.y}
                  stroke={HAIRLINE}
                  strokeWidth={1}
                  strokeDasharray={l.weak ? '4 4' : undefined}
                />
              );
            })}
          </g>

          {/* nodes */}
          <g>
            {nodes.map((n) => {
              const coop = states[n.id] === 'cooperate';
              const x = n.x ?? n.nx * W;
              const y = n.y ?? n.ny * H;
              return (
                <g key={n.id} className="gd-node" transform={`translate(${x} ${y})`}>
                  <rect
                    className="gd-square"
                    x={-HALF}
                    y={-HALF}
                    width={NODE}
                    height={NODE}
                    fill={coop ? INK : '#ffffff'}
                    stroke={INK}
                    strokeWidth={1.5}
                  />
                  <text className="gd-idx ff-mono" x={HALF + 4} y={-HALF - 3} fill={INK}>
                    {n.id}
                  </text>
                </g>
              );
            })}
          </g>

          {/* corner ticks */}
          <g stroke={INK} strokeWidth="1">
            <path d="M8 8 h14 M8 8 v14" />
            <path d={`M${W - 8} 8 h-14 M${W - 8} 8 v14`} />
            <path d={`M8 ${H - 8} h14 M8 ${H - 8} v-14`} />
            <path d={`M${W - 8} ${H - 8} h-14 M${W - 8} ${H - 8} v-14`} />
          </g>
        </svg>

        <div className="gd-controls ff-mono">
          <button type="button" onClick={handleReheat}>
            run / reheat
          </button>
          <button type="button" onClick={handlePropagate}>
            propagate
          </button>
          <button type="button" onClick={handleReset}>
            reset
          </button>
          <span className="gd-legend">
            <span className="gd-chip gd-chip--coop" /> cooperate
            <span className="gd-chip gd-chip--defect" /> defect
            <span className="gd-chip gd-chip--weak" /> weak tie
          </span>
        </div>
      </div>
    </div>
  );
}

// Island-scoped CSS (astro <style> is scoped to the page and does not reach a
// client:only island, so the component ships its own styles).
const CSS = `
.gd-root { --ink:${INK}; --accent:${ACCENT}; }
.gd-panel {
  position: relative;
  border: 1px solid rgba(0,59,126,0.35);
  background: #ffffff;
  padding: 2.1rem 1rem 1rem;
}
.gd-title {
  position: absolute;
  top: 0.55rem;
  left: 0.75rem;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: var(--ink);
  opacity: 0.7;
}
.gd-svg {
  display: block;
  width: 100%;
  height: auto;
  touch-action: none; /* let d3-drag own pointer gestures */
}
.gd-square {
  transition: fill 220ms ease;
  cursor: grab;
}
.gd-node:active .gd-square { cursor: grabbing; }
.gd-idx {
  font-size: 11px;
  opacity: 0.55;
  user-select: none;
  pointer-events: none;
}
.gd-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.9rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(0,59,126,0.15);
  font-size: 0.75rem;
}
.gd-controls button {
  font: inherit;
  color: var(--ink);
  background: #ffffff;
  border: 1px solid rgba(0,59,126,0.35);
  border-radius: 0;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: background 140ms ease, color 140ms ease;
}
.gd-controls button:hover { background: var(--ink); color: #ffffff; }
.gd-controls button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.gd-legend {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: auto;
  opacity: 0.75;
}
.gd-chip {
  display: inline-block;
  width: 11px;
  height: 11px;
  margin-left: 0.6rem;
  vertical-align: -1px;
}
.gd-chip--coop { background: var(--ink); border: 1.5px solid var(--ink); }
.gd-chip--defect { background: #ffffff; border: 1.5px solid var(--ink); }
.gd-chip--weak {
  border: none;
  height: 0;
  width: 16px;
  border-top: 1px dashed rgba(0,59,126,0.6);
}
@media (prefers-reduced-motion: reduce) {
  .gd-square { transition: none; }
}
`;
