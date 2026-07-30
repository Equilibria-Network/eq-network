import { useMemo, useState, type CSSProperties, type KeyboardEvent } from 'react';
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force';
import rough from 'roughjs';
import {
  NOTEBOOK_CONNECTOR_MEDIUM,
  connectorSeed,
  openArrowHeadPath,
  type DiagramPoint,
} from '@components/diagram/connectorInk';
import { explainerContent } from '@content/explainer';
import styles from './DagGraphPrototype.module.css';

const W = 1200;
const H = 875;
const LAYER_X = [125, 350, 585, 810] as const;
const GRAPH_TOP = 145;
const GRAPH_BOTTOM = 485;

type Role = 'human' | 'ai' | 'institution';
type NodeState = 'open' | 'processing' | 'committed';
type ConnectorGesture = 'direct' | 'bow' | 's-curve';

interface DagNode extends SimulationNodeDatum {
  id: string;
  label: string;
  role: Role;
  state: NodeState;
  layer: number;
  order: number;
}

interface DagLink extends SimulationLinkDatum<DagNode> {
  id: string;
  source: string | DagNode;
  target: string | DagNode;
  gesture: ConnectorGesture;
  bend?: number;
  highlighted?: boolean;
}

interface ConnectorGeometry {
  path: string;
  end: DiagramPoint;
  tangent: DiagramPoint;
}

interface ConnectorDrawables {
  shaft: RoughDrawable;
  head: RoughDrawable;
}

const OUTCOME_STATES: NodeState[] = ['open', 'processing', 'committed', 'open', 'committed'];

function roleForActor(id: number): Role {
  return id % 8 === 0 ? 'institution' : id % 3 === 0 ? 'ai' : 'human';
}

const NODES: DagNode[] = Array.from({ length: 20 }, (_, id) => {
  const layer = Math.floor(id / 5);
  const order = id % 5;
  const state: NodeState =
    layer === 0
      ? 'open'
      : layer === 1
        ? 'processing'
        : layer === 2
          ? 'committed'
          : OUTCOME_STATES[order];

  return {
    id: String(id),
    label: String(id + 1),
    role: roleForActor(id),
    state,
    layer,
    order,
  };
});

function link(
  source: number,
  target: number,
  gesture: ConnectorGesture,
  bend?: number,
  highlighted = false
): DagLink {
  return {
    id: `${source}-${target}`,
    source: String(source),
    target: String(target),
    gesture,
    bend,
    highlighted,
  };
}

const LINKS: DagLink[] = [
  link(0, 5, 'direct'),
  link(0, 6, 'bow', -11),
  link(1, 5, 's-curve', 18),
  link(1, 7, 'direct'),
  link(2, 6, 'direct'),
  link(2, 7, 'bow', -16),
  link(2, 8, 's-curve', 24),
  link(3, 7, 'direct', undefined, true),
  link(3, 8, 's-curve', -20),
  link(4, 8, 'direct'),
  link(4, 9, 'bow', 18),
  link(5, 10, 'direct'),
  link(5, 12, 's-curve', 23),
  link(6, 10, 'bow', -14),
  link(6, 11, 'direct'),
  link(7, 11, 'bow', 12),
  link(7, 12, 'direct', undefined, true),
  link(7, 13, 's-curve', -25),
  link(8, 12, 'bow', -12),
  link(8, 13, 'direct'),
  link(9, 13, 's-curve', 19),
  link(9, 14, 'direct'),
  link(10, 15, 'direct'),
  link(10, 16, 'bow', -14),
  link(11, 15, 's-curve', 20),
  link(11, 17, 'direct'),
  link(12, 16, 'bow', 12),
  link(12, 17, 'direct', undefined, true),
  link(13, 17, 's-curve', -18),
  link(13, 18, 'direct'),
  link(14, 18, 'bow', 15),
  link(14, 19, 'direct'),
];

const sketch = rough.generator({
  options: {
    roughness: 0.34,
    bowing: 0.26,
    maxRandomnessOffset: 0.55,
    disableMultiStroke: true,
    disableMultiStrokeFill: true,
    preserveVertices: true,
    fixedDecimalPlaceDigits: 2,
  },
});

const edgeSketch = rough.generator({
  options: {
    roughness: NOTEBOOK_CONNECTOR_MEDIUM.roughness,
    bowing: NOTEBOOK_CONNECTOR_MEDIUM.bowing,
    maxRandomnessOffset: NOTEBOOK_CONNECTOR_MEDIUM.maxRandomnessOffset,
    disableMultiStroke: NOTEBOOK_CONNECTOR_MEDIUM.disableMultiStroke,
    disableMultiStrokeFill: true,
    preserveVertices: NOTEBOOK_CONNECTOR_MEDIUM.preserveVertices,
    fixedDecimalPlaceDigits: 2,
  },
});

const annotationSketch = rough.generator({
  options: {
    roughness: NOTEBOOK_CONNECTOR_MEDIUM.roughness,
    bowing: NOTEBOOK_CONNECTOR_MEDIUM.bowing,
    maxRandomnessOffset: NOTEBOOK_CONNECTOR_MEDIUM.maxRandomnessOffset,
    disableMultiStroke: NOTEBOOK_CONNECTOR_MEDIUM.disableMultiStroke,
    disableMultiStrokeFill: true,
    preserveVertices: NOTEBOOK_CONNECTOR_MEDIUM.preserveVertices,
    fixedDecimalPlaceDigits: 2,
  },
});

type RoughDrawable = Parameters<typeof sketch.toPaths>[0];

function endpointId(endpoint: string | DagNode) {
  return typeof endpoint === 'string' ? endpoint : endpoint.id;
}

function targetY(node: DagNode) {
  const peers = NODES.filter((candidate) => candidate.layer === node.layer);
  const span = GRAPH_BOTTOM - GRAPH_TOP;
  return GRAPH_TOP + (span * (node.order + 0.5)) / peers.length;
}

function solveDag() {
  const nodes = NODES.map((node) => ({ ...node }));
  const links = LINKS.map((link) => ({
    ...link,
    source: endpointId(link.source),
    target: endpointId(link.target),
  }));
  const simulation = forceSimulation<DagNode, DagLink>(nodes)
    .randomSource(() => 0.417)
    .force(
      'link',
      forceLink<DagNode, DagLink>(links)
        .id((node) => node.id)
        .distance(165)
        .strength(0.18)
    )
    .force('charge', forceManyBody().strength(-92))
    .force('collide', forceCollide(31))
    .force('x', forceX<DagNode>((node) => LAYER_X[node.layer]).strength(0.96))
    .force('y', forceY<DagNode>((node) => targetY(node)).strength(0.72))
    .stop();

  for (let tick = 0; tick < 320; tick += 1) simulation.tick();

  return new Map(
    nodes.map((node) => [
      node.id,
      {
        x: Math.max(LAYER_X[node.layer] - 26, Math.min(LAYER_X[node.layer] + 26, node.x ?? 0)),
        y: Math.max(GRAPH_TOP, Math.min(GRAPH_BOTTOM, node.y ?? 0)),
      },
    ])
  );
}

const POSITIONS = solveDag();

function assertAcyclic() {
  const layers = new Map(NODES.map((node) => [node.id, node.layer]));
  LINKS.forEach((link) => {
    const sourceLayer = layers.get(endpointId(link.source));
    const targetLayer = layers.get(endpointId(link.target));
    if (sourceLayer === undefined || targetLayer === undefined || sourceLayer >= targetLayer) {
      throw new Error(`DAG invariant violated by ${link.id}`);
    }
  });
}

assertAcyclic();

function radiusFor(role: Role) {
  if (role === 'institution') return 18;
  if (role === 'ai') return 17;
  return 16;
}

function nodeDrawable(node: DagNode): RoughDrawable {
  const common = {
    seed: node.id.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0) * 7919,
    stroke: 'currentColor',
    strokeWidth: 1.35,
    fill:
      node.state === 'open'
        ? undefined
        : node.state === 'processing'
          ? 'currentColor'
          : 'currentColor',
    fillStyle: node.state === 'processing' ? 'hachure' : 'solid',
    fillWeight: 0.72,
    hachureAngle: -38,
    hachureGap: 5.2,
  };

  if (node.role === 'ai') {
    return sketch.polygon(
      [
        [-17, 14],
        [0, -17],
        [17, 14],
      ],
      common
    );
  }
  if (node.role === 'institution') {
    return sketch.rectangle(-17, -17, 34, 34, common);
  }
  return sketch.circle(0, 0, 32, common);
}

function connectorPath(
  source: DiagramPoint,
  target: DiagramPoint,
  sourceGap: number,
  targetGap: number,
  gesture: ConnectorGesture,
  bend: number
): ConnectorGeometry {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const start = { x: source.x + ux * sourceGap, y: source.y + uy * sourceGap };
  const end = { x: target.x - ux * targetGap, y: target.y - uy * targetGap };
  const midpointControl = {
    x: (start.x + end.x) / 2 - uy * bend,
    y: (start.y + end.y) / 2 + ux * bend,
  };

  if (gesture === 'direct') {
    return {
      path: `M${start.x.toFixed(2)} ${start.y.toFixed(2)}L${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
      end,
      tangent: { x: end.x - start.x, y: end.y - start.y },
    };
  }

  if (gesture === 'bow') {
    return {
      path: `M${start.x.toFixed(2)} ${start.y.toFixed(2)}Q${midpointControl.x.toFixed(
        2
      )} ${midpointControl.y.toFixed(2)} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
      end,
      tangent: { x: end.x - midpointControl.x, y: end.y - midpointControl.y },
    };
  }

  const firstControl = {
    x: start.x + (end.x - start.x) * 0.34 - uy * bend,
    y: start.y + (end.y - start.y) * 0.34 + ux * bend,
  };
  const secondControl = {
    x: start.x + (end.x - start.x) * 0.68 + uy * bend,
    y: start.y + (end.y - start.y) * 0.68 - ux * bend,
  };

  return {
    path: `M${start.x.toFixed(2)} ${start.y.toFixed(2)}C${firstControl.x.toFixed(
      2
    )} ${firstControl.y.toFixed(2)} ${secondControl.x.toFixed(2)} ${secondControl.y.toFixed(
      2
    )} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
    end,
    tangent: { x: end.x - secondControl.x, y: end.y - secondControl.y },
  };
}

function connectorDrawables(
  geometry: ConnectorGeometry,
  seed: number,
  strokeWidth: number = NOTEBOOK_CONNECTOR_MEDIUM.strokeWidth,
  renderer = edgeSketch
): ConnectorDrawables {
  const common = {
    stroke: 'currentColor',
    fill: 'none',
  };
  return {
    shaft: renderer.path(geometry.path, {
      ...common,
      seed,
      strokeWidth,
    }),
    head: renderer.path(openArrowHeadPath(geometry.end, geometry.tangent), {
      ...common,
      seed: seed + 37,
      strokeWidth: Math.min(strokeWidth, 2.2),
    }),
  };
}

function edgeDrawables(link: DagLink, index: number): ConnectorDrawables {
  const sourceNode = NODES.find((node) => node.id === endpointId(link.source))!;
  const targetNode = NODES.find((node) => node.id === endpointId(link.target))!;
  const source = POSITIONS.get(sourceNode.id)!;
  const target = POSITIONS.get(targetNode.id)!;
  const geometry = connectorPath(
    source,
    target,
    radiusFor(sourceNode.role) + 2,
    radiusFor(targetNode.role) + 10,
    link.gesture,
    link.bend ?? ((index % 3) - 1) * 8
  );
  return connectorDrawables(
    geometry,
    connectorSeed(index),
    link.highlighted ? 3.35 : NOTEBOOK_CONNECTOR_MEDIUM.strokeWidth
  );
}

function annotationDrawables(geometry: ConnectorGeometry, seed: number) {
  return connectorDrawables(
    geometry,
    seed,
    NOTEBOOK_CONNECTOR_MEDIUM.strokeWidth,
    annotationSketch
  );
}

function legendConnectorDrawables(geometry: ConnectorGeometry, seed: number, highlighted = false) {
  return connectorDrawables(
    geometry,
    seed,
    highlighted ? 3.35 : NOTEBOOK_CONNECTOR_MEDIUM.strokeWidth
  );
}

function directedPathGeometry(
  path: string,
  end: DiagramPoint,
  previousControl: DiagramPoint
): ConnectorGeometry {
  return {
    path,
    end,
    tangent: {
      x: end.x - previousControl.x,
      y: end.y - previousControl.y,
    },
  };
}

function RoughPaths({
  drawable,
  className,
  delay = 0,
}: {
  drawable: RoughDrawable;
  className?: string;
  delay?: number;
}) {
  return sketch
    .toPaths(drawable)
    .map((path, index) => (
      <path
        className={className}
        d={path.d}
        fill={path.fill}
        key={`${path.d}-${index}`}
        pathLength={1}
        stroke={path.stroke}
        strokeWidth={path.strokeWidth}
        style={{ '--draw-delay': `${delay}ms` } as CSSProperties}
        vectorEffect="non-scaling-stroke"
      />
    ));
}

function RoughConnector({
  drawables,
  className,
  delay = 0,
}: {
  drawables: ConnectorDrawables;
  className?: string;
  delay?: number;
}) {
  return (
    <>
      <RoughPaths className={className} delay={delay} drawable={drawables.shaft} />
      <RoughPaths className={className} delay={delay + 480} drawable={drawables.head} />
    </>
  );
}

function connectedTrace(selectedId: string | null) {
  if (!selectedId) return { nodes: new Set<string>(), edges: new Set<string>() };

  const nodeIds = new Set([selectedId]);
  const edgeIds = new Set<string>();

  const visitAncestors = (nodeId: string) => {
    LINKS.forEach((link) => {
      const source = endpointId(link.source);
      const target = endpointId(link.target);
      if (target === nodeId) {
        edgeIds.add(link.id);
        if (!nodeIds.has(source)) {
          nodeIds.add(source);
          visitAncestors(source);
        }
      }
    });
  };

  const visitDescendants = (nodeId: string) => {
    LINKS.forEach((link) => {
      const source = endpointId(link.source);
      const target = endpointId(link.target);
      if (source === nodeId) {
        edgeIds.add(link.id);
        if (!nodeIds.has(target)) {
          nodeIds.add(target);
          visitDescendants(target);
        }
      }
    });
  };

  visitAncestors(selectedId);
  visitDescendants(selectedId);

  return { nodes: nodeIds, edges: edgeIds };
}

const p = explainerContent.prototype.dagStudy;
const firstStep = explainerContent.steps[0];

interface DagGraphPrototypeProps {
  embedded?: boolean;
  figureLabel?: string;
  timeSliceLabel?: string;
}

export default function DagGraphPrototype({
  embedded = false,
  figureLabel,
  timeSliceLabel,
}: DagGraphPrototypeProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const trace = useMemo(() => connectedTrace(selectedId), [selectedId]);
  const selectedNode = NODES.find((node) => node.id === selectedId);

  const selectNode = (node: DagNode) => {
    setSelectedId((current) => (current === node.id ? null : node.id));
  };

  const onNodeKeyDown = (event: KeyboardEvent<SVGGElement>, node: DagNode) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectNode(node);
    }
  };

  return (
    <section
      aria-label={embedded ? 'Canonical interactive diagram grammar' : undefined}
      aria-labelledby={embedded ? undefined : 'dag-prototype-title'}
      className={`${styles.prototype} ${embedded ? styles.embedded : ''}`}
    >
      {!embedded && (
        <div className={styles.intro}>
          <div>
            <span>{p.eyebrow}</span>
            <h2 id="dag-prototype-title">{p.title}</h2>
          </div>
          <p>{p.summary}</p>
        </div>
      )}

      <div className={styles.plate}>
        <div className={styles.plateRule}>
          <span>{figureLabel ?? p.figureLabel}</span>
          <span>{timeSliceLabel ?? p.timeSliceLabel}</span>
        </div>
        <div className={styles.canvasScroll} tabIndex={0} aria-label="Scrollable DAG figure">
          <svg
            className={styles.canvas}
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-labelledby="dag-title dag-description"
          >
            <title id="dag-title">{firstStep.headline}</title>
            <desc id="dag-description">
              {firstStep.body} This prototype displays a four-layer directed acyclic graph from
              signals through interpretation and decisions to consequences. Circles are humans,
              triangles are AI systems, and squares are institutions. Open, hatched, and solid fills
              show receiving, interpreting, and committed states. Thin ink shows ordinary directed
              relations; a bold blue line marks one consequential path.
            </desc>
            <g className={styles.layerGuides} aria-hidden="true">
              {LAYER_X.map((x, index) => (
                <g key={x}>
                  <path d={`M${x} 112V510`} />
                  <text x={x} y="88">
                    {p.layerLabels[index]}
                  </text>
                  <text x={x} y="108">
                    ℓ = {index}
                  </text>
                </g>
              ))}
            </g>

            <g className={styles.edges} aria-hidden="true">
              {LINKS.map((link, index) => {
                const dimmed = selectedId !== null && !trace.edges.has(link.id);
                return (
                  <g
                    className={`${link.highlighted ? styles.highlightedEdge : ''} ${
                      dimmed ? styles.dimmed : ''
                    }`}
                    key={link.id}
                  >
                    <RoughConnector
                      className={styles.drawPath}
                      delay={100 + index * 34}
                      drawables={edgeDrawables(link, index)}
                    />
                  </g>
                );
              })}
            </g>

            <g className={styles.nodes}>
              {NODES.map((node, index) => {
                const point = POSITIONS.get(node.id)!;
                const dimmed = selectedId !== null && !trace.nodes.has(node.id);
                const selected = selectedId === node.id;
                return (
                  <g
                    aria-label={`${node.label}, ${node.role}, ${p.stateLabels[node.state]}`}
                    aria-pressed={selected}
                    className={`${styles.node} ${styles[node.state]} ${
                      dimmed ? styles.dimmed : ''
                    }`}
                    key={node.id}
                    onClick={() => selectNode(node)}
                    onKeyDown={(event) => onNodeKeyDown(event, node)}
                    role="button"
                    style={{ '--node-delay': `${180 + index * 45}ms` } as CSSProperties}
                    tabIndex={0}
                    transform={`translate(${point.x} ${point.y})`}
                  >
                    <RoughPaths drawable={nodeDrawable(node)} />
                    <text className={styles.nodeLabel} y="4">
                      {node.label}
                    </text>
                    <circle className={styles.focusRing} r={radiusFor(node.role) + 8} />
                  </g>
                );
              })}
            </g>

            <g className={styles.annotations} aria-hidden="true">
              <text x="58" y="50" className={styles.handTitle}>
                one social interaction / unfolded
              </text>
              <path d="M57 62C208 67 349 64 470 59" className={styles.titleUnderline} />

              <g className={styles.pathNote}>
                <text x="886" y="164">
                  {p.annotations.highlightedPath}
                </text>
                <line x1="886" x2="932" y1="184" y2="184" />
                <text x="944" y="189">
                  4 → 8 → 13 → 18
                </text>
              </g>

              <g className={styles.annotationNote}>
                <text x="900" y="268">
                  {p.annotations.institutionalConstraint}
                </text>
                <RoughConnector
                  drawables={annotationDrawables(
                    directedPathGeometry(
                      `M900 281C874 282 852 269 ${POSITIONS.get('16')!.x + 20} ${
                        POSITIONS.get('16')!.y + 3
                      }`,
                      {
                        x: POSITIONS.get('16')!.x + 20,
                        y: POSITIONS.get('16')!.y + 3,
                      },
                      { x: 852, y: 269 }
                    ),
                    connectorSeed(1)
                  )}
                />
              </g>

              <g className={styles.annotationNote}>
                <text x="900" y="385">
                  {p.annotations.localContext}
                </text>
                <RoughConnector
                  drawables={annotationDrawables(
                    directedPathGeometry(
                      `M900 399C874 399 852 377 ${POSITIONS.get('17')!.x + 19} ${
                        POSITIONS.get('17')!.y + 5
                      }`,
                      {
                        x: POSITIONS.get('17')!.x + 19,
                        y: POSITIONS.get('17')!.y + 5,
                      },
                      { x: 852, y: 377 }
                    ),
                    connectorSeed(2)
                  )}
                />
              </g>

              <g className={styles.nextSliceNote}>
                <text x="850" y="492">
                  {p.annotations.nextSlice}
                </text>
                <RoughConnector
                  drawables={annotationDrawables(
                    directedPathGeometry(
                      'M1083 505C1126 535 1106 570 1048 581',
                      { x: 1048, y: 581 },
                      { x: 1106, y: 570 }
                    ),
                    connectorSeed(0)
                  )}
                />
              </g>
            </g>

            <g className={styles.mathNotes} aria-hidden="true">
              <text x="62" y="565">
                Gₜ = (V, Eₜ)
              </text>
              <text x="62" y="607">
                ∀ (u → v) ∈ Eₜ : ℓ(u) &lt; ℓ(v)
              </text>
              <path d="M60 617C253 621 428 619 518 616" />
              <text x="62" y="654" className={styles.smallMath}>
                topological order π = [signals, interpretation, decisions, consequences]
              </text>

              <text x="630" y="565">
                P(V) = ∏ P(vᵢ | pa(vᵢ))
              </text>
              <text x="630" y="607">
                pa(13) = {'{'}6, 8, 9{'}'}
              </text>
              <ellipse cx="827" cy="601" rx="210" ry="29" />
              <text x="630" y="654" className={styles.smallMath}>
                acyclic here ≠ feedback-free overall
              </text>
              <path d="M896 661C985 680 1051 673 1100 646" />
            </g>

            <g className={styles.legend} aria-hidden="true">
              <g transform="translate(62 710)">
                <text x="0" y="-17" className={styles.legendTitle}>
                  {p.roleLegend}
                </text>
                <circle cx="7" cy="4" r="7" />
                <text x="22" y="9">
                  human
                </text>
                <path d="M111 11L119-3L127 11Z" />
                <text x="136" y="9">
                  AI
                </text>
                <rect x="204" y="-4" width="15" height="15" />
                <text x="229" y="9">
                  institution
                </text>
              </g>
              <g transform="translate(570 710)">
                <text x="0" y="-17" className={styles.legendTitle}>
                  {p.stateLegend}
                </text>
                <circle cx="7" cy="4" r="7" className={styles.openSwatch} />
                <text x="22" y="9">
                  {p.stateLabels.open}
                </text>
                <circle cx="203" cy="4" r="7" className={styles.hatchedSwatch} />
                <path d="M197-1L208 8M198-5L213 7M194 3L204 12" />
                <text x="220" y="9">
                  {p.stateLabels.processing}
                </text>
                <circle cx="441" cy="4" r="7" className={styles.solidSwatch} />
                <text x="456" y="9">
                  {p.stateLabels.committed}
                </text>
              </g>
              <g className={styles.connectionLegend} transform="translate(62 815)">
                <text x="0" y="-24" className={styles.legendTitle}>
                  {p.connectionLegend}
                </text>
                <g className={styles.legendOrdinary}>
                  <RoughConnector
                    drawables={legendConnectorDrawables(
                      directedPathGeometry('M0 2L70 2', { x: 70, y: 2 }, { x: 0, y: 2 }),
                      connectorSeed(0)
                    )}
                  />
                  <text x="86" y="7">
                    {p.connectionLabels.directed}
                  </text>
                </g>
                <g className={styles.legendOrdinary}>
                  <RoughConnector
                    drawables={legendConnectorDrawables(
                      directedPathGeometry(
                        'M350 2C373-14 401 18 425 2',
                        { x: 425, y: 2 },
                        { x: 401, y: 18 }
                      ),
                      connectorSeed(1)
                    )}
                  />
                  <text x="443" y="7">
                    {p.connectionLabels.routed}
                  </text>
                </g>
                <g className={styles.legendHighlighted}>
                  <RoughConnector
                    drawables={legendConnectorDrawables(
                      directedPathGeometry('M790 2L860 2', { x: 860, y: 2 }, { x: 790, y: 2 }),
                      connectorSeed(2),
                      true
                    )}
                  />
                  <text x="877" y="7">
                    {p.connectionLabels.highlighted}
                  </text>
                </g>
              </g>
            </g>
          </svg>
        </div>
        <div className={styles.caption}>
          <span>{p.annotations.interactionHint}</span>
          <strong aria-live="polite">
            {selectedNode
              ? `${selectedNode.label}: ${selectedNode.role}; ${p.stateLabels[selectedNode.state]}. ${p.annotations.clearSelection}`
              : firstStep.headline}
          </strong>
        </div>
      </div>
    </section>
  );
}
