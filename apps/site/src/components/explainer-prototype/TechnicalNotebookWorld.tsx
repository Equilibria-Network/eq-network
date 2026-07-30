import { useEffect, useMemo, useRef, useState } from 'react';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force';
import type { VisualEssayRendererProps } from '@components/visual-essay/types';
import type { ThesisState } from './ThesisPrototype';
import styles from './TechnicalNotebookWorld.module.css';
import {
  draftedEdge,
  draftedNode,
  edgeFinish,
  type EdgeGesture,
  type NotebookNodeShape,
} from './notebookDrawing';

const W = 920;
const H = 700;
const DEFECTORS = new Map([
  [3, 1],
  [8, 1],
  [13, 2],
  [18, 2],
  [23, 3],
  [6, 3],
  [11, 4],
  [16, 4],
]);

interface Node extends SimulationNodeDatum {
  id: number;
  kind: 'human' | 'ai' | 'institution';
  field: number;
}

interface Link extends SimulationLinkDatum<Node> {
  source: number | Node;
  target: number | Node;
  weak: boolean;
}

interface Point {
  x: number;
  y: number;
}

const NODES: Node[] = Array.from({ length: 28 }, (_, id) => ({
  id,
  kind: id % 8 === 0 ? 'institution' : id % 3 === 0 ? 'ai' : 'human',
  field: id % 4,
}));

type DrawingStudy = 'baseline' | 'fieldNotes' | 'pressure';

function shapeFor(node: Node, study: DrawingStudy): NotebookNodeShape {
  if (study === 'baseline') return 'circle';
  if (node.kind === 'institution') return study === 'pressure' ? 'capsule' : 'rounded-square';
  if (node.kind === 'ai') return 'triangle';
  return 'circle';
}

function gestureFor(index: number, study: DrawingStudy): EdgeGesture {
  if (study === 'baseline') return 'steady';
  if (index % (study === 'fieldNotes' ? 7 : 5) === 2) return 'sweeping';
  if (index % (study === 'fieldNotes' ? 5 : 4) === 1) return 'quick';
  return 'steady';
}

const LINKS: Link[] = NODES.flatMap((node, index) => {
  const links: Link[] = [
    { source: node.id, target: (index + 1) % NODES.length, weak: index % 6 === 0 },
  ];
  if (index % 2 === 0) {
    links.push({ source: node.id, target: (index + 5) % NODES.length, weak: index % 4 === 0 });
  }
  if (index % 5 === 0) {
    links.push({ source: node.id, target: (index + 11) % NODES.length, weak: false });
  }
  return links;
});

function endpointId(endpoint: number | Node) {
  return typeof endpoint === 'number' ? endpoint : endpoint.id;
}

function stableCoordinate(value: number) {
  return Math.round(value * 1000) / 1000;
}

function solve(
  center: Point,
  groupCenter?: (node: Node) => Point,
  linkStrength = 0.4
): Map<number, Point> {
  const nodes = NODES.map((node) => ({ ...node }));
  const links = LINKS.map((link) => ({
    ...link,
    source: endpointId(link.source),
    target: endpointId(link.target),
  }));
  const simulation = forceSimulation<Node, Link>(nodes)
    .randomSource(() => 0.41)
    .force(
      'link',
      forceLink<Node, Link>(links)
        .id((node) => node.id)
        .distance(82)
        .strength(linkStrength)
    )
    .force('charge', forceManyBody().strength(-250))
    .force('collide', forceCollide(22))
    .force('center', forceCenter(center.x, center.y))
    .stop();

  if (groupCenter) {
    simulation
      .force('x', forceX<Node>((node) => groupCenter(node).x).strength(0.22))
      .force('y', forceY<Node>((node) => groupCenter(node).y).strength(0.22));
  }
  for (let tick = 0; tick < 320; tick += 1) simulation.tick();
  return new Map(
    nodes.map((node) => [
      node.id,
      {
        x: stableCoordinate(Math.max(60, Math.min(W - 60, node.x ?? center.x))),
        y: stableCoordinate(Math.max(75, Math.min(H - 70, node.y ?? center.y))),
      },
    ])
  );
}

const INTEGRATED = solve({ x: 460, y: 350 });
const POLARIZED = solve(
  { x: 460, y: 350 },
  (node) => (DEFECTORS.has(node.id) ? { x: 685, y: 350 } : { x: 285, y: 350 }),
  0.24
);
const FIELD_CENTERS = [
  { x: 245, y: 210 },
  { x: 675, y: 210 },
  { x: 245, y: 500 },
  { x: 675, y: 500 },
];
const FIELDS = solve({ x: 460, y: 350 }, (node) => FIELD_CENTERS[node.field], 0.18);

function interpolate(from: Map<number, Point>, to: Map<number, Point>, amount: number) {
  return new Map(
    NODES.map((node) => {
      const a = from.get(node.id)!;
      const b = to.get(node.id)!;
      return [node.id, { x: a.x + (b.x - a.x) * amount, y: a.y + (b.y - a.y) * amount }];
    })
  );
}

function layoutFor(state: ThesisState) {
  if (state === 'society' || state === 'defection') return INTEGRATED;
  if (state === 'equilibria') return POLARIZED;
  if (state === 'uncertainty') return interpolate(INTEGRATED, POLARIZED, 0.78);
  return FIELDS;
}

function linkVisible(link: Link, state: ThesisState) {
  const source = NODES[endpointId(link.source)];
  const target = NODES[endpointId(link.target)];
  if (state === 'equilibria') return DEFECTORS.has(source.id) === DEFECTORS.has(target.id);
  if (state === 'knowledge' || state === 'silos' || state === 'bridge') {
    return source.field === target.field;
  }
  return true;
}

const NOTES: Record<ThesisState, { equation: string; note: string }> = {
  society: { equation: 'G₀ = (V, E)', note: 'start with the relations, not isolated agents' },
  defection: { equation: 'uᵢ(D) > uᵢ(C)', note: 'local gain → network-level loss?' },
  equilibria: { equation: 's* ∈ NE ; W(s*) < W(ŝ)', note: 'stable does not mean desirable' },
  uncertainty: { equation: 'P(Gₜ₊₁ | Gₜ, π) = ?', note: 'the missing edges matter too' },
  knowledge: { equation: 'M = {m₁, m₂, m₃, m₄}', note: 'four lenses / one object' },
  silos: { equation: 'I(mᵢ ; mⱼ) ≈ 0', note: 'translation cost is structural' },
  bridge: { equation: 'Φ : M₁ × ··· × M₄ → Π', note: 'compose, test, feed back' },
};

const FIELD_CODES = ['CAI', 'CSS', 'AF', 'CS'];

export default function TechnicalNotebookWorld({
  activeState,
  step,
}: VisualEssayRendererProps<ThesisState>) {
  const [drawingStudy, setDrawingStudy] = useState<DrawingStudy>('fieldNotes');
  const [phase, setPhase] = useState(5);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const targetPositions = useMemo(() => layoutFor(activeState), [activeState]);
  const [positions, setPositions] = useState(() => layoutFor(activeState));
  const positionsRef = useRef(positions);
  const note = NOTES[activeState];
  const draftedNodes = useMemo(
    () =>
      new Map(NODES.map((node) => [node.id, draftedNode(node.id, shapeFor(node, drawingStudy))])),
    [drawingStudy]
  );
  const showFields = ['knowledge', 'silos', 'bridge'].includes(activeState);
  const showBridge = activeState === 'bridge';
  const isPolarized = activeState === 'equilibria' || activeState === 'uncertainty';

  useEffect(() => {
    const from = new Map(
      Array.from(positionsRef.current, ([id, point]) => [id, { x: point.x, y: point.y }])
    );
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      positionsRef.current = targetPositions;
      setPositions(targetPositions);
      return;
    }

    let frame = 0;
    const started = performance.now();
    const duration = 760;
    const animate = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = new Map(
        NODES.map((node) => {
          const start = from.get(node.id)!;
          const target = targetPositions.get(node.id)!;
          return [
            node.id,
            {
              x: start.x + (target.x - start.x) * eased,
              y: start.y + (target.y - start.y) * eased,
            },
          ];
        })
      );
      positionsRef.current = next;
      setPositions(next);
      if (progress < 1) frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [targetPositions]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || activeState !== 'defection') {
      setPhase(5);
      return;
    }
    setPhase(0);
    const timer = window.setInterval(() => {
      setPhase((current) => {
        if (current >= 5) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, 145);
    return () => window.clearInterval(timer);
  }, [activeState]);

  const activeDefectors = new Set(
    Array.from(DEFECTORS)
      .filter(([, depth]) => activeState !== 'defection' || depth <= phase)
      .map(([id]) => id)
  );
  const neighborhood = new Set<number>();
  if (selectedNode !== null) {
    neighborhood.add(selectedNode);
    LINKS.forEach((link) => {
      const source = endpointId(link.source);
      const target = endpointId(link.target);
      if (source === selectedNode) neighborhood.add(target);
      if (target === selectedNode) neighborhood.add(source);
    });
  }

  return (
    <div className={styles.root}>
      <div className={styles.drawingPicker} aria-label="Notebook drawing study">
        <span>DRAWING STUDY</span>
        {(
          [
            ['baseline', '01 / clean'],
            ['fieldNotes', '02 / field notes'],
            ['pressure', '03 / pressure'],
          ] as const
        ).map(([value, label]) => (
          <button
            type="button"
            key={value}
            aria-pressed={drawingStudy === value}
            onClick={() => setDrawingStudy(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${step.stageLabel}: ${step.headline}`}
      >
        <defs>
          <pattern
            id="notebook-hatch"
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(19)"
          >
            <path d="M0 0V7" className={styles.hatchLine} />
          </pattern>
          <marker
            id="notebook-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0 0L10 5L0 10" className={styles.arrowHead} />
          </marker>
        </defs>

        <g className={styles.pageRules} aria-hidden="true">
          <path d="M46 74H874M46 622H874M72 50V646" />
          <circle cx="72" cy="74" r="3" />
          <circle cx="72" cy="622" r="3" />
        </g>
        <g className={styles.workingHeader}>
          <text x="94" y="61">
            MODEL / {String(step.id).padStart(2, '0')}
          </text>
          <text x="780" y="61">
            t = {step.id - 1}
          </text>
        </g>
        <g className={styles.hypothesisNote}>
          <text x="102" y="104">
            {note.note}
          </text>
          <path d="M288 100C332 108 360 126 381 153" />
        </g>

        {isPolarized && (
          <g className={styles.basins}>
            <path d="M78 380C76 154 251 87 430 191C512 238 499 493 365 570C202 665 79 552 78 380Z" />
            <path
              className={styles.badBasin}
              d="M493 190C614 98 831 145 851 353C873 581 667 641 533 533C443 460 421 245 493 190Z"
            />
          </g>
        )}
        {activeState === 'uncertainty' && (
          <g className={styles.possibleWorlds}>
            <path d="M106 390C122 126 383 71 630 134C845 189 899 440 732 575C529 739 87 652 106 390Z" />
            <path d="M150 350C173 138 402 105 624 165C794 211 835 431 695 537C519 670 126 584 150 350Z" />
          </g>
        )}
        {showFields &&
          FIELD_CENTERS.map((center, index) => (
            <g className={styles.fieldBoundary} key={FIELD_CODES[index]}>
              <path
                d={`M${center.x - 150},${center.y - 108}Q${center.x},${center.y - 128} ${center.x + 150},${center.y - 108}L${center.x + 145},${center.y + 106}Q${center.x},${center.y + 122} ${center.x - 150},${center.y + 106}Z`}
              />
              <text x={center.x - 132} y={center.y - 86}>
                {FIELD_CODES[index]}
              </text>
            </g>
          ))}

        <g className={styles.edges} aria-hidden="true">
          {LINKS.map((link, index) => {
            const sourceId = endpointId(link.source);
            const targetId = endpointId(link.target);
            const source = positions.get(sourceId)!;
            const target = positions.get(targetId)!;
            const sourceNode = draftedNodes.get(sourceId)!;
            const targetNode = draftedNodes.get(targetId)!;
            const finish = edgeFinish(source, target, targetNode.radius, index);
            const gesture = gestureFor(index, drawingStudy);
            const visible = linkVisible(link, activeState);
            const disrupted =
              (activeState === 'defection' || isPolarized) &&
              (activeDefectors.has(endpointId(link.source)) ||
                activeDefectors.has(endpointId(link.target)));
            return (
              <g
                key={`${endpointId(link.source)}-${endpointId(link.target)}`}
                className={`${!visible ? styles.hiddenEdge : ''} ${disrupted ? styles.disruptedEdge : ''}`}
              >
                <path
                  d={draftedEdge(
                    source,
                    target,
                    sourceNode.radius,
                    targetNode.radius,
                    index,
                    gesture
                  )}
                />
                {drawingStudy !== 'baseline' && index % 11 === 3 && (
                  <path
                    className={styles.edgeCorrection}
                    d={draftedEdge(
                      source,
                      target,
                      sourceNode.radius + 0.6,
                      targetNode.radius + 0.4,
                      index + 23,
                      'quick'
                    )}
                  />
                )}
                {finish && <path className={styles.penLift} d={finish} />}
              </g>
            );
          })}
        </g>

        {showBridge &&
          FIELD_CENTERS.map((center) => (
            <path
              key={`${center.x}-${center.y}`}
              className={styles.bridgeEdge}
              d={`M460,350Q${460 + (center.x - 460) * 0.25},${center.y} ${center.x},${center.y}`}
            />
          ))}

        <g className={styles.nodes}>
          {NODES.map((node) => {
            const point = positions.get(node.id)!;
            const drawing = draftedNodes.get(node.id)!;
            const defecting = activeDefectors.has(node.id) && activeState !== 'society';
            const dimmed = selectedNode !== null && !neighborhood.has(node.id);
            return (
              <g
                key={node.id}
                className={`${styles.node} ${defecting ? styles.defecting : ''} ${dimmed ? styles.dimmed : ''}`}
                transform={`translate(${point.x} ${point.y})`}
                role="button"
                tabIndex={0}
                aria-label={`Inspect ${node.kind} node ${node.id + 1}`}
                aria-pressed={selectedNode === node.id}
                onClick={() => setSelectedNode((current) => (current === node.id ? null : node.id))}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedNode((current) => (current === node.id ? null : node.id));
                  }
                }}
              >
                <path
                  className={`${styles.nodeShape} ${
                    drawingStudy !== 'baseline' && node.id % 6 === 2 ? styles.openNode : ''
                  }`}
                  d={drawing.outline}
                  pathLength="100"
                  transform={
                    drawingStudy !== 'baseline' && node.id % 6 === 2
                      ? `rotate(${(node.id * 41) % 180})`
                      : undefined
                  }
                />
                {drawingStudy === 'pressure' && node.id % 4 === 0 && (
                  <path
                    className={styles.pressureArc}
                    d={drawing.outline}
                    pathLength="100"
                    transform={`rotate(${(node.id * 29) % 180})`}
                  />
                )}
                {drawing.correction && (
                  <path className={styles.correctionArc} d={drawing.correction} />
                )}
                {drawingStudy !== 'baseline' && node.kind === 'ai' ? (
                  <path className={styles.nodeMark} d="M-3.4 2.8L0-3.6L3.4 2.8M-2.1 0.5H2.1" />
                ) : drawingStudy !== 'baseline' && node.kind === 'institution' ? (
                  <path
                    className={styles.nodeMark}
                    d="M-4.2 3.3H4.2M-3 2V-2M0 2V-2M3 2V-2M-4.2-3.2H4.2"
                  />
                ) : (
                  <text className={styles.nodeLabel} y="3.6">
                    {node.id + 1}
                  </text>
                )}
                <circle className={styles.selectionCircle} r={drawing.radius + 7} />
              </g>
            );
          })}
        </g>

        {showBridge && (
          <g className={styles.bridgeHub} transform="translate(460 350)">
            <circle r="50" />
            <circle r="41" />
            <text y="-4">EQ</text>
            <text y="14">Φ</text>
          </g>
        )}

        <g className={styles.mathLayer}>
          <text x="104" y="662">
            {note.equation}
          </text>
          <text className={styles.marginNote} x="590" y="662">
            follow ΔE across the transition
          </text>
          <path d="M785 642C735 616 680 606 622 616" />
        </g>
        {selectedNode !== null && (
          <g className={styles.selectionNote}>
            <text x="690" y="102">
              N(v{selectedNode + 1}) = {neighborhood.size - 1}
            </text>
            <text x="690" y="123">
              click again to release
            </text>
            <path d="M676 112C626 115 592 134 570 164" />
          </g>
        )}
      </svg>
      <div className={styles.caption}>
        <span>same entities / same world</span>
        <strong>{step.stageLabel}</strong>
        <span>select a node to inspect its neighborhood</span>
      </div>
    </div>
  );
}
