import { useEffect, useMemo, useState } from 'react';
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
import { explainerContent } from '@content/explainer';
import type { ThesisState } from './ThesisPrototype';
import styles from './ThesisWorldModel.module.css';

const W = 920;
const H = 720;
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

interface WorldNode extends SimulationNodeDatum {
  id: number;
  kind: 'human' | 'ai' | 'institution';
  sector: number;
}

interface WorldLink extends SimulationLinkDatum<WorldNode> {
  source: number | WorldNode;
  target: number | WorldNode;
  weak: boolean;
}

interface Point {
  x: number;
  y: number;
}

const NODES: WorldNode[] = Array.from({ length: 28 }, (_, id) => ({
  id,
  kind: id % 8 === 0 ? 'institution' : id % 3 === 0 ? 'ai' : 'human',
  sector: id % 4,
}));

const LINKS: WorldLink[] = NODES.flatMap((node, index) => {
  const result: WorldLink[] = [
    { source: node.id, target: (index + 1) % NODES.length, weak: index % 6 === 0 },
  ];
  if (index % 2 === 0) {
    result.push({ source: node.id, target: (index + 5) % NODES.length, weak: index % 4 === 0 });
  }
  if (index % 5 === 0) {
    result.push({ source: node.id, target: (index + 11) % NODES.length, weak: false });
  }
  return result;
});

function endpointId(endpoint: number | WorldNode) {
  return typeof endpoint === 'number' ? endpoint : endpoint.id;
}

function solve(
  center: Point,
  groupCenter?: (node: WorldNode) => Point,
  linkStrength = 0.4
): Map<number, Point> {
  const nodes = NODES.map((node) => ({ ...node }));
  const links = LINKS.map((link) => ({
    ...link,
    source: endpointId(link.source),
    target: endpointId(link.target),
  }));
  const simulation = forceSimulation<WorldNode, WorldLink>(nodes)
    .randomSource(() => 0.41)
    .force(
      'link',
      forceLink<WorldNode, WorldLink>(links)
        .id((node) => node.id)
        .distance(88)
        .strength(linkStrength)
    )
    .force('charge', forceManyBody().strength(-260))
    .force('collide', forceCollide(21))
    .force('center', forceCenter(center.x, center.y))
    .stop();

  if (groupCenter) {
    simulation
      .force('x', forceX<WorldNode>((node) => groupCenter(node).x).strength(0.2))
      .force('y', forceY<WorldNode>((node) => groupCenter(node).y).strength(0.2));
  }

  for (let tick = 0; tick < 320; tick += 1) simulation.tick();
  return new Map(nodes.map((node) => [node.id, { x: node.x ?? center.x, y: node.y ?? center.y }]));
}

const INTEGRATED = solve({ x: 460, y: 350 });
const POLARIZED = solve(
  { x: 460, y: 350 },
  (node) => (DEFECTORS.has(node.id) ? { x: 675, y: 350 } : { x: 290, y: 350 }),
  0.23
);

function transformLayout(layout: Map<number, Point>, center: Point, scale: number) {
  return new Map(
    Array.from(layout, ([id, point]) => [
      id,
      {
        x: center.x + (point.x - 460) * scale,
        y: center.y + (point.y - 350) * scale,
      },
    ])
  );
}

const OBSERVED = transformLayout(POLARIZED, { x: 460, y: 360 }, 0.54);
const GOVERNED = transformLayout(INTEGRATED, { x: 748, y: 360 }, 0.46);

function layoutFor(state: ThesisState) {
  if (state === 'society' || state === 'defection') return INTEGRATED;
  if (state === 'equilibria' || state === 'uncertainty') return POLARIZED;
  if (state === 'knowledge' || state === 'silos') return OBSERVED;
  return GOVERNED;
}

function WorldMark({
  node,
  point,
  defecting,
  recovered,
  selected,
  onSelect,
}: {
  node: WorldNode;
  point: Point;
  defecting: boolean;
  recovered: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const l = explainerContent.prototype.storyLabels.society;
  const label = node.kind === 'human' ? l.human : node.kind === 'ai' ? l.aiAgent : l.institution;
  return (
    <g
      className={`${styles.node} ${defecting ? styles.defecting : ''} ${recovered ? styles.recovered : ''} ${selected ? styles.selected : ''}`}
      transform={`translate(${point.x} ${point.y})`}
      tabIndex={0}
      role="button"
      aria-label={`${label} ${node.id + 1}`}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onSelect();
      }}
    >
      <title>{label}</title>
      {node.kind === 'human' && (
        <>
          <circle cy="-5" r="4.5" />
          <path d="M-8 9C-7 1 7 1 8 9" />
        </>
      )}
      {node.kind === 'ai' && (
        <>
          <path d="M0-9L9 0L0 9L-9 0Z" />
          <circle r="2.3" />
        </>
      )}
      {node.kind === 'institution' && (
        <>
          <path d="M-11-5L0-12L11-5Z" />
          <path d="M-9-3V8M-3-3V8M3-3V8M9-3V8M-13 9H13" />
        </>
      )}
      <circle className={styles.selectionRing} r="16" />
    </g>
  );
}

const FIELD_POSITIONS: Record<'knowledge' | 'silos', Point[]> = {
  knowledge: [
    { x: 180, y: 150 },
    { x: 740, y: 150 },
    { x: 180, y: 570 },
    { x: 740, y: 570 },
  ],
  silos: [
    { x: 180, y: 150 },
    { x: 740, y: 150 },
    { x: 180, y: 570 },
    { x: 740, y: 570 },
  ],
};

const FIELD_LABELS = [
  explainerContent.ui.fieldLabels.cooperativeAI,
  explainerContent.ui.fieldLabels.compSocialScience,
  explainerContent.ui.fieldLabels.agentFoundations,
  explainerContent.ui.fieldLabels.complexSystems,
];

function FieldLens({
  index,
  point,
  connected,
}: {
  index: number;
  point: Point;
  connected: boolean;
}) {
  return (
    <g
      className={`${styles.field} ${connected ? styles.fieldConnected : ''}`}
      transform={`translate(${point.x} ${point.y})`}
    >
      <rect x="-108" y="-42" width="216" height="84" />
      <text className={styles.fieldCode} x="-90" y="-15">
        {String(index + 1).padStart(2, '0')}
      </text>
      <text className={styles.fieldLabel} x="-90" y="15">
        {FIELD_LABELS[index]}
      </text>
      <circle cx="89" cy="0" r="10" />
      {index === 0 && <path d="M83 0L88 5L96-6" />}
      {index === 1 && <path d="M82 3Q89-10 96 3" />}
      {index === 2 && <path d="M82-5H96M82 1H96M82 7H92" />}
      {index === 3 && <path d="M82 6L88-5L95 6Z" />}
    </g>
  );
}

export default function ThesisWorldModel({
  activeState,
  step,
}: VisualEssayRendererProps<ThesisState>) {
  const [phase, setPhase] = useState(0);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const positions = useMemo(() => layoutFor(activeState), [activeState]);
  const isResearch = activeState === 'knowledge' || activeState === 'silos';
  const isBridge = activeState === 'bridge';
  const isPolarized = activeState === 'equilibria' || activeState === 'uncertainty';
  const labels = explainerContent.prototype.storyLabels;

  useEffect(() => {
    setPhase(0);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || (activeState !== 'defection' && activeState !== 'bridge')) {
      setPhase(5);
      return;
    }
    const timer = window.setInterval(() => {
      setPhase((current) => {
        if (current >= 5) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, 380);
    return () => window.clearInterval(timer);
  }, [activeState]);

  const activeDefectors = new Set(
    Array.from(DEFECTORS)
      .filter(([, depth]) => activeState !== 'defection' || depth <= phase)
      .map(([id]) => id)
  );
  const selectedNeighbors = new Set<number>();
  if (selectedNode !== null) {
    selectedNeighbors.add(selectedNode);
    for (const link of LINKS) {
      const source = endpointId(link.source);
      const target = endpointId(link.target);
      if (source === selectedNode) selectedNeighbors.add(target);
      if (target === selectedNode) selectedNeighbors.add(source);
    }
  }

  return (
    <div className={styles.root}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${step.stageLabel}: ${step.headline}`}
      >
        <defs>
          <pattern id="world-grid-small" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M18 0H0V18" className={styles.gridSmall} />
          </pattern>
          <pattern id="world-grid" width="90" height="90" patternUnits="userSpaceOnUse">
            <rect width="90" height="90" fill="url(#world-grid-small)" />
            <path d="M90 0H0V90" className={styles.gridMajor} />
          </pattern>
          <pattern id="world-hatch" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M-2 2L2-2M0 8L8 0M6 10L10 6" className={styles.hatchLine} />
          </pattern>
          <marker
            id="world-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0 0L10 5L0 10Z" className={styles.arrowHead} />
          </marker>
        </defs>
        <rect width={W} height={H} fill="url(#world-grid)" />

        <text className={styles.sceneTitle} x="460" y="48">
          {activeState === 'society' && labels.society.socialFabric}
          {activeState === 'defection' && labels.defection.cascade}
          {activeState === 'equilibria' && labels.equilibria.landscape}
          {activeState === 'uncertainty' && labels.uncertainty.ensemble}
          {activeState === 'knowledge' && labels.knowledge.lenses}
          {activeState === 'silos' && labels.silos.missingSynthesis}
          {activeState === 'bridge' && labels.bridge.newConnections}
        </text>

        {isPolarized && (
          <g className={styles.basins}>
            <ellipse cx="285" cy="360" rx="230" ry="250" />
            <ellipse className={styles.badBasin} cx="675" cy="360" rx="175" ry="220" />
            <text x="285" y="100">
              {labels.equilibria.betterForAll}
            </text>
            <text x="675" y="126">
              {labels.equilibria.stableButWorse}
            </text>
          </g>
        )}

        {activeState === 'uncertainty' && (
          <g className={styles.possibleWorlds}>
            <ellipse cx="465" cy="360" rx="355" ry="285" />
            <ellipse cx="465" cy="360" rx="320" ry="250" />
            <ellipse cx="465" cy="360" rx="280" ry="215" />
            <text x="465" y="675">
              {labels.uncertainty.unknown}
            </text>
          </g>
        )}

        {isResearch &&
          FIELD_POSITIONS[activeState].map((point, index) => (
            <g key={FIELD_LABELS[index]}>
              <path
                className={styles.observationRay}
                d={`M${point.x},${point.y + (point.y < 300 ? 42 : -42)}Q${point.x},360 460,360`}
              />
              <FieldLens index={index} point={point} connected={activeState === 'knowledge'} />
            </g>
          ))}

        {activeState === 'silos' && (
          <g className={styles.translationGap}>
            <circle cx="460" cy="360" r="145" />
            <text x="460" y="360">
              {explainerContent.prototype.annotations.citationGap}
            </text>
            <text x="460" y="380">
              {labels.silos.differentFormalisms}
            </text>
          </g>
        )}

        {isBridge && (
          <>
            {FIELD_LABELS.map((field, index) => {
              const y = 158 + index * 128;
              return (
                <g key={field}>
                  <FieldLens index={index} point={{ x: 145, y }} connected />
                  <path className={styles.bridgeInput} d={`M253 ${y}Q320 ${y} 380 360`} />
                </g>
              );
            })}
            <g className={styles.bridgeHub} transform="translate(420 360)">
              <circle r="82" />
              <circle r="66" />
              <image
                href="/img/brand/marks/sym-concentric.svg"
                x="-42"
                y="-47"
                width="84"
                height="84"
              />
              <text y="58">{explainerContent.ui.bridgeLabel}</text>
            </g>
            <path className={styles.governanceArrow} d="M502 360H572" />
            <text className={styles.governanceLabel} x="702" y="650">
              {labels.bridge.coherentGovernance}
            </text>
          </>
        )}

        <g className={styles.edges}>
          {LINKS.map((link, index) => {
            const sourceId = endpointId(link.source);
            const targetId = endpointId(link.target);
            const source = positions.get(sourceId)!;
            const target = positions.get(targetId)!;
            const disrupted = activeDefectors.has(sourceId) || activeDefectors.has(targetId);
            const restored =
              isBridge &&
              Math.max(DEFECTORS.get(sourceId) ?? 0, DEFECTORS.get(targetId) ?? 0) <= phase;
            const dimmed =
              selectedNode !== null &&
              !(selectedNeighbors.has(sourceId) && selectedNeighbors.has(targetId));
            return (
              <line
                key={`${sourceId}-${targetId}-${index}`}
                className={`${link.weak ? styles.weakEdge : ''} ${disrupted && !restored ? styles.disruptedEdge : ''} ${restored ? styles.restoredEdge : ''} ${dimmed ? styles.dimmed : ''}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
              />
            );
          })}
        </g>

        <g>
          {NODES.map((node) => {
            const depth = DEFECTORS.get(node.id);
            const defecting =
              depth !== undefined &&
              (activeState === 'defection' ||
                activeState === 'equilibria' ||
                activeState === 'uncertainty') &&
              depth <= phase;
            const recovered = isBridge && depth !== undefined && depth <= phase;
            return (
              <g
                key={node.id}
                className={
                  selectedNode !== null && !selectedNeighbors.has(node.id) ? styles.dimmed : ''
                }
              >
                <WorldMark
                  node={node}
                  point={positions.get(node.id)!}
                  defecting={defecting}
                  recovered={recovered}
                  selected={selectedNode === node.id}
                  onSelect={() =>
                    setSelectedNode((current) => (current === node.id ? null : node.id))
                  }
                />
              </g>
            );
          })}
        </g>

        {activeState === 'defection' && (
          <g className={styles.incentive}>
            <path d="M305 110H615" />
            <text x="305" y="95">
              {labels.defection.collectiveWelfare}
            </text>
            <text x="615" y="95">
              {labels.defection.localPayoff}
            </text>
          </g>
        )}

        <g className={styles.entityKey} transform="translate(270 680)">
          <circle cx="0" cy="0" r="4" />
          <text x="14" y="4">
            {labels.society.human}
          </text>
          <path d="M160-6L166 0L160 6L154 0Z" />
          <text x="176" y="4">
            {labels.society.aiAgent}
          </text>
          <rect x="320" y="-5" width="12" height="10" />
          <text x="342" y="4">
            {labels.society.institution}
          </text>
        </g>
      </svg>

      <div className={styles.caption}>
        <span>{String(step.id).padStart(2, '0')} / 07</span>
        <strong>{step.stageLabel}</strong>
        <span>
          {selectedNode === null
            ? labels.interaction.selectNode
            : `node ${selectedNode + 1} / ${labels.interaction.selectedNeighborhood}`}
        </span>
      </div>
    </div>
  );
}
