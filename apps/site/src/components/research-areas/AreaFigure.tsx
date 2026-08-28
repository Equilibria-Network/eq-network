// One figure per research area, keyed on the essay's four beats
// (question -> why -> shape -> open). Every figure draws its own legend so a
// screenshot stays readable without the page copy (DIAGRAMS.md).
// Positions are hand-laid in a 900 x 720 view box; labels come from content.
import type { AreaFigureLabels, AreaStepState, ResearchArea } from '@content/research-areas/types';
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
  channelMarkPath,
  nodeRadius,
} from './figurePrimitives';
import styles from './research-areas.module.css';

interface FigureProps {
  state: AreaStepState;
  labels: AreaFigureLabels;
}

interface P {
  x: number;
  y: number;
}

/* ------------------------------------------------------------------ */
/* 01  Collective agency: when do many become one?                     */
/* ------------------------------------------------------------------ */

const AGENTS: P[] = [
  { x: 250, y: 250 },
  { x: 330, y: 205 },
  { x: 395, y: 275 },
  { x: 300, y: 330 },
  { x: 215, y: 340 },
  { x: 355, y: 375 },
  { x: 540, y: 250 },
  { x: 615, y: 210 },
  { x: 680, y: 290 },
  { x: 585, y: 340 },
  { x: 655, y: 385 },
  { x: 150, y: 470 },
  { x: 460, y: 500 },
  { x: 760, y: 470 },
  { x: 120, y: 190 },
  { x: 800, y: 180 },
];
const GROUP_A = [0, 1, 2, 3, 4, 5];
const GROUP_B = [6, 7, 8, 9, 10];
const A_LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
  [3, 5],
  [2, 5],
  [0, 3],
];
const B_LINKS: [number, number][] = [
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 6],
  [9, 10],
  [8, 10],
];
const CROSS_LINKS: [number, number][] = [
  [2, 6],
  [5, 9],
];
const OUTSIDE_LINKS: [number, number][] = [
  [4, 11],
  [14, 0],
  [12, 5],
  [12, 9],
  [13, 10],
  [15, 7],
];

function CollectiveAgencyFigure({ state, labels }: FigureProps) {
  const a = labels.annotations;
  const past = (s: AreaStepState) => ORDER.indexOf(state) >= ORDER.indexOf(s);
  const linkEdges = (
    links: [number, number][],
    offset: number,
    extra: Partial<Parameters<typeof Edge>[0]> = {}
  ) =>
    links.map(([s, t], i) => (
      <Edge
        key={`${s}-${t}`}
        from={AGENTS[s]}
        to={AGENTS[t]}
        fromGap={nodeRadius(s + 1)}
        toGap={nodeRadius(t + 1)}
        index={offset + i}
        {...extra}
      />
    ));

  return (
    <g className={styles.scene} key={state}>
      <Caption>{labels.captions[state]}</Caption>

      {/* boundaries under the marks */}
      {past('why') && (
        <Loop
          seed={7}
          cx={305}
          cy={292}
          rx={148}
          ry={128}
          dashed={!past('shape')}
          strong={past('shape')}
          label={past('shape') ? a.groupA : undefined}
          labelY={140}
        />
      )}
      {past('shape') && (
        <Loop seed={19} cx={612} cy={298} rx={126} ry={122} strong label={a.groupB} labelY={150} />
      )}
      {state === 'shape' && (
        <Loop seed={29} cx={460} cy={300} rx={368} ry={218} dashed label={a.whole} labelY={548} />
      )}
      {state === 'open' && <Loop seed={29} cx={460} cy={300} rx={368} ry={218} partial accent />}

      {/* couplings */}
      {past('why') && linkEdges(A_LINKS, 0)}
      {past('shape') && linkEdges(B_LINKS, 20)}
      {past('shape') &&
        linkEdges(CROSS_LINKS, 40, {
          strong: state !== 'open',
          accent: state === 'open',
          bend: 26,
        })}
      {linkEdges(OUTSIDE_LINKS, 60, {
        pattern: 'dashed',
        muted: past('why'),
      })}

      {/* the agents */}
      {AGENTS.map((p, i) => {
        const inA = GROUP_A.includes(i);
        const inB = GROUP_B.includes(i);
        const grouped = (past('why') && inA) || (past('shape') && inB);
        return (
          <Node
            key={i}
            id={i + 1}
            x={p.x}
            y={p.y}
            fill={grouped && past('shape') ? 'hatched' : 'open'}
            muted={past('why') && !inA && !inB}
          />
        );
      })}

      {/* annotations per beat */}
      {state === 'question' && (
        <>
          <Note x={455} y={340} anchor="middle" strong>
            ?
          </Note>
          <Note x={470} y={600} anchor="middle" muted>
            {a.questionNote}
          </Note>
        </>
      )}
      {state === 'why' && (
        <>
          <Note x={520} y={470}>
            {a.whyNote}
          </Note>
          <Leader from={{ x: 560, y: 452 }} to={{ x: 452, y: 372 }} index={3} />
        </>
      )}
      {state === 'shape' && (
        <Note x={470} y={606} anchor="middle">
          {a.shapeNote}
        </Note>
      )}
      {state === 'open' && (
        <>
          <Note x={455} y={95} anchor="middle" strong>
            ?
          </Note>
          <Note x={470} y={606} anchor="middle">
            {a.openNote}
          </Note>
          <Leader from={{ x: 470, y: 582 }} to={{ x: 470, y: 522 }} index={4} bend={22} />
        </>
      )}

      <LegendRow entries={labels.legend} />
    </g>
  );
}

const ORDER: AreaStepState[] = ['question', 'why', 'shape', 'open'];

/* ------------------------------------------------------------------ */
/* 02  Dynamics: how fast does a group settle, and when does it ring?  */
/* ------------------------------------------------------------------ */

const NET: P[] = [
  { x: 150, y: 210 },
  { x: 225, y: 160 },
  { x: 300, y: 215 },
  { x: 245, y: 290 },
  { x: 165, y: 300 },
  { x: 430, y: 240 },
  { x: 500, y: 185 },
  { x: 575, y: 240 },
  { x: 520, y: 315 },
  { x: 445, y: 320 },
];
const NET_LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
  [0, 2],
  [1, 3],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 5],
  [5, 7],
  [6, 8],
];
const BOTTLENECK: [number, number] = [2, 5];
const LADDER = [0, 0.16, 0.42, 0.55, 0.7, 0.86, 1];

function tracePath(x0: number, y0: number, width: number, height: number, ring: boolean) {
  const points: string[] = [];
  const n = 60;
  for (let i = 0; i <= n; i += 1) {
    const t = i / n;
    const decay = Math.exp(-3.2 * t);
    const value = ring ? decay * Math.cos(11 * t) : decay;
    const x = x0 + t * width;
    const y = y0 - value * height;
    points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(' ');
}

function DynamicsFigure({ state, labels }: FigureProps) {
  const a = labels.annotations;
  const past = (s: AreaStepState) => ORDER.indexOf(state) >= ORDER.indexOf(s);
  const ladderX = 690;
  const ladderBase = 380;
  const ladderTop = 130;
  const barW = 24;
  return (
    <g className={styles.scene} key={state}>
      <Caption>{labels.captions[state]}</Caption>

      {/* the network */}
      {NET_LINKS.map(([s, t], i) => (
        <Edge
          key={`${s}-${t}`}
          from={NET[s]}
          to={NET[t]}
          fromGap={nodeRadius(s + 30)}
          toGap={nodeRadius(t + 30)}
          index={i}
        />
      ))}
      <Edge
        from={NET[BOTTLENECK[0]]}
        to={NET[BOTTLENECK[1]]}
        fromGap={nodeRadius(BOTTLENECK[0] + 30)}
        toGap={nodeRadius(BOTTLENECK[1] + 30)}
        index={17}
        strong={past('why')}
        accent={past('why')}
        bend={-14}
      />
      {NET.map((p, i) => (
        <Node
          key={i}
          id={i + 30}
          x={p.x}
          y={p.y}
          fill={state === 'question' && i === 1 ? 'solid' : 'open'}
        />
      ))}
      {state === 'question' && (
        <>
          <Note x={110} y={120}>
            {a.pulse}
          </Note>
          <Leader from={{ x: 190, y: 128 }} to={{ x: 222, y: 142 }} index={1} bend={-10} />
          <Note x={365} y={470} anchor="middle" muted>
            {a.questionNote}
          </Note>
        </>
      )}
      {past('why') && (
        <>
          <Note x={365} y={185} anchor="middle">
            {a.bottleneck}
          </Note>
          <Leader from={{ x: 365, y: 192 }} to={{ x: 366, y: 222 }} index={2} bend={0} />
        </>
      )}

      {/* the ladder of modes */}
      {past('why') && (
        <g>
          <path className={styles.axisLine} d={`M${ladderX - 40} ${ladderBase}H${ladderX + 30}`} />
          <path
            className={styles.axisLine}
            d={`M${ladderX - 40} ${ladderBase}V${ladderTop - 10}`}
          />
          <text className={styles.axis} x={ladderX - 46} y={ladderTop - 18}>
            {a.ladderAxis}
          </text>
          {LADDER.map((level, i) => {
            const y = ladderBase - level * (ladderBase - ladderTop);
            return (
              <g key={i}>
                <rect
                  className={`${styles.bar} ${i === 0 ? styles.barSolid : ''} ${i === 1 && past('shape') ? styles.barAccent : ''}`}
                  x={ladderX - barW / 2}
                  y={y - 4}
                  width={barW}
                  height={8}
                />
                <text className={styles.axis} x={ladderX + 24} y={y + 4}>
                  {a.modePrefix}
                  {i + 1}
                </text>
              </g>
            );
          })}
          {/* the gap between the first two modes */}
          <rect
            className={styles.gap}
            x={ladderX - 46}
            y={ladderBase - LADDER[1] * (ladderBase - ladderTop)}
            width={62}
            height={LADDER[1] * (ladderBase - ladderTop) - 4}
          />
          <Note x={ladderX + 46} y={ladderBase + 30} anchor="end">
            {a.gap}
          </Note>
        </g>
      )}

      {/* the response traces */}
      {past('shape') && (
        <g>
          <path className={styles.axisLine} d="M110 560H620" />
          <path className={styles.axisLine} d="M110 560V430" />
          <text className={styles.axis} x="112" y="422">
            {a.traceAxis}
          </text>
          <text className={styles.axis} x="600" y="580" textAnchor="end">
            {a.timeAxis}
          </text>
          <path
            className={`${styles.trace} ${styles.traceGhost}`}
            d={tracePath(112, 560, 500, 100, false)}
          />
          <path
            className={`${styles.trace} ${state === 'open' ? styles.traceAccent : ''}`}
            d={tracePath(112, 560, 500, 100, true)}
          />
          <Note x={470} y={455}>
            {a.smooth}
          </Note>
          <Note x={200} y={640} anchor="start">
            {a.ringing}
          </Note>
          <Leader from={{ x: 240, y: 620 }} to={{ x: 232, y: 588 }} index={5} bend={-8} />
        </g>
      )}
      {state === 'open' && (
        <>
          <Note x={585} y={615} strong>
            ?
          </Note>
          <Note x={640} y={470} anchor="start">
            {a.openNote}
          </Note>
        </>
      )}

      <LegendRow entries={labels.legend} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 03  Governance: a regulator, its system, and the variety between    */
/* ------------------------------------------------------------------ */

// Beer's triad, left to right: the outside, the regulated system, the
// regulator. The rule-maker sits above the regulator.
const SYSTEM: P = { x: 410, y: 390 };
const SYSTEM_RX = 165;
const SYSTEM_RY = 150;
const OUTSIDE: P = { x: 120, y: 380 };
const REGULATOR: P = { x: 745, y: 390 };
const RULE_MAKER: P = { x: 745, y: 175 };
const CHANNEL_X = 655;
const SIGNAL_Y = 372;
const REGULATION_Y = 408;

function ring(count: number, radius: number, phase = 0): P[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = phase + (i / count) * Math.PI * 2;
    return {
      x: Math.round(SYSTEM.x + Math.cos(angle) * radius),
      y: Math.round(SYSTEM.y + Math.sin(angle) * radius),
    };
  });
}

/** x on the system boundary at a given y, for arrows that stop at the edge. */
function boundaryX(y: number, side: 1 | -1) {
  const t = (y - SYSTEM.y) / SYSTEM_RY;
  return SYSTEM.x + side * SYSTEM_RX * Math.sqrt(Math.max(0, 1 - t * t));
}

/** Eight agents in balance, then eleven marks on the same ring once the system has resettled. */
const SETTLED = ring(8, 100);
const RESETTLED = ring(11, 100, -Math.PI / 2);
/** Which resettled slots the new actors take (the first sits upper right, for the capture path). */
const NEW_SLOTS = [2, 6, 9];
/** Where the new actors wait outside, then where they push in. */
const ARRIVING: P[] = [
  { x: 102, y: 318 },
  { x: 140, y: 386 },
  { x: 100, y: 452 },
];
const PUSHED_IN: P[] = [
  { x: 352, y: 392 },
  { x: 412, y: 346 },
  { x: 396, y: 436 },
];
/** The agents the new actors push out of place, and where they land. */
const DISPLACED: Record<number, P> = {
  3: { x: 255, y: 562 },
  4: { x: 330, y: 204 },
  5: { x: 560, y: 214 },
};

function GovernanceFigure({ state, labels }: FigureProps) {
  const a = labels.annotations;
  const past = (s: AreaStepState) => ORDER.indexOf(state) >= ORDER.indexOf(s);
  const rI = nodeRadius(97) * 1.35;
  const resettled = past('shape');
  const actors = resettled
    ? NEW_SLOTS.map((slot) => RESETTLED[slot])
    : state === 'why'
      ? PUSHED_IN
      : ARRIVING;
  const varietyBars = state === 'why' ? [150, 96] : state === 'shape' ? [118, 118] : null;
  return (
    <g className={styles.scene} key={state}>
      <Caption>{labels.captions[state]}</Caption>

      {/* the outside, where the new actors come from */}
      <Loop seed={53} cx={OUTSIDE.x} cy={OUTSIDE.y} rx={82} ry={140} dashed label={a.outside} />

      {/* the regulated system's boundary: whole, broken, then whole again */}
      <Loop
        seed={57}
        cx={SYSTEM.x}
        cy={SYSTEM.y}
        rx={SYSTEM_RX}
        ry={SYSTEM_RY}
        strong={state !== 'why'}
        partial={state === 'why'}
      />

      {/* arrivals, at the door */}
      {state === 'question' &&
        ARRIVING.map((p, i) => (
          <Edge
            key={`arrive-${i}`}
            from={p}
            to={{ x: boundaryX(p.y + 4, -1), y: p.y + 4 }}
            fromGap={nodeRadius(58 + i)}
            toGap={4}
            index={70 + i}
            pattern="dashed"
            arrow
            accent
            bend={i === 1 ? 0 : i === 0 ? -10 : 10}
          />
        ))}

      {/* the two channels between system and regulator */}
      <Edge
        from={{ x: boundaryX(SIGNAL_Y, 1), y: SIGNAL_Y }}
        to={{ x: REGULATOR.x, y: SIGNAL_Y }}
        fromGap={0}
        toGap={rI}
        index={80}
        pattern="dotted"
        arrow
        bend={0}
        strong={state === 'why'}
        accent={state === 'why'}
      />
      <Edge
        from={{ x: REGULATOR.x, y: REGULATION_Y }}
        to={{ x: boundaryX(REGULATION_Y, 1), y: REGULATION_Y }}
        fromGap={rI}
        toGap={0}
        index={81}
        arrow
        bend={0}
      />
      {resettled && (
        <>
          <path
            className={styles.channelMark}
            d={channelMarkPath('attenuator', CHANNEL_X, SIGNAL_Y, 11, 1)}
          />
          <path
            className={styles.channelMark}
            d={channelMarkPath('amplifier', CHANNEL_X, REGULATION_Y, 11, -1)}
          />
          <Note x={CHANNEL_X} y={SIGNAL_Y - 18} anchor="middle">
            {a.attenuate}
          </Note>
          <Note x={CHANNEL_X} y={REGULATION_Y + 28} anchor="middle">
            {a.amplify}
          </Note>
        </>
      )}

      {/* the rule-maker that rewires the regulator */}
      {resettled && (
        <>
          <Edge
            from={RULE_MAKER}
            to={REGULATOR}
            fromGap={rI}
            toGap={rI}
            index={100}
            arrow
            bend={0}
            muted={state === 'open'}
          />
          <Edge
            from={REGULATOR}
            to={RULE_MAKER}
            fromGap={rI}
            toGap={rI}
            index={101}
            pattern="dotted"
            arrow
            bend={-40}
          />
          <Note x={768} y={292}>
            {state === 'open' ? a.lockIn : a.rewire}
          </Note>
        </>
      )}

      {/* capture: one strong path from a new actor into the rule-maker */}
      {state === 'open' && (
        <>
          <Edge
            from={RESETTLED[NEW_SLOTS[0]]}
            to={RULE_MAKER}
            fromGap={nodeRadius(58)}
            toGap={rI}
            index={102}
            arrow
            strong
            accent
            bend={-60}
          />
          <Note x={600} y={250} strong>
            {a.capture}
          </Note>
        </>
      )}

      {/* marks: agents, new actors, regulator, rule-maker */}
      {resettled
        ? RESETTLED.map((p, i) =>
            NEW_SLOTS.includes(i) ? null : <Node key={`agent-${i}`} id={50 + i} x={p.x} y={p.y} />
          )
        : SETTLED.map((p, i) => {
            const out = state === 'why' ? DISPLACED[i] : undefined;
            return (
              <Node
                key={`agent-${i}`}
                id={50 + i}
                x={out ? out.x : p.x}
                y={out ? out.y : p.y}
                muted={Boolean(out)}
              />
            );
          })}
      {actors.map((p, i) => (
        <Node
          key={`actor-${i}`}
          id={58 + i}
          x={p.x}
          y={p.y}
          shape="triangle"
          dashed={state === 'question'}
          accent={!resettled}
          strong={state === 'open' && i === 0}
        />
      ))}
      <Node
        id={97}
        x={REGULATOR.x}
        y={REGULATOR.y}
        shape="rounded-square"
        scale={2.1}
        label={a.institution}
      />
      {resettled && (
        <Node
          id={83}
          x={RULE_MAKER.x}
          y={RULE_MAKER.y}
          shape="rounded-square"
          scale={2.1}
          dashed
          label={a.meta}
          labelPlacement="right"
        />
      )}

      {/* variety bars: the system against its regulator */}
      {varietyBars && (
        <g transform="translate(60 96)">
          <text className={styles.axis} x="0" y="-8">
            {a.varietyTitle}
          </text>
          <rect className={styles.bar} x="0" y="10" width={varietyBars[0]} height="14" />
          <rect
            className={`${styles.bar} ${state === 'why' ? styles.barAccent : ''}`}
            x="0"
            y="34"
            width={varietyBars[1]}
            height="14"
          />
          <text className={styles.axis} x="160" y="21">
            {a.varietySystem}
          </text>
          <text className={styles.axis} x="160" y="45">
            {a.varietyRules}
          </text>
          <Note x={0} y={80}>
            {state === 'why' ? a.varietyNote : a.varietyMatched}
          </Note>
        </g>
      )}

      {/* notes per beat */}
      {state === 'question' && (
        <>
          <Note x={205} y={262} anchor="middle" strong>
            ?
          </Note>
          <Note x={OUTSIDE.x} y={556} anchor="middle">
            {a.arrive}
          </Note>
          <Note x={SYSTEM.x} y={578} anchor="middle">
            {a.balance}
          </Note>
          <Note x={SYSTEM.x} y={616} anchor="middle" muted>
            {a.questionNote}
          </Note>
        </>
      )}
      {state === 'why' && (
        <>
          <Note x={592} y={220}>
            {a.pushedOut}
          </Note>
          <Note x={SYSTEM.x} y={600} anchor="middle">
            {a.broken}
          </Note>
        </>
      )}
      {state === 'shape' && (
        <Note x={SYSTEM.x} y={600} anchor="middle">
          {a.resettled}
        </Note>
      )}
      {state === 'open' && (
        <>
          <Note x={690} y={120} strong>
            ?
          </Note>
          <Note x={SYSTEM.x} y={596} anchor="middle">
            {a.openNote}
          </Note>
        </>
      )}

      <LegendRow entries={labels.legend} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 04  Infrastructure: one population, composable institutions         */
/* ------------------------------------------------------------------ */

const MODELS: P[] = [
  { x: 230, y: 250 },
  { x: 450, y: 250 },
  { x: 670, y: 250 },
];
const PLANNED: P = { x: 810, y: 390 };
const POPULATION: P = { x: 450, y: 470 };

function InfrastructureFigure({ state, labels }: FigureProps) {
  const a = labels.annotations;
  const past = (s: AreaStepState) => ORDER.indexOf(state) >= ORDER.indexOf(s);
  const rM = nodeRadius(61, 3.3);
  const modelLabels = [a.market, a.polity, a.culture];
  return (
    <g className={styles.scene} key={state}>
      <Caption>{labels.captions[state]}</Caption>

      {/* separate stories in the first beat */}
      {state === 'question' &&
        MODELS.map((m, i) => (
          <g key={`story-${i}`}>
            <Loop seed={40 + i} cx={m.x} cy={m.y + 20} rx={92} ry={98} dashed />
            <Note x={m.x} y={m.y + 150} anchor="middle" muted>
              {a.separate}
            </Note>
          </g>
        ))}

      {/* the shared population */}
      {past('why') && (
        <>
          <Loop seed={41} cx={POPULATION.x} cy={POPULATION.y} rx={300} ry={46} strong />
          <Note x={POPULATION.x} y={POPULATION.y + 6} anchor="middle" strong>
            {a.population}
          </Note>
          {MODELS.map((m, i) => (
            <g key={`rw-${i}`}>
              <Edge
                from={{ x: POPULATION.x + (i - 1) * 150 - 14, y: POPULATION.y - 44 }}
                to={{ x: m.x - 12, y: m.y }}
                fromGap={0}
                toGap={rM}
                index={110 + i}
                arrow
                bend={-8}
              />
              <Edge
                from={{ x: m.x + 12, y: m.y }}
                to={{ x: POPULATION.x + (i - 1) * 150 + 14, y: POPULATION.y - 44 }}
                fromGap={rM}
                toGap={0}
                index={120 + i}
                arrow
                bend={-8}
              />
            </g>
          ))}
          <Note x={110} y={400}>
            {a.readWrite}
          </Note>
          <Leader from={{ x: 150, y: 380 }} to={{ x: 196, y: 348 }} index={7} bend={-10} />
        </>
      )}

      {/* coupling between models */}
      {past('shape') && (
        <>
          <Edge
            from={MODELS[0]}
            to={MODELS[1]}
            fromGap={rM}
            toGap={rM}
            index={130}
            pattern="dashed"
            arrow
            bend={-22}
          />
          <Edge
            from={MODELS[1]}
            to={MODELS[2]}
            fromGap={rM}
            toGap={rM}
            index={131}
            pattern="dashed"
            arrow
            bend={-22}
          />
          <Edge
            from={MODELS[2]}
            to={MODELS[0]}
            fromGap={rM}
            toGap={rM}
            index={132}
            pattern="dashed"
            arrow
            bend={70}
          />
          <Note x={450} y={112} anchor="middle">
            {a.coupling}
          </Note>
          {/* the compiler row: declared effects give the order */}
          <g transform="translate(560 560)">
            <text className={styles.axis} x="0" y="-14">
              {a.compilerTitle}
            </text>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <Node
                  id={70 + i}
                  x={i * 70 + 16}
                  y={16}
                  shape="rounded-square"
                  scale={1.3}
                  label={String(i + 1)}
                />
                {i < 2 && (
                  <Edge
                    from={{ x: i * 70 + 16, y: 16 }}
                    to={{ x: (i + 1) * 70 + 16, y: 16 }}
                    fromGap={nodeRadius(70 + i, 1.3)}
                    toGap={nodeRadius(71 + i, 1.3)}
                    index={140 + i}
                    arrow
                    bend={0}
                  />
                )}
              </g>
            ))}
            <Note x={230} y={22}>
              {a.compilerNote}
            </Note>
          </g>
        </>
      )}

      {/* the models */}
      {MODELS.map((m, i) => (
        <Node
          key={i}
          id={61 + i}
          x={m.x}
          y={m.y}
          shape="rounded-square"
          scale={3.3}
          label={modelLabels[i]}
          labelPlacement="inside"
        />
      ))}

      {/* what enters next */}
      {state === 'open' && (
        <>
          <Node
            id={66}
            x={PLANNED.x}
            y={PLANNED.y}
            shape="triangle"
            scale={2.1}
            dashed
            accent
            label={a.planned}
          />
          <Edge
            from={PLANNED}
            to={{ x: POPULATION.x + 262, y: POPULATION.y - 26 }}
            fromGap={rM}
            toGap={0}
            index={150}
            pattern="dashed"
            arrow
            accent
            bend={20}
          />
          <Note x={PLANNED.x + 34} y={PLANNED.y - 40} strong>
            ?
          </Note>
          <Note x={110} y={600}>
            {a.openNote}
          </Note>
        </>
      )}
      {state === 'why' && (
        <Note x={640} y={600}>
          {a.whyNote}
        </Note>
      )}

      <LegendRow entries={labels.legend} />
    </g>
  );
}

/* ------------------------------------------------------------------ */

const FIGURES = {
  'collective-agency': CollectiveAgencyFigure,
  dynamics: DynamicsFigure,
  governance: GovernanceFigure,
  infrastructure: InfrastructureFigure,
} as const;

export default function AreaFigure({ area, state }: { area: ResearchArea; state: AreaStepState }) {
  const Figure = FIGURES[area.id];
  const titleId = `${area.id}-figure-title`;
  const descId = `${area.id}-figure-desc`;
  return (
    <svg
      className={styles.svg}
      viewBox={`0 0 ${FIG_W} ${FIG_H}`}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
    >
      <title id={titleId}>{area.figure.title}</title>
      <desc id={descId}>{area.figure.description}</desc>
      <Paper />
      <Figure state={state} labels={area.figure} />
    </svg>
  );
}
