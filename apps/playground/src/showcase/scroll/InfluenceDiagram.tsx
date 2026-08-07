import { combinedInfluenceDiagram } from './influenceDiagramData';
import type { DiagramEdge } from './influenceDiagramData';

/** The combined model's influence diagram as static semantic SVG. Semantic
    channels per DIAGRAMS.md, with the role vocabulary replaced for this
    domain and declared in the in-figure legend: circle = conserved ledger,
    rounded box = state variable, solid = conserved flow, dashed = moves a
    rate or structure, heavy blue = cross-system channel (redundantly
    encoded by weight and a dial note). Open arrowheads, no filled markers.
    Layout is authored here; the CONTENT comes from influenceDiagramData.ts
    and is traceability-tested against the engine fixture. */

const INK = 'var(--pg-graphite, #4b5563)';
const NAVY = 'var(--pg-navy, #1f2a44)';
const BLUE = 'var(--pg-blue, #2563eb)';
const MUTED = 'var(--pg-muted, #7b8494)';
const PAPER = 'var(--pg-white, #ffffff)';

interface NodeGeometry {
  cx: number;
  cy: number;
  r?: number;
  w?: number;
  h?: number;
}

const NODE_GEOMETRY: Record<string, NodeGeometry> = {
  capital: { cx: 150, cy: 95, w: 172, h: 56 },
  attention: { cx: 700, cy: 95, r: 42 },
  wealth: { cx: 425, cy: 215, r: 42 },
  income: { cx: 150, cy: 355, w: 150, h: 56 },
  enforcement: { cx: 425, cy: 408, w: 170, h: 52 },
  ballots: { cx: 700, cy: 355, r: 42 },
};

interface EdgeGeometry {
  path: string;
  /** Arrow tip position and direction (degrees, 0 = pointing right). */
  tip: { x: number; y: number; angle: number };
  label: { x: number; y: number; anchor: 'start' | 'middle' | 'end' };
}

const EDGE_GEOMETRY: Record<string, EdgeGeometry> = {
  production: {
    path: 'M 150 123 L 150 322',
    tip: { x: 150, y: 325, angle: 90 },
    label: { x: 160, y: 232, anchor: 'start' },
  },
  'income-lands': {
    path: 'M 227 340 Q 310 292 386 237',
    tip: { x: 389, y: 235, angle: -35 },
    label: { x: 355, y: 256, anchor: 'end' },
  },
  reinvest: {
    path: 'M 392 193 Q 310 142 240 112',
    tip: { x: 237, y: 111, angle: -157 },
    label: { x: 300, y: 136, anchor: 'start' },
  },
  compound: {
    path: 'M 110 66 C 96 24 184 24 170 64',
    tip: { x: 170, y: 64, angle: 105 },
    label: { x: 140, y: 16, anchor: 'middle' },
  },
  advertise: {
    path: 'M 458 193 Q 545 140 656 113',
    tip: { x: 659, y: 112, angle: -12 },
    label: { x: 690, y: 172, anchor: 'end' },
  },
  prominence: {
    path: 'M 678 57 C 664 15 748 19 719 59',
    tip: { x: 719, y: 59, angle: 118 },
    label: { x: 700, y: 12, anchor: 'middle' },
  },
  attract: {
    path: 'M 700 137 L 700 308',
    tip: { x: 700, y: 311, angle: 90 },
    label: { x: 712, y: 224, anchor: 'start' },
  },
  lobby: {
    path: 'M 425 257 L 425 377',
    tip: { x: 425, y: 380, angle: 90 },
    label: { x: 435, y: 316, anchor: 'start' },
  },
  'tax-target': {
    path: 'M 658 372 Q 440 540 233 380',
    tip: { x: 230, y: 378, angle: -155 },
    label: { x: 445, y: 487, anchor: 'middle' },
  },
  'tax-binds': {
    path: 'M 338 398 Q 288 390 232 373',
    tip: { x: 229, y: 372, angle: -163 },
    label: { x: 300, y: 368, anchor: 'start' },
  },
};

/** Open `->` arrowhead drawn as two strokes, matching the shaft weight. */
function ArrowTip({
  x,
  y,
  angle,
  color,
  width,
}: {
  x: number;
  y: number;
  angle: number;
  color: string;
  width: number;
}) {
  const length = 11;
  const spread = 26;
  const left = ((angle + 180 + spread) * Math.PI) / 180;
  const right = ((angle + 180 - spread) * Math.PI) / 180;
  const d =
    `M ${x + length * Math.cos(left)} ${y + length * Math.sin(left)} L ${x} ${y} ` +
    `L ${x + length * Math.cos(right)} ${y + length * Math.sin(right)}`;
  return <path d={d} fill="none" stroke={color} strokeLinecap="round" strokeWidth={width} />;
}

function EdgeShape({ edge }: { edge: DiagramEdge }) {
  const geometry = EDGE_GEOMETRY[edge.id];
  if (!geometry) throw new Error(`influence diagram edge ${edge.id} has no geometry`);
  const color = edge.channel ? BLUE : INK;
  const width = edge.channel ? 2.4 : 1.6;
  return (
    <g>
      <path
        d={geometry.path}
        fill="none"
        stroke={color}
        strokeDasharray={edge.kind === 'modulation' ? '7 6' : undefined}
        strokeLinecap="round"
        strokeWidth={width}
      />
      <ArrowTip
        angle={geometry.tip.angle}
        color={color}
        width={width}
        x={geometry.tip.x}
        y={geometry.tip.y}
      />
      <text
        fill={edge.channel ? BLUE : INK}
        fontFamily="'Kalam', cursive"
        fontSize={14}
        textAnchor={geometry.label.anchor}
        x={geometry.label.x}
        y={geometry.label.y}
      >
        {edge.label}
      </text>
      {edge.dial && (
        <text
          fill={MUTED}
          fontFamily="'IBM Plex Mono', monospace"
          fontSize={9.5}
          textAnchor={geometry.label.anchor}
          x={geometry.label.x}
          y={geometry.label.y + 14}
        >
          dial · {edge.dial}
        </text>
      )}
    </g>
  );
}

export default function InfluenceDiagram() {
  const { nodes, edges } = combinedInfluenceDiagram;
  return (
    <div className="scroll-diagram">
      <svg
        aria-labelledby="influence-diagram-title influence-diagram-desc"
        role="img"
        viewBox="0 0 880 520"
      >
        <title id="influence-diagram-title">
          Influence diagram of the combined model: six variables and the couplings between them
        </title>
        <desc id="influence-diagram-desc">
          AI capital produces income, income accrues to wealth, and wealth reinvests into capital.
          Three cross-system channels leave the economy: advertising buys reach in the attention
          network, audience attracts ballot delegation, and lobbying moves enforcement. Ballots set
          the tax target through the power-weighted median and enforcement sets how strongly
          taxation binds, closing the loop back into income.
        </desc>

        {edges.map((edge) => (
          <EdgeShape edge={edge} key={edge.id} />
        ))}

        {nodes.map((node) => {
          const geometry = NODE_GEOMETRY[node.id];
          if (!geometry) throw new Error(`influence diagram node ${node.id} has no geometry`);
          return (
            <g key={node.id}>
              {node.kind === 'ledger' ? (
                <circle
                  cx={geometry.cx}
                  cy={geometry.cy}
                  fill={PAPER}
                  r={geometry.r}
                  stroke={NAVY}
                  strokeWidth={1.8}
                />
              ) : (
                <rect
                  fill={PAPER}
                  height={geometry.h}
                  rx={10}
                  stroke={NAVY}
                  strokeWidth={1.8}
                  width={geometry.w}
                  x={geometry.cx - (geometry.w ?? 0) / 2}
                  y={geometry.cy - (geometry.h ?? 0) / 2}
                />
              )}
              {node.label.split(' & ').map((line, index, lines) => (
                <text
                  fill={NAVY}
                  fontFamily="'Space Grotesk', sans-serif"
                  fontSize={15}
                  fontWeight={500}
                  key={line}
                  textAnchor="middle"
                  x={geometry.cx}
                  y={geometry.cy + 5 + (index - (lines.length - 1) / 2) * 17}
                >
                  {lines.length > 1 && index > 0 ? `& ${line}` : line}
                </text>
              ))}
            </g>
          );
        })}

        {/* In-figure legend: decodes every visual channel used above. */}
        {/* One consolidated legend row, lower-left, per DIAGRAMS.md:
            shapes first, then connections. */}
        <g fontFamily="'IBM Plex Mono', monospace" fontSize={10}>
          <circle cx={24} cy={501} fill="none" r={7} stroke={NAVY} strokeWidth={1.5} />
          <text fill={MUTED} x={38} y={505}>
            conserved ledger
          </text>
          <rect
            fill="none"
            height={14}
            rx={4}
            stroke={NAVY}
            strokeWidth={1.5}
            width={22}
            x={152}
            y={494}
          />
          <text fill={MUTED} x={182} y={505}>
            state variable
          </text>
          <line stroke={INK} strokeWidth={1.6} x1={294} x2={322} y1={501} y2={501} />
          <text fill={MUTED} x={330} y={505}>
            value flows
          </text>
          <line
            stroke={INK}
            strokeDasharray="7 6"
            strokeWidth={1.6}
            x1={412}
            x2={440}
            y1={501}
            y2={501}
          />
          <text fill={MUTED} x={448} y={505}>
            moves a rate or structure
          </text>
          <line stroke={BLUE} strokeWidth={2.4} x1={614} x2={642} y1={501} y2={501} />
          <text fill={MUTED} x={650} y={505}>
            channel (a dial below)
          </text>
        </g>
      </svg>
    </div>
  );
}
