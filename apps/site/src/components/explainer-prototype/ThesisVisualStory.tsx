import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force';
import type { VisualEssayRendererProps } from '@components/visual-essay/types';
import { explainerContent } from '@content/explainer';
import type { ThesisState } from './ThesisPrototype';
import styles from './ThesisVisualStory.module.css';

const W = 900;
const H = 720;

interface Node extends SimulationNodeDatum {
  id: number;
  kind: 'human' | 'ai' | 'institution';
}

interface Link extends SimulationLinkDatum<Node> {
  source: number | Node;
  target: number | Node;
}

const NODES: Node[] = Array.from({ length: 20 }, (_, id) => ({
  id,
  kind: id % 7 === 0 ? 'institution' : id % 3 === 0 ? 'ai' : 'human',
}));

const LINKS: Link[] = NODES.flatMap((node, index) => {
  const links: Link[] = [{ source: node.id, target: (index + 1) % NODES.length }];
  if (index % 2 === 0) links.push({ source: node.id, target: (index + 5) % NODES.length });
  if (index % 5 === 0) links.push({ source: node.id, target: (index + 9) % NODES.length });
  return links;
});

function endpointId(endpoint: number | Node) {
  return typeof endpoint === 'number' ? endpoint : endpoint.id;
}

function solveNetwork(cx: number, cy: number, radius: number) {
  const nodes = NODES.map((node) => ({ ...node }));
  const links = LINKS.map((link) => ({
    ...link,
    source: endpointId(link.source),
    target: endpointId(link.target),
  }));
  const simulation = forceSimulation<Node, Link>(nodes)
    .randomSource(() => 0.37)
    .force(
      'link',
      forceLink<Node, Link>(links)
        .id((node) => node.id)
        .distance(radius * 0.25)
        .strength(0.42)
    )
    .force('charge', forceManyBody().strength(-radius * 0.7))
    .force('collide', forceCollide(radius * 0.045))
    .force('center', forceCenter(cx, cy))
    .stop();
  for (let tick = 0; tick < 260; tick += 1) simulation.tick();
  return new Map(nodes.map((node) => [node.id, { x: node.x ?? cx, y: node.y ?? cy }]));
}

const SOCIETY = solveNetwork(450, 345, 430);
const OUTPUT = solveNetwork(742, 366, 205);

function EntityMark({
  kind,
  x,
  y,
  small = false,
  hollow = false,
}: {
  kind: Node['kind'];
  x: number;
  y: number;
  small?: boolean;
  hollow?: boolean;
}) {
  const scale = small ? 0.7 : 1;
  return (
    <g
      className={`${styles.entity} ${hollow ? styles.hollow : ''}`}
      transform={`translate(${x} ${y}) scale(${scale})`}
    >
      {kind === 'human' && (
        <>
          <circle cy="-5" r="5" />
          <path d="M-9 10C-8 1 8 1 9 10" />
        </>
      )}
      {kind === 'ai' && (
        <>
          <path d="M0-10L10 0L0 10L-10 0Z" />
          <circle r="2.5" />
        </>
      )}
      {kind === 'institution' && (
        <>
          <path d="M-12-6L0-13L12-6Z" />
          <path d="M-10-4V9M-3-4V9M4-4V9M11-4V9M-14 10H14" />
        </>
      )}
    </g>
  );
}

function SocietyScene() {
  const l = explainerContent.prototype.storyLabels.society;
  return (
    <g>
      <text className={styles.sceneTitle} x="450" y="64">
        {l.socialFabric}
      </text>
      <g className={styles.networkEdges}>
        {LINKS.map((link, index) => {
          const source = SOCIETY.get(endpointId(link.source))!;
          const target = SOCIETY.get(endpointId(link.target))!;
          return <line key={index} x1={source.x} y1={source.y} x2={target.x} y2={target.y} />;
        })}
      </g>
      {NODES.map((node) => {
        const point = SOCIETY.get(node.id)!;
        return <EntityMark key={node.id} kind={node.kind} x={point.x} y={point.y} />;
      })}
      <g className={styles.flowLabels}>
        {l.flows.map((flow, index) => (
          <text key={flow} x={190 + index * 260} y="640">
            {flow}
          </text>
        ))}
      </g>
      <g className={styles.key} transform="translate(238 585)">
        <EntityMark kind="human" x={0} y={0} small />
        <text x="20" y="4">
          {l.human}
        </text>
        <EntityMark kind="ai" x={145} y={0} small />
        <text x="165" y="4">
          {l.aiAgent}
        </text>
        <EntityMark kind="institution" x={290} y={0} small />
        <text x="313" y="4">
          {l.institution}
        </text>
      </g>
    </g>
  );
}

function DefectionScene() {
  const l = explainerContent.prototype.storyLabels.defection;
  const cascade = [3, 4, 8, 9, 13, 14, 18];
  return (
    <g>
      <text className={styles.sceneTitle} x="450" y="58">
        {l.cascade}
      </text>
      <g transform="translate(85 135)">
        <text className={styles.microLabel} x="155" y="-28">
          {l.localPayoff}
        </text>
        <text className={styles.matrixLabel} x="98" y="8">
          {l.cooperate}
        </text>
        <text className={styles.matrixLabel} x="234" y="8">
          {l.defect}
        </text>
        <text className={styles.matrixLabel} transform="translate(18 96) rotate(-90)">
          {l.cooperate}
        </text>
        <text className={styles.matrixLabel} transform="translate(18 230) rotate(-90)">
          {l.defect}
        </text>
        <rect className={styles.matrixGood} x="55" y="25" width="125" height="125" />
        <rect className={styles.matrixTemptation} x="185" y="25" width="125" height="125" />
        <rect className={styles.matrixRisk} x="55" y="155" width="125" height="125" />
        <rect className={styles.matrixBad} x="185" y="155" width="125" height="125" />
        <text className={styles.payoff} x="117" y="94">
          3, 3
        </text>
        <text className={styles.payoff} x="247" y="94">
          1, 4
        </text>
        <text className={styles.payoff} x="117" y="224">
          4, 1
        </text>
        <text className={styles.payoff} x="247" y="224">
          2, 2
        </text>
        <path className={styles.choiceArrow} d="M118 116Q198 140 236 178" />
      </g>
      <path className={styles.transferArrow} d="M430 290H505" />
      <g transform="translate(500 70)">
        <g className={styles.networkEdges}>
          {LINKS.map((link, index) => {
            const source = SOCIETY.get(endpointId(link.source))!;
            const target = SOCIETY.get(endpointId(link.target))!;
            return (
              <line
                key={index}
                className={
                  cascade.includes(endpointId(link.source)) ||
                  cascade.includes(endpointId(link.target))
                    ? styles.brokenEdge
                    : ''
                }
                x1={(source.x - 450) * 0.62 + 190}
                y1={(source.y - 345) * 0.62 + 255}
                x2={(target.x - 450) * 0.62 + 190}
                y2={(target.y - 345) * 0.62 + 255}
              />
            );
          })}
        </g>
        {NODES.map((node, index) => {
          const point = SOCIETY.get(node.id)!;
          return (
            <g key={node.id} className={cascade.includes(node.id) ? styles.cascadeNode : ''}>
              <EntityMark
                kind={node.kind}
                x={(point.x - 450) * 0.62 + 190}
                y={(point.y - 345) * 0.62 + 255}
                small
                hollow={cascade.includes(node.id)}
              />
              {cascade.includes(node.id) && (
                <circle
                  className={styles.cascadeRing}
                  cx={(point.x - 450) * 0.62 + 190}
                  cy={(point.y - 345) * 0.62 + 255}
                  r="15"
                  style={{ animationDelay: `${index * 90}ms` }}
                />
              )}
            </g>
          );
        })}
      </g>
      <text className={styles.axisCaption} x="246" y="600">
        {l.localPayoff} ↑
      </text>
      <text className={styles.axisCaption} x="654" y="600">
        {l.collectiveWelfare} ↓
      </text>
    </g>
  );
}

function EquilibriaScene() {
  const l = explainerContent.prototype.storyLabels.equilibria;
  return (
    <g>
      <text className={styles.sceneTitle} x="450" y="55">
        {l.landscape}
      </text>
      <path
        className={styles.contourLight}
        d="M55 515C120 120 310 85 438 335C555 575 752 535 845 155"
      />
      <path
        className={styles.contour}
        d="M72 532C145 185 290 150 414 365C535 574 718 545 822 207"
      />
      <path
        className={styles.contourStrong}
        d="M98 548C177 265 285 224 390 403C502 593 672 566 786 283"
      />
      <path
        className={styles.hatchBasin}
        d="M505 540C564 474 652 476 730 418C686 559 594 590 505 540Z"
      />
      <circle className={styles.goodBall} cx="282" cy="442" r="17" />
      <circle className={styles.badBall} cx="650" cy="501" r="17" />
      <path className={styles.blockedMove} d="M648 470Q570 355 464 408" />
      <line className={styles.blockMark} x1="520" y1="370" x2="544" y2="394" />
      <line className={styles.blockMark} x1="544" y1="370" x2="520" y2="394" />
      <text className={styles.annotationStrong} x="282" y="492">
        {l.betterForAll}
      </text>
      <text className={styles.annotationStrong} x="650" y="552">
        {l.stableButWorse}
      </text>
      <text className={styles.annotation} x="530" y="345">
        {l.unilateralMove}
      </text>
      <text className={styles.equation} x="95" y="125">
        W(s) = Σᵢ uᵢ(s)
      </text>
      <text className={styles.equation} x="670" y="125">
        ∀i: uᵢ(s*) ≥ uᵢ(s′)
      </text>
    </g>
  );
}

const FUTURE_NODES = [
  [28, 38],
  [67, 24],
  [106, 46],
  [47, 82],
  [88, 92],
  [126, 78],
  [26, 124],
  [70, 135],
  [116, 126],
];
const FUTURE_EDGES = [
  [0, 1],
  [1, 2],
  [0, 3],
  [1, 3],
  [2, 5],
  [3, 4],
  [4, 5],
  [3, 6],
  [4, 7],
  [5, 8],
  [6, 7],
  [7, 8],
];

function MiniFuture({
  x,
  y,
  index,
  label,
}: {
  x: number;
  y: number;
  index: number;
  label: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className={styles.futureFrame} width="340" height="245" />
      <text className={styles.futureIndex} x="18" y="25">
        Ω{index + 1}
      </text>
      <g transform="translate(92 40) scale(1.15)">
        {FUTURE_EDGES.map(([a, b], edgeIndex) => (
          <line
            key={edgeIndex}
            className={`${styles.miniEdge} ${edgeIndex % (index + 2) === 0 ? styles.miniBroken : ''}`}
            x1={FUTURE_NODES[a][0]}
            y1={FUTURE_NODES[a][1]}
            x2={FUTURE_NODES[b][0]}
            y2={FUTURE_NODES[b][1]}
          />
        ))}
        {FUTURE_NODES.map(([nx, ny], nodeIndex) => (
          <circle
            key={nodeIndex}
            className={`${styles.miniNode} ${nodeIndex % 4 < index ? styles.miniHollow : ''}`}
            cx={nx}
            cy={ny}
            r="5"
          />
        ))}
      </g>
      <text className={styles.futureLabel} x="170" y="218">
        {label}
      </text>
    </g>
  );
}

function UncertaintyScene() {
  const l = explainerContent.prototype.storyLabels.uncertainty;
  return (
    <g>
      <text className={styles.sceneTitle} x="450" y="48">
        {l.ensemble}
      </text>
      {l.outcomes.map((outcome, index) => (
        <MiniFuture
          key={outcome}
          x={82 + (index % 2) * 370}
          y={78 + Math.floor(index / 2) * 270}
          index={index}
          label={outcome}
        />
      ))}
      <g className={styles.unknownBadge} transform="translate(450 345)">
        <circle r="54" />
        <text y="-2">?</text>
        <text y="75">{l.unknown}</text>
      </g>
    </g>
  );
}

function LensGlyph({ index, x, y }: { index: number; x: number; y: number }) {
  return (
    <g className={styles.lensGlyph} transform={`translate(${x} ${y})`}>
      {index === 0 && (
        <>
          <circle r="42" />
          <circle r="27" />
          <path d="M-25 12L0-18L29 20M-31-9L26-5" />
        </>
      )}
      {index === 1 && (
        <>
          <path d="M-48 24Q-24-30 0 24T48 24" />
          <path d="M-48 5Q-24-49 0 5T48 5" />
          <circle cx="-38" cy="24" r="5" />
          <circle cy="24" r="5" />
          <circle cx="38" cy="24" r="5" />
        </>
      )}
      {index === 2 && (
        <>
          <rect x="-40" y="-40" width="80" height="80" />
          <path d="M0-40V40M-40 0H40" />
          <text x="-20" y="-15">
            R
          </text>
          <text x="20" y="-15">
            S
          </text>
          <text x="-20" y="25">
            T
          </text>
          <text x="20" y="25">
            P
          </text>
        </>
      )}
      {index === 3 && (
        <>
          <circle cy="-32" r="7" />
          <circle cx="-34" cy="22" r="7" />
          <circle cx="34" cy="22" r="7" />
          <path d="M0-25L-34 15M0-25L34 15M-34 29L0 48L34 29" />
        </>
      )}
    </g>
  );
}

function KnowledgeScene() {
  const l = explainerContent.prototype.storyLabels.knowledge;
  const fields = [
    explainerContent.ui.fieldLabels.cooperativeAI,
    explainerContent.ui.fieldLabels.compSocialScience,
    explainerContent.ui.fieldLabels.agentFoundations,
    explainerContent.ui.fieldLabels.complexSystems,
  ];
  const subtitles = [
    explainerContent.ui.fieldSubtitles.cooperativeAI,
    explainerContent.ui.fieldSubtitles.compSocialScience,
    explainerContent.ui.fieldSubtitles.agentFoundations,
    explainerContent.ui.fieldSubtitles.complexSystems,
  ];
  const positions = [
    [220, 205],
    [680, 205],
    [220, 525],
    [680, 525],
  ];
  return (
    <g>
      <text className={styles.sceneTitle} x="450" y="48">
        {l.lenses}
      </text>
      {positions.map(([x, y], index) => (
        <g key={fields[index]}>
          <rect className={styles.lensFrame} x={x - 155} y={y - 115} width="310" height="230" />
          <LensGlyph index={index} x={x} y={y - 20} />
          <text className={styles.lensTitle} x={x} y={y + 65}>
            {fields[index]}
          </text>
          <text className={styles.lensSubtitle} x={x} y={y + 87}>
            {subtitles[index]}
          </text>
          <path className={styles.lensRay} d={`M${x},${y + (y < 300 ? 115 : -115)}L450,360`} />
        </g>
      ))}
      <g className={styles.sharedQuestion} transform="translate(450 360)">
        <circle r="74" />
        <circle r="62" />
        <text y="-5">{l.sharedQuestion}</text>
      </g>
    </g>
  );
}

function SilosScene() {
  const l = explainerContent.prototype.storyLabels.silos;
  const codes = explainerContent.prototype.fieldCodes;
  return (
    <g>
      <text className={styles.sceneTitle} x="450" y="50">
        {l.citationMatrix}
      </text>
      <g transform="translate(214 112)">
        {codes.map((code, index) => (
          <g key={code}>
            <text className={styles.matrixCode} x={105 + index * 105} y="-22">
              {code}
            </text>
            <text className={styles.matrixCode} x="-24" y={66 + index * 105}>
              {code}
            </text>
            {codes.map((_, column) => (
              <rect
                key={column}
                className={index === column ? styles.citationDense : styles.citationEmpty}
                x={55 + column * 105}
                y={16 + index * 105}
                width="95"
                height="95"
              />
            ))}
          </g>
        ))}
        <path className={styles.matrixDiagonal} d="M55 16L475 436" />
      </g>
      <g className={styles.siloNotes}>
        <text x="155" y="630">
          {l.differentVenues}
        </text>
        <line x1="270" y1="625" x2="380" y2="625" />
        <text x="450" y="630">
          {l.differentFormalisms}
        </text>
        <line x1="574" y1="625" x2="684" y2="625" />
        <text x="744" y="630">
          {l.missingSynthesis}
        </text>
      </g>
    </g>
  );
}

function BridgeScene() {
  const l = explainerContent.prototype.storyLabels.bridge;
  const fields = [
    explainerContent.ui.fieldLabels.cooperativeAI,
    explainerContent.ui.fieldLabels.compSocialScience,
    explainerContent.ui.fieldLabels.agentFoundations,
    explainerContent.ui.fieldLabels.complexSystems,
  ];
  const ys = [150, 270, 390, 510];
  return (
    <g>
      <text className={styles.sceneTitle} x="450" y="48">
        {l.newConnections}
      </text>
      {fields.map((field, index) => (
        <g key={field}>
          <rect className={styles.inputCard} x="62" y={ys[index] - 42} width="205" height="84" />
          <text className={styles.inputCode} x="80" y={ys[index] - 12}>
            {String(index + 1).padStart(2, '0')}
          </text>
          <text className={styles.inputLabel} x="80" y={ys[index] + 16}>
            {field}
          </text>
          <path
            className={styles.inputLine}
            d={`M267 ${ys[index]}C330 ${ys[index]} 334 330 380 330`}
          />
        </g>
      ))}
      <g className={styles.operator} transform="translate(450 330)">
        <circle r="95" />
        <circle r="78" />
        <image href="/img/brand/marks/sym-concentric.svg" x="-48" y="-53" width="96" height="96" />
        <text y="72">{explainerContent.ui.bridgeLabel}</text>
      </g>
      <g className={styles.operatorSteps}>
        <text x="450" y="460">
          {l.translate}
        </text>
        <text x="450" y="490">
          {l.compose}
        </text>
        <text x="450" y="520">
          {l.test}
        </text>
      </g>
      <path className={styles.outputLine} d="M545 330H605" />
      <g>
        {LINKS.slice(0, 24).map((link, index) => {
          const source = OUTPUT.get(endpointId(link.source))!;
          const target = OUTPUT.get(endpointId(link.target))!;
          return (
            <line
              key={index}
              className={styles.outputEdge}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
            />
          );
        })}
        {NODES.map((node) => {
          const point = OUTPUT.get(node.id)!;
          return <EntityMark key={node.id} kind={node.kind} x={point.x} y={point.y} small />;
        })}
      </g>
      <text className={styles.outputTitle} x="742" y="590">
        {l.coherentGovernance}
      </text>
    </g>
  );
}

const SCENES: Record<ThesisState, () => React.JSX.Element> = {
  society: SocietyScene,
  defection: DefectionScene,
  equilibria: EquilibriaScene,
  uncertainty: UncertaintyScene,
  knowledge: KnowledgeScene,
  silos: SilosScene,
  bridge: BridgeScene,
};

export default function ThesisVisualStory({
  activeState,
  step,
}: VisualEssayRendererProps<ThesisState>) {
  const Scene = SCENES[activeState];
  return (
    <div className={styles.root}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${step.stageLabel}: ${step.headline}`}
      >
        <defs>
          <pattern id="story-grid-small" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M18 0H0V18" className={styles.gridSmall} />
          </pattern>
          <pattern id="story-grid" width="90" height="90" patternUnits="userSpaceOnUse">
            <rect width="90" height="90" fill="url(#story-grid-small)" />
            <path d="M90 0H0V90" className={styles.gridMajor} />
          </pattern>
          <pattern id="story-hatch" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M-2 2L2-2M0 8L8 0M6 10L10 6" className={styles.hatchLine} />
          </pattern>
          <marker
            id="story-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10Z" className={styles.arrowHead} />
          </marker>
        </defs>
        <rect width={W} height={H} fill="url(#story-grid)" />
        <g className={styles.scene}>
          <Scene />
        </g>
      </svg>
      <div className={styles.caption}>
        <span>{String(step.id).padStart(2, '0')} / 07</span>
        <strong>{step.stageLabel}</strong>
      </div>
    </div>
  );
}
