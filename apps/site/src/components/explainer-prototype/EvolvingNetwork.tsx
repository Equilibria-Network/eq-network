import { useMemo } from 'react';
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
import { explainerContent } from '@content/explainer';
import type { VisualEssayRendererProps } from '@components/visual-essay/types';
import type { ThesisState } from './ThesisPrototype';
import styles from './ThesisPrototype.module.css';

const WIDTH = 760;
const HEIGHT = 620;
const NODE_COUNT = 28;
const DEFECTORS = new Set([2, 5, 8, 12, 16, 19, 22, 25]);

interface GraphNode extends SimulationNodeDatum {
  id: number;
  kind: 'human' | 'ai' | 'institution';
  field: number;
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  source: number | GraphNode;
  target: number | GraphNode;
  weak: boolean;
}

interface Position {
  x: number;
  y: number;
}

const RAW_NODES: GraphNode[] = Array.from({ length: NODE_COUNT }, (_, id) => ({
  id,
  kind: id % 7 === 0 || id % 11 === 0 ? 'institution' : id % 3 === 0 ? 'ai' : 'human',
  field: id % 4,
  x: 110 + ((id * 83) % 540),
  y: 90 + ((id * 137) % 430),
}));

const RAW_LINKS: GraphLink[] = RAW_NODES.flatMap((node, index) => {
  const links: GraphLink[] = [
    { source: node.id, target: (index + 1) % NODE_COUNT, weak: index % 5 === 0 },
  ];
  if (index % 2 === 0) {
    links.push({ source: node.id, target: (index + 5) % NODE_COUNT, weak: index % 6 === 0 });
  }
  if (index % 4 === 0) {
    links.push({ source: node.id, target: (index + 11) % NODE_COUNT, weak: false });
  }
  return links;
});

function idOf(endpoint: number | GraphNode): number {
  return typeof endpoint === 'number' ? endpoint : endpoint.id;
}

function solveLayout(
  groupFor: (node: GraphNode) => number,
  centers: Position[],
  linkFilter: (link: GraphLink) => boolean = () => true
): Map<number, Position> {
  const nodes = RAW_NODES.map((node) => ({ ...node }));
  const links = RAW_LINKS.filter(linkFilter).map((link) => ({
    ...link,
    source: idOf(link.source),
    target: idOf(link.target),
  }));
  const simulation = forceSimulation<GraphNode, GraphLink>(nodes)
    .randomSource(() => 0.42)
    .force(
      'link',
      forceLink<GraphNode, GraphLink>(links)
        .id((node) => node.id)
        .distance(54)
        .strength(0.32)
    )
    .force('charge', forceManyBody().strength(-105))
    .force('collide', forceCollide(15))
    .force('x', forceX<GraphNode>((node) => centers[groupFor(node)].x).strength(0.17))
    .force('y', forceY<GraphNode>((node) => centers[groupFor(node)].y).strength(0.17))
    .force('center', forceCenter(WIDTH / 2, HEIGHT / 2))
    .stop();

  for (let index = 0; index < 280; index += 1) simulation.tick();
  return new Map(
    nodes.map((node) => [
      node.id,
      {
        x: Math.max(42, Math.min(WIDTH - 42, node.x ?? WIDTH / 2)),
        y: Math.max(56, Math.min(HEIGHT - 56, node.y ?? HEIGHT / 2)),
      },
    ])
  );
}

const SOCIETY_LAYOUT = solveLayout(() => 0, [{ x: WIDTH / 2, y: HEIGHT / 2 }]);
const POLARIZED_LAYOUT = solveLayout(
  (node) => (DEFECTORS.has(node.id) ? 1 : 0),
  [
    { x: 250, y: 310 },
    { x: 555, y: 310 },
  ],
  (link) => DEFECTORS.has(idOf(link.source)) === DEFECTORS.has(idOf(link.target))
);
const FIELD_CENTERS = [
  { x: 215, y: 190 },
  { x: 545, y: 190 },
  { x: 215, y: 440 },
  { x: 545, y: 440 },
];
const FIELD_LAYOUT = solveLayout(
  (node) => node.field,
  FIELD_CENTERS,
  (link) => {
    const source = RAW_NODES[idOf(link.source)];
    const target = RAW_NODES[idOf(link.target)];
    return source.field === target.field;
  }
);

function positionFor(node: GraphNode, state: ThesisState): Position {
  if (state === 'society' || state === 'defection') return SOCIETY_LAYOUT.get(node.id)!;
  if (state === 'equilibria') return POLARIZED_LAYOUT.get(node.id)!;
  if (state === 'uncertainty') {
    const society = SOCIETY_LAYOUT.get(node.id)!;
    const polarized = POLARIZED_LAYOUT.get(node.id)!;
    return {
      x: polarized.x + (society.x - polarized.x) * 0.2,
      y: polarized.y + (society.y - polarized.y) * 0.2,
    };
  }
  const fieldPosition = FIELD_LAYOUT.get(node.id)!;
  if (state === 'bridge') {
    return {
      x: fieldPosition.x + (WIDTH / 2 - fieldPosition.x) * 0.08,
      y: fieldPosition.y + (HEIGHT / 2 - fieldPosition.y) * 0.08,
    };
  }
  return fieldPosition;
}

function linkVisible(link: GraphLink, state: ThesisState) {
  const source = idOf(link.source);
  const target = idOf(link.target);
  if (state === 'society' || state === 'defection' || state === 'uncertainty') return true;
  if (state === 'equilibria') return DEFECTORS.has(source) === DEFECTORS.has(target);
  return RAW_NODES[source].field === RAW_NODES[target].field;
}

export default function EvolvingNetwork({
  activeState,
  activeStep,
}: VisualEssayRendererProps<ThesisState>) {
  const p = explainerContent.prototype;
  const positions = useMemo(
    () => new Map(RAW_NODES.map((node) => [node.id, positionFor(node, activeState)])),
    [activeState]
  );
  const visibleLinks = RAW_LINKS.filter((link) => linkVisible(link, activeState));
  const isResearch = ['knowledge', 'silos', 'bridge'].includes(activeState);
  const showBridge = activeState === 'bridge';
  const showDefection = activeState === 'defection';
  const showEquilibria = activeState === 'equilibria';
  const showUncertainty = activeState === 'uncertainty';

  return (
    <div className={styles.graphWrap}>
      <svg
        className={styles.graph}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`${p.figureTitle}: ${p.stageLabels[activeStep - 1]}`}
      >
        <defs>
          <pattern id="eq-grid-small" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" className={styles.gridSmall} />
          </pattern>
          <pattern id="eq-grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#eq-grid-small)" />
            <path d="M 100 0 L 0 0 0 100" className={styles.gridMajor} />
          </pattern>
          <pattern id="eq-hatch" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M-2 2L2-2M0 8L8 0M6 10L10 6" className={styles.hatchLine} />
          </pattern>
        </defs>

        <rect width={WIDTH} height={HEIGHT} fill="url(#eq-grid)" />

        {(showEquilibria || showUncertainty) && (
          <>
            <ellipse className={styles.region} cx="245" cy="310" rx="190" ry="235" />
            <ellipse
              className={`${styles.region} ${styles.regionHatched}`}
              cx="550"
              cy="310"
              rx="140"
              ry="205"
            />
            <text className={styles.regionLabel} x="72" y="82">
              {p.annotations.cooperativeBasin}
            </text>
            <text className={styles.regionLabel} x="506" y="112">
              {p.annotations.localOptimum}
            </text>
          </>
        )}

        {showUncertainty && (
          <g className={styles.uncertaintyLayer}>
            <ellipse cx="380" cy="310" rx="302" ry="244" />
            <ellipse cx="380" cy="310" rx="270" ry="215" />
            <text x="380" y="52">
              {p.annotations.possibleTies}
            </text>
          </g>
        )}

        {isResearch &&
          FIELD_CENTERS.map((center, index) => (
            <g key={p.fieldCodes[index]}>
              <path
                className={styles.clusterBoundary}
                d={`M${center.x - 126},${center.y - 90}h252v180h-252z`}
              />
              <text className={styles.fieldLabel} x={center.x - 112} y={center.y - 104}>
                {p.fieldCodes[index]} / 0{index + 1}
              </text>
              <text className={styles.fieldModel} x={center.x} y={center.y + 112}>
                {p.annotations.fieldModels[index]}
              </text>
            </g>
          ))}

        {activeState === 'knowledge' && (
          <g className={styles.sharedProblem}>
            <circle cx={WIDTH / 2} cy={HEIGHT / 2} r="52" />
            <circle cx={WIDTH / 2} cy={HEIGHT / 2} r="43" />
            <text x={WIDTH / 2} y={HEIGHT / 2 - 4}>
              {p.annotations.coordinationProblem}
            </text>
            <text x={WIDTH / 2} y={HEIGHT / 2 + 12}>
              ?
            </text>
          </g>
        )}

        {activeState === 'silos' && (
          <g className={styles.citationGap}>
            <rect x="350" y="52" width="60" height="516" fill="url(#eq-hatch)" />
            <rect x="72" y="280" width="616" height="60" fill="url(#eq-hatch)" />
            <text x={WIDTH / 2} y={HEIGHT / 2 + 4}>
              {p.annotations.citationGap}
            </text>
          </g>
        )}

        <g className={styles.edges}>
          {RAW_LINKS.map((link, index) => {
            const source = positions.get(idOf(link.source))!;
            const target = positions.get(idOf(link.target))!;
            const visible = visibleLinks.includes(link);
            const broken =
              (showDefection || showEquilibria || showUncertainty) &&
              (DEFECTORS.has(idOf(link.source)) || DEFECTORS.has(idOf(link.target)));
            return (
              <line
                key={`${idOf(link.source)}-${idOf(link.target)}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={`${styles.edge} ${link.weak || broken ? styles.edgeWeak : ''}`}
                style={{
                  opacity: visible ? (broken ? (showUncertainty ? 0.16 : 0.22) : 0.52) : 0,
                  transitionDelay: `${Math.min(index * 8, 180)}ms`,
                }}
              />
            );
          })}
        </g>

        {showDefection &&
          RAW_NODES.filter((node) => DEFECTORS.has(node.id)).map((node) => {
            const position = positions.get(node.id)!;
            const dx = position.x - WIDTH / 2;
            const dy = position.y - HEIGHT / 2;
            const length = Math.hypot(dx, dy) || 1;
            return (
              <g key={`arrow-${node.id}`} className={styles.incentiveArrow}>
                <line
                  x1={position.x}
                  y1={position.y}
                  x2={position.x + (dx / length) * 34}
                  y2={position.y + (dy / length) * 34}
                />
                <circle
                  cx={position.x + (dx / length) * 38}
                  cy={position.y + (dy / length) * 38}
                  r="2.5"
                />
              </g>
            );
          })}

        {showBridge &&
          FIELD_CENTERS.map((center, index) => (
            <path
              key={index}
              className={styles.bridgeEdge}
              d={`M${WIDTH / 2},${HEIGHT / 2} Q${WIDTH / 2},${center.y} ${center.x},${center.y}`}
            />
          ))}

        <g className={styles.nodes}>
          {RAW_NODES.map((node, index) => {
            const position = positions.get(node.id)!;
            const defecting =
              (showDefection || showEquilibria || showUncertainty) && DEFECTORS.has(node.id);
            return (
              <g
                key={node.id}
                className={styles.node}
                transform={`translate(${position.x} ${position.y})`}
                style={{ transitionDelay: `${Math.min(index * 10, 180)}ms` }}
              >
                {node.kind === 'institution' && !isResearch ? (
                  <rect
                    className={`${styles.nodeShape} ${styles.institution} ${defecting ? styles.defecting : ''}`}
                    x="-10"
                    y="-8"
                    width="20"
                    height="16"
                  />
                ) : node.kind === 'ai' && !isResearch ? (
                  <path
                    className={`${styles.nodeShape} ${styles.aiNode} ${defecting ? styles.defecting : ''}`}
                    d="M0 -8L8 0L0 8L-8 0Z"
                  />
                ) : (
                  <circle
                    className={`${styles.nodeShape} ${defecting ? styles.defecting : ''}`}
                    r={isResearch ? 5 : 6}
                  />
                )}
                {isResearch && <line className={styles.nodeTick} x1="-8" y1="-9" x2="8" y2="-9" />}
              </g>
            );
          })}
        </g>

        {showBridge && (
          <g className={styles.bridge} transform={`translate(${WIDTH / 2} ${HEIGHT / 2})`}>
            <circle r="30" />
            <circle r="21" />
            <circle r="12" />
            <text y="48">{explainerContent.ui.bridgeLabel}</text>
            <text y="63">{p.bridgeAnnotation}</text>
          </g>
        )}

        <g className={styles.axisNotes}>
          <text x="18" y="28">
            {p.annotations.relationalDistance}
          </text>
          <text x="585" y="600">
            {p.annotations.institutionalAlignment}
          </text>
        </g>
      </svg>

      <div className={styles.graphFooter}>
        <div>
          <span>{p.figureTitle}</span>
          <strong>{p.stageLabels[activeStep - 1]}</strong>
        </div>
        <dl>
          <div>
            <dt>{p.nodeCountLabel}</dt>
            <dd>{NODE_COUNT}</dd>
          </div>
          <div>
            <dt>{p.edgeCountLabel}</dt>
            <dd>{visibleLinks.length + (showBridge ? 4 : 0)}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.legend}>
        <span>
          <i className={styles.legendNode} />
          {p.legend.active}
        </span>
        <span>
          <i className={`${styles.legendNode} ${styles.legendDefect}`} />
          {p.legend.defecting}
        </span>
        <span>
          <i className={styles.legendInstitution} />
          {p.legend.institution}
        </span>
        <span>
          <i className={styles.legendLine} />
          {p.legend.weakTie}
        </span>
      </div>
    </div>
  );
}
