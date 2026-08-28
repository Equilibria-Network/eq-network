// The one figure of the simulation-standards page, keyed on the story's seven
// beats. It draws its own legend per scene so a screenshot stays readable
// without the page copy (DIAGRAMS.md). Positions are hand-laid in the shared
// 900 x 720 view box; labels come from content; the pen (nodes, edges, notes,
// legend) is the research-areas primitives so the two pages share one hand.
import type { StandardsFigureLabels, StandardsStepState } from '@content/standards';
import {
  Caption,
  Edge,
  FIG_H,
  FIG_W,
  Leader,
  LegendRow,
  Loop,
  Node,
  Note,
  Paper,
  nodeRadius,
} from '@components/research-areas/figurePrimitives';
import ra from '@components/research-areas/research-areas.module.css';
import styles from './standards.module.css';

interface P {
  x: number;
  y: number;
}

/* ---------- shared geometry ---------- */

const START: P = { x: 150, y: 430 };
const RUN_ENDS: P[] = [
  { x: 760, y: 240 },
  { x: 760, y: 400 },
  { x: 760, y: 540 },
];

/** A gentle S-curve from the start to an end, bowing by a fixed amount. */
function runPath(end: P, bow: number) {
  const c1 = { x: START.x + 220, y: START.y - bow };
  const c2 = { x: end.x - 220, y: end.y + bow };
  return `M${START.x},${START.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${end.x},${end.y}`;
}

const RUN_BOWS = [40, -20, -60];

/** The potential landscape: a deep well on the left, a shallower one on the right. */
const LANDSCAPE =
  'M70,300 C170,300 230,540 310,540 S430,320 470,320 S560,470 650,470 S790,300 850,300';
const GOOD_WELL: P = { x: 310, y: 505 };
const BAD_WELL: P = { x: 650, y: 440 };
const BASIN = { x: 170, y: 250, width: 300, height: 320 };

/* ---------- scenes ---------- */

function Runs({ labels, publish }: { labels: StandardsFigureLabels; publish: boolean }) {
  const a = labels.annotations;
  const names = [a.runA, a.runB, a.runC];
  return (
    <>
      {RUN_ENDS.map((end, index) => {
        const isPublished = publish && index === 0;
        const ghost = publish ? index !== 0 : index === 2;
        const className = [ra.trace, isPublished ? ra.traceAccent : '', ghost ? ra.traceGhost : '']
          .filter(Boolean)
          .join(' ');
        return (
          <path
            key={index}
            className={className}
            d={runPath(end, RUN_BOWS[index])}
            style={isPublished ? { strokeWidth: 3 } : undefined}
          />
        );
      })}
      <Node id={7} x={START.x} y={START.y} fill="solid" label={a.start} />
      {RUN_ENDS.map((end, index) => {
        // Long labels (the reported run, the reference-frame run) stay inside
        // the view box by ending at the line's endpoint instead of starting
        // there: the reported run above its line, the frame run below.
        const isPublished = publish && index === 0;
        const isFrameRun = index === 2;
        const endAnchored = isPublished || isFrameRun;
        return (
          <Note
            key={index}
            x={endAnchored ? end.x : end.x + 14}
            y={isPublished ? end.y - 16 : isFrameRun ? end.y + 26 : end.y + 5}
            anchor={endAnchored ? 'end' : 'start'}
            strong={isPublished}
            muted={publish && index !== 0}
          >
            {isPublished ? a.publish : names[index]}
          </Note>
        );
      })}
      {publish && (
        <>
          <Note x={470} y={640} anchor="middle" strong>
            {a.artifactNote}
          </Note>
          <Leader from={{ x: 470, y: 600 }} to={{ x: 455, y: 335 }} index={3} bend={-30} />
        </>
      )}
    </>
  );
}

function Traditions({ labels }: { labels: StandardsFigureLabels }) {
  const a = labels.annotations;
  const centers = [200, 450, 700];
  const cy = 340;
  const growNodes: P[] = [
    { x: 420, y: 330 },
    { x: 470, y: 300 },
    { x: 480, y: 370 },
  ];
  return (
    <>
      {centers.map((cx, index) => (
        <Loop
          key={cx}
          seed={51 + index}
          cx={cx}
          cy={cy}
          rx={112}
          ry={150}
          dashed
          label={[a.proof, a.grow, a.phase][index]}
        />
      ))}
      {/* proof: the incentive line-up, written as a rule */}
      <Note x={centers[0]} y={cy - 10} anchor="middle" strong>
        M ⇒ O
      </Note>
      <Note x={centers[0]} y={cy + 40} anchor="middle" muted>
        {a.proofInner}
      </Note>
      {/* grow it: three agents whose links produce a pattern */}
      {growNodes.map((n, index) => (
        <Node key={index} id={61 + index} x={n.x} y={n.y} scale={1.2} />
      ))}
      <Edge from={growNodes[0]} to={growNodes[1]} fromGap={14} toGap={14} index={11} />
      <Edge from={growNodes[1]} to={growNodes[2]} fromGap={14} toGap={14} index={12} />
      <Edge from={growNodes[2]} to={growNodes[0]} fromGap={14} toGap={14} index={13} />
      <Note x={centers[1]} y={cy + 100} anchor="middle" muted>
        {a.growInner}
      </Note>
      {/* phase portrait: a small bowl with a state resting in it */}
      <path className={styles.landscape} d="M620,300 C650,300 660,380 700,380 S750,300 780,300" />
      <Node id={71} x={700} y={368} scale={1.1} fill="solid" />
      <Note x={centers[2]} y={cy + 100} anchor="middle" muted>
        {a.phaseInner}
      </Note>
      <Note x={FIG_W / 2} y={600} anchor="middle" strong>
        {a.noSingle}
      </Note>
    </>
  );
}

function Vary({ labels }: { labels: StandardsFigureLabels }) {
  const a = labels.annotations;
  const mechanism: P = { x: 450, y: 360 };
  const agents = [
    { p: { x: 210, y: 210 }, shape: 'triangle', fill: 'open', label: a.rules },
    { p: { x: 210, y: 320 }, shape: 'triangle', fill: 'hatched', label: a.learner },
    { p: { x: 210, y: 430 }, shape: 'triangle', fill: 'solid', label: a.languageModel },
    { p: { x: 210, y: 540 }, shape: 'circle', fill: 'open', label: a.people },
  ] as const;
  const worlds = [
    { c: { x: 720, y: 230 }, label: a.worldA },
    { c: { x: 720, y: 360 }, label: a.worldB },
    { c: { x: 720, y: 490 }, label: a.worldC },
  ];
  const mechR = nodeRadius(81, 2.2);
  return (
    <>
      {agents.map((agent, index) => (
        <Edge
          key={index}
          from={agent.p}
          to={mechanism}
          fromGap={nodeRadius(91 + index) + 4}
          toGap={mechR + 4}
          index={21 + index}
          arrow
        />
      ))}
      {worlds.map((world, index) => (
        <Edge
          key={index}
          from={mechanism}
          to={world.c}
          fromGap={mechR + 4}
          toGap={78}
          index={31 + index}
          arrow
          pattern="dashed"
        />
      ))}
      {agents.map((agent, index) => (
        <Node
          key={index}
          id={91 + index}
          x={agent.p.x}
          y={agent.p.y}
          shape={agent.shape}
          fill={agent.fill}
          label={agent.label}
          labelPlacement="below"
        />
      ))}
      <Node
        id={81}
        x={mechanism.x}
        y={mechanism.y}
        shape="rounded-square"
        scale={2.2}
        strong
        label={a.mechanism}
        labelPlacement="below"
      />
      {worlds.map((world, index) => (
        <Loop
          key={index}
          seed={101 + index}
          cx={world.c.x}
          cy={world.c.y}
          rx={74}
          ry={46}
          dashed
          label={world.label}
          labelY={world.c.y + 5}
        />
      ))}
      <Note x={452} y={130} anchor="middle" strong>
        {a.varyNote}
      </Note>
      <Note x={452} y={600} anchor="middle" muted>
        {a.divergeNote}
      </Note>
    </>
  );
}

function Landscape({ labels, blind }: { labels: StandardsFigureLabels; blind: boolean }) {
  const a = labels.annotations;
  return (
    <>
      {!blind && (
        <rect
          className={ra.gap}
          x={BASIN.x}
          y={BASIN.y}
          width={BASIN.width}
          height={BASIN.height}
          rx={6}
        />
      )}
      {blind && <rect className={styles.moving} x={70} y={250} width={230} height={320} rx={6} />}
      <path className={styles.landscape} d={LANDSCAPE} />
      <path className={ra.axisLine} d={`M70,600 H850`} />
      <text className={ra.axis} x={850} y={620} textAnchor="end">
        {a.axisX} →
      </text>
      <text className={ra.axis} x={40} y={280} textAnchor="end" transform="rotate(-90 40 280)">
        {a.axisY} →
      </text>
      <Node id={111} x={GOOD_WELL.x} y={GOOD_WELL.y} fill="solid" />
      {/* Labelled below the curve's floor so the label never crosses the line. */}
      <Note x={GOOD_WELL.x} y={GOOD_WELL.y + 76} anchor="middle">
        {a.outcome}
      </Note>
      {!blind && (
        <>
          <Note x={BASIN.x + BASIN.width / 2} y={BASIN.y - 14} anchor="middle">
            {a.basin}
          </Note>
          <Note x={640} y={200} strong>
            {a.push}
          </Note>
          <Leader from={{ x: 640, y: 190 }} to={{ x: 476, y: 300 }} index={5} bend={-24} />
          <Note x={560} y={640} anchor="middle" muted>
            {a.basinNote}
          </Note>
        </>
      )}
      {blind && (
        <>
          <Note x={90} y={225} muted>
            {a.learning}
          </Note>
          <Edge
            from={GOOD_WELL}
            to={{ x: 470, y: 250 }}
            fromGap={nodeRadius(111) + 4}
            toGap={4}
            index={41}
            bend={-40}
            arrow
            accent
          />
          <Note x={480} y={240} strong>
            {a.exit}
          </Note>
          <Node id={121} x={BAD_WELL.x} y={BAD_WELL.y} fill="solid" muted />
          <Note x={BAD_WELL.x} y={BAD_WELL.y + 80} anchor="middle">
            {a.lockIn}
          </Note>
          <Note x={FIG_W / 2} y={650} anchor="middle" strong>
            {a.unknownsNote}
          </Note>
        </>
      )}
    </>
  );
}

function Ladder({ labels }: { labels: StandardsFigureLabels }) {
  const a = labels.annotations;
  const levels = [a.r0, a.r1, a.r2, a.r3, a.r4];
  const accrued = 2; // this model sits at level 2
  const x = 250;
  const width = 480;
  const height = 40;
  const y0 = 560;
  const gap = 92;
  const modelY = y0 - accrued * gap + height / 2;
  return (
    <>
      <path className={ra.axisLine} d={`M${x - 40},${y0 + height + 10} V${y0 - 4 * gap - 20}`} />
      {levels.map((label, index) => {
        const y = y0 - index * gap;
        const climbed = index <= accrued;
        return (
          <g key={index}>
            <rect
              className={`${ra.bar} ${climbed ? ra.barAccent : ''}`}
              x={x}
              y={y}
              width={width}
              height={height}
              rx={4}
            />
            <text className={ra.axis} x={x + 16} y={y + 25} style={{ opacity: 1 }}>
              {label}
            </text>
          </g>
        );
      })}
      <Node
        id={131}
        x={x - 90}
        y={modelY}
        shape="rounded-square"
        scale={1.5}
        strong
        label={a.thisModel}
      />
      <Edge
        from={{ x: x - 90, y: modelY }}
        to={{ x: x, y: modelY }}
        fromGap={nodeRadius(131, 1.5) + 2}
        toGap={2}
        index={51}
        bend={0}
        arrow
      />
      <Note x={x - 190} y={y0 - 4 * gap + 26} muted>
        {a.ladderNote}
      </Note>
    </>
  );
}

/* ---------- the figure ---------- */

function Scene({ state, labels }: { state: StandardsStepState; labels: StandardsFigureLabels }) {
  switch (state) {
    case 'anything':
      return <Runs labels={labels} publish={false} />;
    case 'artifact':
      return <Runs labels={labels} publish />;
    case 'traditions':
      return <Traditions labels={labels} />;
    case 'vary':
      return <Vary labels={labels} />;
    case 'basins':
      return <Landscape labels={labels} blind={false} />;
    case 'ladder':
      return <Ladder labels={labels} />;
    case 'unknowns':
      return <Landscape labels={labels} blind />;
    default:
      return null;
  }
}

export default function StandardsFigure({
  state,
  labels,
}: {
  state: StandardsStepState;
  labels: StandardsFigureLabels;
}) {
  const titleId = 'standards-figure-title';
  const descId = 'standards-figure-desc';
  return (
    <svg
      className={ra.svg}
      viewBox={`0 0 ${FIG_W} ${FIG_H}`}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
    >
      <title id={titleId}>{labels.title}</title>
      <desc id={descId}>{labels.description}</desc>
      <Paper />
      <g className={ra.scene} key={state}>
        <Caption>{labels.captions[state]}</Caption>
        <Scene state={state} labels={labels} />
        <LegendRow entries={labels.legend[state]} />
      </g>
    </svg>
  );
}
