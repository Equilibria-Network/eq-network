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
import rough from 'roughjs';
import {
  NOTEBOOK_CONNECTION_PATTERNS,
  NOTEBOOK_CONNECTOR_MEDIUM,
  connectorSeed,
  openArrowHeadPath,
  type DiagramPoint,
  type NotebookConnectionPattern,
} from '@components/diagram/connectorInk';
import type { VisualEssayRendererProps } from '@components/visual-essay/types';
import { explainerContent } from '@content/explainer';
import type { ThesisState } from './ThesisPrototype';
import { draftedEdge, draftedNode, type NotebookNodeShape } from './notebookDrawing';
import styles from './NotebookNarrativeWorld.module.css';

const W = 920;
const LEGACY_H = 700;
const H = 760;
const NODE_SCALE = 1.55;
const FIELD_CENTERS = [
  { x: 245, y: 210 },
  { x: 675, y: 210 },
  { x: 245, y: 485 },
  { x: 675, y: 485 },
] as const;
const DEFECTORS = new Set([3, 6, 8, 11, 13, 16, 18]);
const CASCADE_DEPTH = new Map([
  [3, 1],
  [8, 1],
  [13, 2],
  [18, 2],
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
  crossField: boolean;
}

interface Point {
  x: number;
  y: number;
}

interface ConnectorGeometry {
  path: string;
  end: DiagramPoint;
  tangent: DiagramPoint;
}

type RoughDrawable = ReturnType<typeof connectorSketch.path>;

interface NotebookNarrativeWorldProps extends VisualEssayRendererProps<ThesisState> {
  connectorGrammar?: 'drafted' | 'notebook-v1';
}

type HatchTone =
  'neutral' | 'cooperative' | 'defecting' | 'uncertain' | 'field0' | 'field1' | 'field2' | 'field3';

const HATCH_TONES: HatchTone[] = [
  'neutral',
  'cooperative',
  'defecting',
  'uncertain',
  'field0',
  'field1',
  'field2',
  'field3',
];

const connectorSketch = rough.generator({
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

const NODES: Node[] = Array.from({ length: 20 }, (_, id) => ({
  id,
  kind: id % 8 === 0 ? 'institution' : id % 3 === 0 ? 'ai' : 'human',
  field: id % 4,
}));

const LINKS: Link[] = NODES.flatMap((node, index) => {
  const links: Link[] = [
    {
      source: node.id,
      target: (index + 4) % NODES.length,
      crossField: false,
    },
    {
      source: node.id,
      target: (index + 1) % NODES.length,
      crossField: true,
    },
  ];
  if (index % 5 === 0) {
    links.push({
      source: node.id,
      target: (index + 12) % NODES.length,
      crossField: false,
    });
  }
  return links;
});

const FIELD_META = [
  {
    code: explainerContent.prototype.fieldCodes[0],
    label: explainerContent.ui.fieldLabels.cooperativeAI,
    subtitle: explainerContent.ui.fieldSubtitles.cooperativeAI,
  },
  {
    code: explainerContent.prototype.fieldCodes[1],
    label: explainerContent.ui.fieldLabels.compSocialScience,
    subtitle: explainerContent.ui.fieldSubtitles.compSocialScience,
  },
  {
    code: explainerContent.prototype.fieldCodes[2],
    label: explainerContent.ui.fieldLabels.agentFoundations,
    subtitle: explainerContent.ui.fieldSubtitles.agentFoundations,
  },
  {
    code: explainerContent.prototype.fieldCodes[3],
    label: explainerContent.ui.fieldLabels.complexSystems,
    subtitle: explainerContent.ui.fieldSubtitles.complexSystems,
  },
] as const;

const NOTES: Record<ThesisState, { equation: string; note: string }> = {
  society: { equation: 'G = (V, E)', note: 'V = actors ; E = relationships' },
  defection: {
    equation: 'uᵢ(D, s₋ᵢ) > uᵢ(C, s₋ᵢ)',
    note: 'defection pays more, given everyone else',
  },
  equilibria: {
    equation: 's* ∈ NE ∧ W(s*) < W(ŝ)',
    note: 'stable can still be worse for everyone',
  },
  uncertainty: {
    equation: 'P(Gₜ₊₁ | Gₜ, π) = ?',
    note: 'the next network state remains unresolved',
  },
  knowledge: {
    equation: 'M = {m_CAI, m_CSS, m_AF, m_CS}',
    note: 'four named model families / one problem',
  },
  silos: {
    equation: '|E_between| ≪ |E_within|',
    note: 'knowledge exists; translation edges are sparse',
  },
  bridge: {
    equation: 'eq ∈ V ; E_bridge ⊂ V × V',
    note: 'one participant helps a distributed mesh connect',
  },
};

function endpointId(endpoint: number | Node) {
  return typeof endpoint === 'number' ? endpoint : endpoint.id;
}

function stableCoordinate(value: number) {
  return Math.round(value * 1000) / 1000;
}

function solve(
  center: Point,
  groupCenter?: (node: Node) => Point,
  linkStrength = 0.4,
  groupStrength = 0.28,
  density: 'legacy' | 'expanded' = 'legacy'
): Map<number, Point> {
  const expanded = density === 'expanded';
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
        .distance(expanded ? 96 : 76)
        .strength(linkStrength)
    )
    .force('charge', forceManyBody().strength(expanded ? -270 : -225))
    .force('collide', forceCollide(expanded ? 34 : 23))
    .force('center', forceCenter(center.x, center.y))
    .stop();

  if (groupCenter) {
    simulation
      .force('x', forceX<Node>((node) => groupCenter(node).x).strength(groupStrength))
      .force('y', forceY<Node>((node) => groupCenter(node).y).strength(groupStrength));
  }
  for (let tick = 0; tick < 340; tick += 1) simulation.tick();
  return new Map(
    nodes.map((node) => [
      node.id,
      {
        x: stableCoordinate(Math.max(80, Math.min(W - 80, node.x ?? center.x))),
        y: stableCoordinate(Math.max(118, Math.min(H - 110, node.y ?? center.y))),
      },
    ])
  );
}

function interpolate(from: Map<number, Point>, to: Map<number, Point>, amount: number) {
  return new Map(
    NODES.map((node) => {
      const a = from.get(node.id)!;
      const b = to.get(node.id)!;
      return [node.id, { x: a.x + (b.x - a.x) * amount, y: a.y + (b.y - a.y) * amount }];
    })
  );
}

const INTEGRATED = solve({ x: 460, y: 350 });
const POLARIZED = solve(
  { x: 460, y: 350 },
  (node) => (DEFECTORS.has(node.id) ? { x: 690, y: 350 } : { x: 280, y: 350 }),
  0.12,
  0.78
);
const STRESSED = interpolate(INTEGRATED, POLARIZED, 0.38);
const FIELDS = solve({ x: 460, y: 350 }, (node) => FIELD_CENTERS[node.field], 0.1, 0.5);

const INTEGRATED_NOTEBOOK = solve({ x: 460, y: 350 }, undefined, 0.4, 0.28, 'expanded');
const POLARIZED_NOTEBOOK = solve(
  { x: 460, y: 350 },
  (node) => (DEFECTORS.has(node.id) ? { x: 690, y: 350 } : { x: 280, y: 350 }),
  0.12,
  0.78,
  'expanded'
);
const STRESSED_NOTEBOOK = interpolate(INTEGRATED_NOTEBOOK, POLARIZED_NOTEBOOK, 0.38);
const FIELDS_NOTEBOOK = solve(
  { x: 460, y: 350 },
  (node) => FIELD_CENTERS[node.field],
  0.1,
  0.5,
  'expanded'
);

function layoutFor(state: ThesisState, expanded = false) {
  if (state === 'society' || state === 'uncertainty') {
    return expanded ? INTEGRATED_NOTEBOOK : INTEGRATED;
  }
  if (state === 'defection') return expanded ? STRESSED_NOTEBOOK : STRESSED;
  if (state === 'equilibria') return expanded ? POLARIZED_NOTEBOOK : POLARIZED;
  return expanded ? FIELDS_NOTEBOOK : FIELDS;
}

function shapeFor(node: Node): NotebookNodeShape {
  if (node.kind === 'institution') return 'rounded-square';
  if (node.kind === 'ai') return 'triangle';
  return 'circle';
}

function nodeRadius(drawing: ReturnType<typeof draftedNode>, expanded: boolean) {
  return drawing.radius * (expanded ? NODE_SCALE : 1);
}

function statusFor(node: Node, state: ThesisState) {
  if (state === 'society' || state === 'knowledge' || state === 'silos' || state === 'bridge') {
    return 'neutral';
  }
  if (state === 'uncertainty') {
    if (node.id % 5 === 0 || node.id % 7 === 0) return 'uncertain';
    return DEFECTORS.has(node.id) ? 'defecting' : 'cooperative';
  }
  return DEFECTORS.has(node.id) ? 'defecting' : 'cooperative';
}

function edgeVisible(link: Link, state: ThesisState, index: number) {
  const source = NODES[endpointId(link.source)];
  const target = NODES[endpointId(link.target)];
  if (state === 'society') return !link.crossField || index % 8 === 1;
  if (state === 'uncertainty') return !link.crossField || index % 5 === 0;
  if (state === 'equilibria') {
    return DEFECTORS.has(source.id) === DEFECTORS.has(target.id) && index % 3 !== 1;
  }
  if (state === 'knowledge' || state === 'silos' || state === 'bridge') {
    return source.field === target.field;
  }
  return true;
}

function connectorPath(source: Point, target: Point, sourceGap = 0, targetGap = 0, bend = 0) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const start = { x: source.x + ux * sourceGap, y: source.y + uy * sourceGap };
  const end = { x: target.x - ux * targetGap, y: target.y - uy * targetGap };
  const control = {
    x: (start.x + end.x) / 2 - uy * bend,
    y: (start.y + end.y) / 2 + ux * bend,
  };
  return `M${stableCoordinate(start.x)} ${stableCoordinate(start.y)} Q${stableCoordinate(
    control.x
  )} ${stableCoordinate(control.y)} ${stableCoordinate(end.x)} ${stableCoordinate(end.y)}`;
}

function sigmoidConnectorPath(source: Point, target: Point, targetGap = 0) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const length = Math.hypot(dx, dy) || 1;
  const end = {
    x: target.x - (dx / length) * targetGap,
    y: target.y - (dy / length) * targetGap,
  };
  const curveDx = end.x - source.x;
  const curveDy = end.y - source.y;
  const perpendicular = { x: -curveDy / length, y: curveDx / length };
  const control1 = {
    x: source.x + curveDx * 0.34 + perpendicular.x * 12,
    y: source.y + curveDy * 0.12 + perpendicular.y * 12,
  };
  const control2 = {
    x: source.x + curveDx * 0.66 - perpendicular.x * 12,
    y: source.y + curveDy * 0.88 - perpendicular.y * 12,
  };
  return `M${stableCoordinate(source.x)} ${stableCoordinate(source.y)} C${stableCoordinate(
    control1.x
  )} ${stableCoordinate(control1.y)} ${stableCoordinate(control2.x)} ${stableCoordinate(
    control2.y
  )} ${stableCoordinate(end.x)} ${stableCoordinate(end.y)}`;
}

function routedConnectorGeometry(
  source: Point,
  target: Point,
  sourceGap: number,
  targetGap: number,
  index: number
): ConnectorGeometry {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const start = { x: source.x + ux * sourceGap, y: source.y + uy * sourceGap };
  const end = { x: target.x - ux * targetGap, y: target.y - uy * targetGap };

  if (index % 6 === 0) {
    return {
      path: `M${stableCoordinate(start.x)} ${stableCoordinate(start.y)}L${stableCoordinate(
        end.x
      )} ${stableCoordinate(end.y)}`,
      end,
      tangent: { x: end.x - start.x, y: end.y - start.y },
    };
  }

  const bendSign = index % 2 === 0 ? 1 : -1;
  const bend = bendSign * (index % 9 === 4 ? 18 : 8);
  if (index % 7 !== 2) {
    const control = {
      x: (start.x + end.x) / 2 - uy * bend,
      y: (start.y + end.y) / 2 + ux * bend,
    };
    return {
      path: `M${stableCoordinate(start.x)} ${stableCoordinate(start.y)}Q${stableCoordinate(
        control.x
      )} ${stableCoordinate(control.y)} ${stableCoordinate(end.x)} ${stableCoordinate(end.y)}`,
      end,
      tangent: { x: end.x - control.x, y: end.y - control.y },
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
    path: `M${stableCoordinate(start.x)} ${stableCoordinate(start.y)}C${stableCoordinate(
      firstControl.x
    )} ${stableCoordinate(firstControl.y)} ${stableCoordinate(
      secondControl.x
    )} ${stableCoordinate(secondControl.y)} ${stableCoordinate(end.x)} ${stableCoordinate(end.y)}`,
    end,
    tangent: { x: end.x - secondControl.x, y: end.y - secondControl.y },
  };
}

function pathGeometry(
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

function sigmoidConnectorGeometry(source: Point, target: Point, targetGap = 0): ConnectorGeometry {
  const path = sigmoidConnectorPath(source, target, targetGap);
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const length = Math.hypot(dx, dy) || 1;
  const end = {
    x: target.x - (dx / length) * targetGap,
    y: target.y - (dy / length) * targetGap,
  };
  const curveDx = end.x - source.x;
  const curveDy = end.y - source.y;
  const perpendicular = { x: -curveDy / length, y: curveDx / length };
  const control2 = {
    x: source.x + curveDx * 0.66 - perpendicular.x * 12,
    y: source.y + curveDy * 0.88 - perpendicular.y * 12,
  };
  return pathGeometry(path, end, control2);
}

function RoughPaths({
  drawable,
  dashArray,
  className,
  dataAnnotation,
}: {
  drawable: RoughDrawable;
  dashArray?: string;
  className?: string;
  dataAnnotation?: string;
}) {
  return connectorSketch
    .toPaths(drawable)
    .map((path, index) => (
      <path
        className={className}
        data-annotation={index === 0 ? dataAnnotation : undefined}
        d={path.d}
        fill={path.fill}
        key={`${path.d}-${index}`}
        stroke={path.stroke}
        strokeWidth={path.strokeWidth}
        style={{ strokeDasharray: dashArray ?? 'none' }}
        vectorEffect="non-scaling-stroke"
      />
    ));
}

function RoughConnector({
  geometry,
  seedIndex,
  pattern = NOTEBOOK_CONNECTION_PATTERNS.solid,
  arrow = false,
  className,
  dataAnnotation,
  strokeWidth = NOTEBOOK_CONNECTOR_MEDIUM.strokeWidth,
}: {
  geometry: ConnectorGeometry;
  seedIndex: number;
  pattern?: NotebookConnectionPattern;
  arrow?: boolean;
  className?: string;
  dataAnnotation?: string;
  strokeWidth?: number;
}) {
  const seed = connectorSeed(seedIndex);
  const common = { stroke: 'currentColor', fill: 'none' };
  const shaft = connectorSketch.path(geometry.path, {
    ...common,
    seed,
    strokeWidth,
  });
  const head = arrow
    ? connectorSketch.path(openArrowHeadPath(geometry.end, geometry.tangent, 12, 5.8), {
        ...common,
        seed: seed + 37,
        strokeWidth: Math.min(strokeWidth, 1.8),
      })
    : null;

  return (
    <>
      <RoughPaths
        className={className}
        dashArray={pattern.dashArray}
        dataAnnotation={dataAnnotation}
        drawable={shaft}
      />
      {head && <RoughPaths className={className} drawable={head} />}
    </>
  );
}

function edgePattern(
  state: ThesisState,
  link: Link,
  disrupted: boolean,
  possible: boolean
): NotebookConnectionPattern {
  if (possible) return NOTEBOOK_CONNECTION_PATTERNS.dotOpen;
  if (state === 'silos' && link.crossField) return NOTEBOOK_CONNECTION_PATTERNS.dotDense;
  if (disrupted) return NOTEBOOK_CONNECTION_PATTERNS.dashLong;
  if (link.crossField) return NOTEBOOK_CONNECTION_PATTERNS.dashShort;
  return NOTEBOOK_CONNECTION_PATTERNS.solid;
}

function hatchToneFor(node: Node, state: ThesisState, status: string): HatchTone {
  if (state === 'knowledge' || state === 'silos' || state === 'bridge') {
    return `field${node.field}` as HatchTone;
  }
  return status as HatchTone;
}

function closestCrossFieldPair(
  positions: Map<number, Point>,
  sourceField: number,
  targetField: number
) {
  const sources = NODES.filter((node) => node.field === sourceField);
  const targets = NODES.filter((node) => node.field === targetField);
  let closest = { source: sources[0], target: targets[0], distance: Number.POSITIVE_INFINITY };
  sources.forEach((source) => {
    targets.forEach((target) => {
      const a = positions.get(source.id)!;
      const b = positions.get(target.id)!;
      const distance = Math.hypot(b.x - a.x, b.y - a.y);
      if (distance < closest.distance) closest = { source, target, distance };
    });
  });
  return closest;
}

function connectionEntries(state: ThesisState) {
  const labels = explainerContent.prototype.storyLabels.connections;
  const entries: Array<{
    label: string;
    pattern: NotebookConnectionPattern;
    arrow: boolean;
  }> =
    state === 'society'
      ? [
          {
            label: labels.relation,
            pattern: NOTEBOOK_CONNECTION_PATTERNS.solid,
            arrow: false,
          },
          {
            label: labels.directionalFlow,
            pattern: NOTEBOOK_CONNECTION_PATTERNS.dashShort,
            arrow: true,
          },
        ]
      : state === 'defection' || state === 'equilibria'
        ? [
            {
              label: labels.relation,
              pattern: NOTEBOOK_CONNECTION_PATTERNS.solid,
              arrow: false,
            },
            {
              label: labels.weakenedTie,
              pattern: NOTEBOOK_CONNECTION_PATTERNS.dashLong,
              arrow: true,
            },
          ]
        : state === 'uncertainty'
          ? [
              {
                label: labels.relation,
                pattern: NOTEBOOK_CONNECTION_PATTERNS.solid,
                arrow: false,
              },
              {
                label: labels.possibleTie,
                pattern: NOTEBOOK_CONNECTION_PATTERNS.dotOpen,
                arrow: true,
              },
            ]
          : state === 'bridge'
            ? [
                {
                  label: labels.withinField,
                  pattern: NOTEBOOK_CONNECTION_PATTERNS.solid,
                  arrow: false,
                },
                {
                  label: labels.translation,
                  pattern: NOTEBOOK_CONNECTION_PATTERNS.dashShort,
                  arrow: true,
                },
              ]
            : [
                {
                  label: labels.withinField,
                  pattern: NOTEBOOK_CONNECTION_PATTERNS.solid,
                  arrow: false,
                },
                {
                  label: labels.possibleTie,
                  pattern:
                    state === 'silos'
                      ? NOTEBOOK_CONNECTION_PATTERNS.dotDense
                      : NOTEBOOK_CONNECTION_PATTERNS.dotOpen,
                  arrow: true,
                },
              ];
  return entries;
}

function UnifiedLegend({ state }: { state: ThesisState }) {
  const triangle = draftedNode(83, 'triangle');
  const institution = draftedNode(97, 'rounded-square');
  const societyLabels = explainerContent.prototype.storyLabels.society;
  const stateLabels = explainerContent.prototype.storyLabels.strategicState;
  const connectionLabels = explainerContent.prototype.storyLabels.connections;
  const stateEntries =
    state === 'defection' || state === 'equilibria' || state === 'uncertainty'
      ? [
          { key: 'cooperative', label: stateLabels.cooperate.replace('green / ', '') },
          { key: 'defecting', label: stateLabels.defect.replace('red / ', '') },
          ...(state === 'uncertainty'
            ? [{ key: 'uncertain', label: stateLabels.unresolved.replace('amber / ', '') }]
            : []),
        ]
      : [];
  const connections = connectionEntries(state);
  const connectionStart = stateEntries.length > 0 ? 615 : 380;
  const compactConnectionLabel = (label: string) =>
    label
      .replace('observed relation', 'relation')
      .replace('weakened / broken tie', 'weakened / broken')
      .replace('possible / unobserved tie', 'possible / unobserved')
      .replace('within-field relation', 'within-field')
      .replace('translation edge', 'translation');

  return (
    <g
      className={styles.legendRow}
      transform="translate(42 682)"
      role="group"
      aria-label="diagram legend"
    >
      <g data-legend="actor-type" role="group" aria-label={societyLabels.nodeTypes}>
        <text className={styles.legendLabel} x="0" y="4">
          shape
        </text>
        <circle cx="36" r="7" />
        <text x="47" y="4">
          {societyLabels.humanKey}
        </text>
        <path
          transform="translate(111) scale(.7)"
          d={triangle.outline}
          style={{ fill: 'url(#narrative-neutral-ai-hatch)' }}
        />
        <text x="122" y="4">
          {societyLabels.aiAgentKey}
        </text>
        <path
          transform="translate(232) scale(.7)"
          d={institution.outline}
          style={{ fill: 'url(#narrative-neutral-institution-hatch)' }}
        />
        <text x="243" y="4">
          {societyLabels.institutionKey}
        </text>
      </g>
      {stateEntries.length > 0 && (
        <g
          data-legend="strategic-state"
          role="group"
          aria-label={stateLabels.label}
          transform="translate(355)"
        >
          <text className={styles.legendLabel} x="0" y="4">
            state
          </text>
          {stateEntries.map((entry, index) => (
            <g
              className={styles[entry.key]}
              key={entry.key}
              transform={`translate(${40 + index * 78} 0)`}
            >
              <line x1="0" x2="14" />
              <text x="20" y="4">
                {entry.label}
              </text>
            </g>
          ))}
        </g>
      )}
      <g
        data-legend="connection-pattern"
        role="group"
        aria-label={connectionLabels.label}
        transform={`translate(${connectionStart})`}
      >
        <text className={styles.legendLabel} x="0" y="4">
          edge
        </text>
        {connections.map((entry, index) => (
          <g key={entry.label} transform={`translate(${37 + index * 130} 0)`}>
            <RoughConnector
              arrow={entry.arrow}
              geometry={pathGeometry('M0 0L34 0', { x: 34, y: 0 }, { x: 0, y: 0 })}
              pattern={entry.pattern}
              seedIndex={index + 1}
            />
            <text x="42" y="4">
              {compactConnectionLabel(entry.label)}
            </text>
          </g>
        ))}
      </g>
    </g>
  );
}

function LegacyShapeLegend() {
  const triangle = draftedNode(83, 'triangle');
  const institution = draftedNode(97, 'rounded-square');
  const labels = explainerContent.prototype.storyLabels.society;
  return (
    <g
      className={styles.nodeKey}
      transform="translate(225 638)"
      data-legend="actor-type"
      role="group"
      aria-label={labels.nodeTypes}
    >
      <circle cx="0" r="8" />
      <text x="17" y="4">
        {labels.humanKey}
      </text>
      <path
        transform="translate(170)"
        d={triangle.outline}
        style={{ fill: 'url(#narrative-neutral-ai-hatch)' }}
      />
      <text x="188" y="4">
        {labels.aiAgentKey}
      </text>
      <path
        transform="translate(390)"
        d={institution.outline}
        style={{ fill: 'url(#narrative-neutral-institution-hatch)' }}
      />
      <text x="408" y="4">
        {labels.institutionKey}
      </text>
    </g>
  );
}

function LegacyStrategicStateLegend({ state }: { state: ThesisState }) {
  if (state !== 'defection' && state !== 'equilibria' && state !== 'uncertainty') return null;
  const labels = explainerContent.prototype.storyLabels.strategicState;
  const entries = [
    { key: 'cooperative', label: labels.cooperate },
    { key: 'defecting', label: labels.defect },
    ...(state === 'uncertainty' ? [{ key: 'uncertain', label: labels.unresolved }] : []),
  ];
  return (
    <g
      className={styles.strategicLegend}
      transform={`translate(${state === 'uncertainty' ? 235 : 300} 607)`}
      data-legend="strategic-state"
      role="group"
      aria-label={labels.label}
    >
      <text className={styles.strategicLegendTitle} x="-105" y="4">
        {labels.label}:
      </text>
      {entries.map((entry, index) => (
        <g className={styles[entry.key]} key={entry.key} transform={`translate(${index * 180} 0)`}>
          <line x1="0" x2="18" />
          <text x="27" y="4">
            {entry.label}
          </text>
        </g>
      ))}
    </g>
  );
}

function FieldFrames({ state }: { state: ThesisState }) {
  if (!['knowledge', 'silos', 'bridge'].includes(state)) return null;
  return (
    <g className={styles.fieldFrames}>
      {FIELD_CENTERS.map((center, index) => {
        const meta = FIELD_META[index];
        return (
          <g
            key={meta.code}
            className={styles[`field${index}`]}
            transform={`translate(${center.x} ${center.y})`}
          >
            <path d="M-158-105Q0-124 158-105L151 106Q0 122-151 106Z" />
            <text className={styles.fieldCode} x="-139" y="-80">
              {meta.code}
            </text>
            <text className={styles.fieldLabel} y="-78">
              {meta.label}
            </text>
            {state === 'knowledge' && (
              <text className={styles.fieldSubtitle} y="91">
                {meta.subtitle}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

function SceneAnnotations({
  state,
  positions,
  roughConnectors,
}: {
  state: ThesisState;
  positions: Map<number, Point>;
  roughConnectors: boolean;
}) {
  const labels = explainerContent.prototype.storyLabels;
  if (state === 'society') {
    return (
      <g className={styles.annotations}>
        <text className={styles.sceneTitle} x="460" y="105">
          {labels.society.socialFabric}
        </text>
        <text className={styles.flowLabels} x="460" y="590">
          {labels.society.relationsCarry}: {labels.society.flows.join(' · ')}
        </text>
      </g>
    );
  }
  if (state === 'defection') {
    const cascadeTarget = positions.get(3)!;
    const labelPoint = {
      x: Math.min(W - 185, cascadeTarget.x + 58),
      y: Math.max(145, cascadeTarget.y - 68),
    };
    return (
      <g className={styles.annotations}>
        <text className={styles.sceneTitle} x="460" y="105">
          {labels.defection.cascade}
        </text>
        <g className={styles.payoffNote}>
          <text x={labelPoint.x} y={labelPoint.y}>
            {labels.defection.localPayoff} ↑
          </text>
          {roughConnectors ? (
            <RoughConnector
              arrow
              className={styles.roughAnnotationPath}
              dataAnnotation="local-payoff"
              geometry={sigmoidConnectorGeometry(
                { x: labelPoint.x - 10, y: labelPoint.y + 11 },
                cascadeTarget,
                21
              )}
              pattern={NOTEBOOK_CONNECTION_PATTERNS.dashLong}
              seedIndex={1}
            />
          ) : (
            <path
              data-annotation="local-payoff"
              d={sigmoidConnectorPath(
                { x: labelPoint.x - 10, y: labelPoint.y + 11 },
                cascadeTarget,
                21
              )}
            />
          )}
        </g>
        <text className={styles.welfareNote} x="690" y="565">
          {labels.defection.collectiveWelfare} ↓
        </text>
      </g>
    );
  }
  if (state === 'equilibria') {
    const cooperativePoints = NODES.filter((node) => !DEFECTORS.has(node.id)).map((node) =>
      positions.get(node.id)!
    );
    const defectingPoints = NODES.filter((node) => DEFECTORS.has(node.id)).map((node) =>
      positions.get(node.id)!
    );
    const cooperativeRight = Math.max(...cooperativePoints.map((point) => point.x));
    const defectingLeft = Math.min(...defectingPoints.map((point) => point.x));
    const routeY = Math.max(
      142,
      Math.min(...[...cooperativePoints, ...defectingPoints].map((point) => point.y)) - 38
    );
    const routeStart = { x: defectingLeft - 12, y: routeY };
    const routeEnd = { x: cooperativeRight + 12, y: routeY };
    const routeMiddle = (routeStart.x + routeEnd.x) / 2;
    return (
      <g className={styles.annotations}>
        <text className={styles.sceneTitle} x="460" y="105">
          {labels.equilibria.landscape}
        </text>
        <text className={styles.cooperativeLabel} x="275" y="565">
          E₁ / {labels.equilibria.betterForAll}
        </text>
        <text className={styles.defectingLabel} x="685" y="565">
          E₂ / {labels.equilibria.stableButWorse}
        </text>
        <g className={styles.blockedMove}>
          {roughConnectors ? (
            <RoughConnector
              arrow
              className={styles.roughAnnotationPath}
              geometry={routedConnectorGeometry(routeStart, routeEnd, 0, 0, 2)}
              pattern={NOTEBOOK_CONNECTION_PATTERNS.dashLong}
              seedIndex={2}
            />
          ) : (
            <path d={connectorPath(routeStart, routeEnd, 0, 0, -18)} />
          )}
          <path
            d={`M${routeMiddle - 9} ${routeY - 3}L${routeMiddle + 9} ${
              routeY + 15
            }M${routeMiddle + 9} ${routeY - 3}L${routeMiddle - 9} ${routeY + 15}`}
          />
          <text x={routeMiddle} y={routeY - 22}>
            {labels.equilibria.unilateralMove}
          </text>
        </g>
      </g>
    );
  }
  if (state === 'uncertainty') {
    const questionNodes = [2, 7, 12, 17];
    return (
      <g className={styles.annotations}>
        <text className={styles.sceneTitle} x="460" y="105">
          {labels.uncertainty.ensemble}
        </text>
        {questionNodes.map((id) => {
          const point = positions.get(id)!;
          return (
            <text className={styles.questionMark} key={id} x={point.x + 16} y={point.y - 13}>
              ?
            </text>
          );
        })}
        <text className={styles.unknownLabel} x="460" y="570">
          {labels.uncertainty.unknown}
        </text>
      </g>
    );
  }
  if (state === 'knowledge') {
    return (
      <g className={styles.annotations}>
        <text className={styles.sceneTitle} x="460" y="105">
          {labels.knowledge.lenses}
        </text>
        <g className={styles.sharedQuestion} transform="translate(460 350)">
          <circle r="68" />
          <circle r="59" />
          <text y="-4">ONE QUESTION</text>
          <text y="14">{labels.knowledge.sharedQuestion}</text>
        </g>
      </g>
    );
  }
  if (state === 'silos') {
    return (
      <g className={styles.annotations}>
        <text className={styles.sceneTitle} x="460" y="105">
          four subnetworks / no translation layer
        </text>
        <g className={styles.translationGap} transform="translate(460 350)">
          <circle r="58" />
          <text y="-5">∄</text>
          <text y="17">{explainerContent.prototype.annotations.citationGap}</text>
        </g>
        <text className={styles.siloNote} x="460" y="620">
          {labels.silos.differentVenues} · {labels.silos.differentFormalisms} ·{' '}
          {labels.silos.missingSynthesis}
        </text>
      </g>
    );
  }
  return (
    <g className={styles.annotations}>
      <text className={styles.sceneTitle} x="460" y="105">
        {labels.bridge.newConnections}
      </text>
      <g className={styles.bridgeHub} transform="translate(460 350)">
        <path d={draftedNode(101, 'circle').outline} transform="scale(2.15)" />
        <text y="5">EQ</text>
      </g>
      <text className={styles.bridgeActions} x="460" y="598">
        {labels.bridge.translate} · {labels.bridge.compose} · {labels.bridge.test} →{' '}
        {labels.bridge.coherentGovernance}
      </text>
    </g>
  );
}

export default function NotebookNarrativeWorld({
  activeState,
  step,
  connectorGrammar = 'drafted',
}: NotebookNarrativeWorldProps) {
  const roughConnectors = connectorGrammar === 'notebook-v1';
  const targetPositions = useMemo(
    () => layoutFor(activeState, roughConnectors),
    [activeState, roughConnectors]
  );
  const [positions, setPositions] = useState(() => layoutFor(activeState, roughConnectors));
  const positionsRef = useRef(positions);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [cascadePhase, setCascadePhase] = useState(4);
  const drawings = useMemo(
    () => new Map(NODES.map((node) => [node.id, draftedNode(node.id, shapeFor(node))])),
    []
  );
  const note = NOTES[activeState];

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
    const animate = (now: number) => {
      const progress = Math.min(1, (now - started) / 760);
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
      setCascadePhase(4);
      return;
    }
    setCascadePhase(0);
    const timer = window.setInterval(() => {
      setCascadePhase((current) => {
        if (current >= 4) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, 180);
    return () => window.clearInterval(timer);
  }, [activeState]);

  const activeDefectors = new Set(
    Array.from(CASCADE_DEPTH)
      .filter(([, depth]) => activeState !== 'defection' || depth <= cascadePhase)
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
    <div className={styles.root} data-connector-grammar={connectorGrammar} data-scene={activeState}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${roughConnectors ? H : LEGACY_H}`}
        role="img"
        aria-label={`${step.stageLabel}: ${step.headline}`}
      >
        <title>{step.headline}</title>
        <desc>{step.body}</desc>
        <defs>
          {HATCH_TONES.flatMap((tone) => [
            <pattern
              id={`narrative-${tone}-ai-hatch`}
              key={`${tone}-ai`}
              width="7"
              height="7"
              patternUnits="userSpaceOnUse"
              className={styles[`${tone}Hatch`]}
            >
              <path d="M-1 1L1-1M0 7L7 0M6 8L8 6" className={styles.nodeHatchLine} />
            </pattern>,
            <pattern
              id={`narrative-${tone}-institution-hatch`}
              key={`${tone}-institution`}
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
              className={styles[`${tone}Hatch`]}
            >
              <path d="M-1 1L1-1M0 5L5 0M4 6L6 4" className={styles.nodeHatchLine} />
              <path d="M-1 4L1 6M0 0L5 5M4-1L6 1" className={styles.institutionHatchLine} />
            </pattern>,
          ])}
          <pattern
            id="narrative-basin-hatch"
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(19)"
          >
            <path d="M0 0V7" className={styles.hatchLine} />
          </pattern>
          {!roughConnectors && (
            <marker
              id="narrative-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M0 0L10 5L0 10" className={styles.arrowHead} />
            </marker>
          )}
        </defs>

        {activeState === 'equilibria' && (
          <g className={styles.basins} aria-hidden="true">
            <path d="M82 370C78 156 242 98 425 186C510 227 496 491 361 557C202 636 83 553 82 370Z" />
            <path
              className={styles.badBasin}
              d="M493 186C622 103 831 151 849 353C869 574 674 630 535 528C445 461 422 244 493 186Z"
            />
          </g>
        )}
        {activeState === 'uncertainty' && (
          <g className={styles.possibleWorlds} aria-hidden="true">
            <path d="M112 375C125 142 369 92 624 143C842 187 887 437 727 566C526 727 96 638 112 375Z" />
            <path d="M151 353C176 156 397 119 616 169C789 208 828 427 690 526C514 652 130 578 151 353Z" />
          </g>
        )}

        <FieldFrames state={activeState} />

        <g
          className={`${styles.edges} ${roughConnectors ? styles.roughEdges : ''}`}
          aria-hidden="true"
        >
          {LINKS.map((link, index) => {
            const sourceId = endpointId(link.source);
            const targetId = endpointId(link.target);
            const source = positions.get(sourceId)!;
            const target = positions.get(targetId)!;
            const sourceDrawing = drawings.get(sourceId)!;
            const targetDrawing = drawings.get(targetId)!;
            const visible =
              edgeVisible(link, activeState, index) ||
              (roughConnectors && activeState === 'silos' && link.crossField && index % 7 === 1);
            const disrupted =
              (activeState === 'defection' || activeState === 'equilibria') &&
              (activeDefectors.has(sourceId) || activeDefectors.has(targetId));
            const possible = activeState === 'uncertainty' && index % 4 === 1;
            const className = `${!visible ? styles.hiddenEdge : ''} ${
              disrupted ? styles.disruptedEdge : ''
            } ${possible ? styles.possibleEdge : ''}`;
            if (roughConnectors) {
              const directed = link.crossField || disrupted || possible;
              return (
                <RoughConnector
                  arrow={directed}
                  className={className}
                  geometry={routedConnectorGeometry(
                    source,
                    target,
                    nodeRadius(sourceDrawing, true) + 2,
                    nodeRadius(targetDrawing, true) + (directed ? 10 : 2),
                    index
                  )}
                  key={`${sourceId}-${targetId}-${index}`}
                  pattern={edgePattern(activeState, link, disrupted, possible)}
                  seedIndex={index}
                />
              );
            }
            return (
              <path
                key={`${sourceId}-${targetId}-${index}`}
                className={className}
                d={draftedEdge(
                  source,
                  target,
                  sourceDrawing.radius,
                  targetDrawing.radius,
                  index,
                  index % 7 === 2 ? 'sweeping' : 'steady'
                )}
              />
            );
          })}
        </g>

        {activeState === 'bridge' && (
          <g className={styles.bridgeEdges} aria-hidden="true">
            {(
              [
                [0, 1],
                [0, 2],
                [1, 3],
                [2, 3],
              ] as const
            ).map(([sourceField, targetField], index) => {
              const pair = closestCrossFieldPair(positions, sourceField, targetField);
              const source = positions.get(pair.source.id)!;
              const target = positions.get(pair.target.id)!;
              const sourceRadius = nodeRadius(drawings.get(pair.source.id)!, roughConnectors);
              const targetRadius = nodeRadius(drawings.get(pair.target.id)!, roughConnectors);
              if (roughConnectors) {
                return (
                  <RoughConnector
                    arrow
                    className={styles.crossFieldDiscovery}
                    geometry={routedConnectorGeometry(
                      source,
                      target,
                      sourceRadius + 2,
                      targetRadius + 10,
                      80 + index
                    )}
                    key={`${sourceField}-${targetField}`}
                    pattern={NOTEBOOK_CONNECTION_PATTERNS.dashShort}
                    seedIndex={index}
                  />
                );
              }
              return (
                <path
                  key={`${sourceField}-${targetField}`}
                  className={styles.crossFieldDiscovery}
                  d={draftedEdge(
                    source,
                    target,
                    sourceRadius + 2,
                    targetRadius + 2,
                    80 + index,
                    index > 3 ? 'sweeping' : 'steady'
                  )}
                />
              );
            })}
            {[8, 19].map((nodeId, index) => {
              const target = positions.get(nodeId)!;
              if (roughConnectors) {
                return (
                  <RoughConnector
                    arrow
                    className={styles.equilibriaConnection}
                    geometry={routedConnectorGeometry(
                      { x: 460, y: 350 },
                      target,
                      27,
                      nodeRadius(drawings.get(nodeId)!, true) + 10,
                      90 + index
                    )}
                    key={`eq-${nodeId}`}
                    pattern={NOTEBOOK_CONNECTION_PATTERNS.solid}
                    seedIndex={index + 1}
                    strokeWidth={1.25}
                  />
                );
              }
              return (
                <path
                  key={`eq-${nodeId}`}
                  className={styles.equilibriaConnection}
                  d={connectorPath(
                    { x: 460, y: 350 },
                    target,
                    27,
                    drawings.get(nodeId)!.radius + 3,
                    [-7, 7][index]
                  )}
                />
              );
            })}
          </g>
        )}

        <g className={styles.nodes}>
          {NODES.map((node) => {
            const point = positions.get(node.id)!;
            const drawing = drawings.get(node.id)!;
            const status = statusFor(node, activeState);
            const cascadeHidden =
              activeState === 'defection' &&
              DEFECTORS.has(node.id) &&
              !activeDefectors.has(node.id);
            const dimmed = selectedNode !== null && !neighborhood.has(node.id);
            const hatchTone = hatchToneFor(node, activeState, status);
            return (
              <g
                key={node.id}
                className={`${styles.node} ${styles[status]} ${styles[`field${node.field}`]} ${
                  cascadeHidden ? styles.preCascade : ''
                } ${dimmed ? styles.dimmed : ''}`}
                transform={`translate(${point.x} ${point.y})${
                  roughConnectors ? ` scale(${NODE_SCALE})` : ''
                }`}
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
                  className={styles.nodeShape}
                  d={drawing.outline}
                  style={{
                    fill:
                      node.kind === 'human'
                        ? 'var(--paper)'
                        : `url(#narrative-${hatchTone}-${node.kind}-hatch)`,
                  }}
                />
                {node.kind === 'ai' && <path className={styles.nodeMark} d="M-3 2L0-4L3 2" />}
                {node.kind === 'institution' && (
                  <path className={styles.nodeMark} d="M-4 3H4M-3 1V-2M0 1V-2M3 1V-2" />
                )}
                <circle className={styles.selectionCircle} r={drawing.radius + 7} />
              </g>
            );
          })}
        </g>

        <SceneAnnotations
          roughConnectors={roughConnectors}
          state={activeState}
          positions={positions}
        />
        {roughConnectors ? (
          <UnifiedLegend state={activeState} />
        ) : (
          <>
            <LegacyStrategicStateLegend state={activeState} />
            <LegacyShapeLegend />
          </>
        )}

        <g className={styles.mathLayer}>
          <text x="104" y={roughConnectors ? 738 : 674}>
            {note.equation}
          </text>
          <text className={styles.marginNote} x="535" y={roughConnectors ? 738 : 674}>
            {note.note}
          </text>
        </g>
        {selectedNode !== null && (
          <g className={styles.selectionNote}>
            <text x="690" y="102">
              N(v{selectedNode + 1}) = {neighborhood.size - 1}
            </text>
            <text x="690" y="122">
              select again to release
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
