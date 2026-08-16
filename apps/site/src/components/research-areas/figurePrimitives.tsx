// Shared hand-drawn primitives for the research-area figures.
//
// Geometry and seeds live here (DIAGRAMS.md: keep renderer geometry and
// seeds with the diagram implementation); every label comes from the typed
// content. Nodes reuse the drafted outlines the thesis world uses, so the
// four figures and the rest of the site share one pen.
import type { ReactNode } from 'react';
import { openArrowHeadPath, type DiagramPoint } from '@components/diagram/connectorInk';
import {
  draftedNode,
  type NotebookNodeShape,
} from '@components/explainer-prototype/notebookDrawing';
import type { LegendEntry, LegendGlyph } from '@content/research-areas/types';
import styles from './research-areas.module.css';

export const FIG_W = 900;
export const FIG_H = 720;

/** Node marks read at roughly 34 CSS px across at desktop size (policy calibration). */
const NODE_SCALE = 1.6;

export type NodeFill = 'open' | 'hatched' | 'solid';

interface NodeProps {
  id: number;
  x: number;
  y: number;
  shape?: NotebookNodeShape;
  fill?: NodeFill;
  scale?: number;
  strong?: boolean;
  dashed?: boolean;
  muted?: boolean;
  accent?: boolean;
  label?: string;
  /** Where the label sits relative to the mark. Inside suits large squares. */
  labelPlacement?: 'below' | 'right' | 'inside';
}

/** Radius (figure units) of a node at the default scale, for trimming edges. */
export function nodeRadius(id: number, scale = NODE_SCALE) {
  return draftedNode(id).radius * scale;
}

export function Node({
  id,
  x,
  y,
  shape = 'circle',
  fill = 'open',
  scale = NODE_SCALE,
  strong = false,
  dashed = false,
  muted = false,
  accent = false,
  label,
  labelPlacement = 'below',
}: NodeProps) {
  const drafted = draftedNode(id, shape);
  const r = drafted.radius * scale;
  const labelProps =
    labelPlacement === 'inside'
      ? { x: 0, y: 5, className: `${styles.nodeLabel} ${styles.nodeLabelInside}` }
      : labelPlacement === 'right'
        ? { x: r + 12, y: 5, className: `${styles.nodeLabel} ${styles.nodeLabelRight}` }
        : { x: 0, y: r + 16, className: styles.nodeLabel };
  const className = [
    styles.node,
    fill === 'hatched' ? styles.nodeHatched : '',
    fill === 'solid' ? styles.nodeSolid : '',
    strong ? styles.nodeStrong : '',
    dashed ? styles.nodeDashed : '',
    muted ? styles.nodeMuted : '',
    accent ? styles.nodeAccent : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <g className={className} transform={`translate(${x} ${y})`}>
      <g transform={`scale(${scale})`}>
        <path d={drafted.outline} />
        {drafted.correction && <path className={styles.nodeCorrection} d={drafted.correction} />}
      </g>
      {label && (
        <text className={labelProps.className} x={labelProps.x} y={labelProps.y}>
          {label}
        </text>
      )}
    </g>
  );
}

interface EdgeGeometry {
  path: string;
  end: DiagramPoint;
  tangent: DiagramPoint;
}

function rounded(value: number) {
  return Math.round(value * 100) / 100;
}

/**
 * A quadratic connector trimmed at both node boundaries. The bend is a small
 * deterministic wobble keyed on the edge index so the same figure always
 * draws the same way; an explicit bend overrides it when a route needs a bow.
 */
export function edgeGeometry(
  from: DiagramPoint,
  to: DiagramPoint,
  fromGap: number,
  toGap: number,
  index: number,
  bend?: number
): EdgeGeometry {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const start = { x: from.x + ux * fromGap, y: from.y + uy * fromGap };
  const end = { x: to.x - ux * toGap, y: to.y - uy * toGap };
  const wobble = ((((index * 37) % 11) - 5) / 5) * 4;
  const b = bend ?? wobble;
  const control = { x: (start.x + end.x) / 2 - uy * b, y: (start.y + end.y) / 2 + ux * b };
  return {
    path: `M${rounded(start.x)},${rounded(start.y)} Q${rounded(control.x)},${rounded(control.y)} ${rounded(end.x)},${rounded(end.y)}`,
    end,
    tangent: { x: end.x - control.x, y: end.y - control.y },
  };
}

export type EdgePattern = 'solid' | 'dashed' | 'dotted';

interface EdgeProps {
  from: DiagramPoint;
  to: DiagramPoint;
  fromGap?: number;
  toGap?: number;
  index: number;
  bend?: number;
  arrow?: boolean;
  pattern?: EdgePattern;
  strong?: boolean;
  muted?: boolean;
  accent?: boolean;
}

export function Edge({
  from,
  to,
  fromGap = 18,
  toGap = 18,
  index,
  bend,
  arrow = false,
  pattern = 'solid',
  strong = false,
  muted = false,
  accent = false,
}: EdgeProps) {
  const geometry = edgeGeometry(from, to, fromGap, arrow ? toGap + 4 : toGap, index, bend);
  const className = [
    styles.edge,
    pattern === 'dashed' ? styles.edgeDashed : '',
    pattern === 'dotted' ? styles.edgeDotted : '',
    strong ? styles.edgeStrong : '',
    muted ? styles.edgeMuted : '',
    accent ? styles.edgeAccent : '',
  ]
    .filter(Boolean)
    .join(' ');
  const t = geometry.tangent;
  const tl = Math.hypot(t.x, t.y) || 1;
  const tip = { x: geometry.end.x + (t.x / tl) * 4, y: geometry.end.y + (t.y / tl) * 4 };
  return (
    <g className={className}>
      <path d={geometry.path} />
      {arrow && <path className={styles.arrowHead} d={openArrowHeadPath(tip, t, 12, 5.6)} />}
    </g>
  );
}

interface LoopProps {
  seed: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  dashed?: boolean;
  strong?: boolean;
  partial?: boolean;
  accent?: boolean;
  label?: string;
  labelY?: number;
}

/**
 * A hand-drafted boundary: the drafted circle outline scaled to an ellipse.
 * partial draws only part of the outline (used for an undecided boundary).
 */
export function Loop({
  seed,
  cx,
  cy,
  rx,
  ry,
  dashed = false,
  strong = false,
  partial = false,
  accent = false,
  label,
  labelY,
}: LoopProps) {
  const drafted = draftedNode(seed, 'circle');
  const sx = rx / drafted.radius;
  const sy = ry / drafted.radius;
  const className = [
    styles.loop,
    dashed ? styles.loopDashed : '',
    strong ? styles.loopStrong : '',
    partial ? styles.loopPartial : '',
    accent ? styles.loopAccent : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <g className={className}>
      <path d={drafted.outline} transform={`translate(${cx} ${cy}) scale(${sx} ${sy})`} />
      {label && (
        <text className={styles.loopLabel} x={cx} y={labelY ?? cy - ry - 10}>
          {label}
        </text>
      )}
    </g>
  );
}

interface NoteProps {
  x: number;
  y: number;
  children: string;
  anchor?: 'start' | 'middle' | 'end';
  strong?: boolean;
  muted?: boolean;
}

/** A handwritten annotation. Newlines in the string become extra lines. */
export function Note({
  x,
  y,
  children,
  anchor = 'start',
  strong = false,
  muted = false,
}: NoteProps) {
  const lines = children.split('\n');
  return (
    <text
      className={`${styles.note} ${strong ? styles.noteStrong : ''} ${muted ? styles.noteMuted : ''}`}
      x={x}
      y={y}
      textAnchor={anchor}
    >
      {lines.map((line, index) => (
        <tspan key={index} x={x} dy={index === 0 ? 0 : 20}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

/** A curved leader from an annotation to the thing it points at. */
export function Leader({
  from,
  to,
  index,
  bend,
}: {
  from: DiagramPoint;
  to: DiagramPoint;
  index: number;
  bend?: number;
}) {
  const geometry = edgeGeometry(from, to, 4, 6, index, bend ?? (index % 2 === 0 ? 18 : -18));
  return (
    <g className={styles.leader}>
      <path d={geometry.path} />
      <path
        className={styles.arrowHead}
        d={openArrowHeadPath(geometry.end, geometry.tangent, 9, 4.2)}
      />
    </g>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  return (
    <text className={styles.caption} x={FIG_W / 2} y={54}>
      {children}
    </text>
  );
}

function LegendGlyphMark({ glyph }: { glyph: LegendGlyph }) {
  const circle = draftedNode(11, 'circle');
  const square = draftedNode(23, 'rounded-square');
  const triangle = draftedNode(31, 'triangle');
  const capsule = draftedNode(41, 'capsule');
  switch (glyph) {
    case 'circle':
      return <path className={styles.legendShape} d={circle.outline} transform="scale(0.85)" />;
    case 'square':
      return <path className={styles.legendShape} d={square.outline} transform="scale(0.85)" />;
    case 'triangle':
      return <path className={styles.legendShape} d={triangle.outline} transform="scale(0.85)" />;
    case 'capsule':
      return <path className={styles.legendShape} d={capsule.outline} transform="scale(0.72)" />;
    case 'dashed-loop':
      return (
        <path
          className={`${styles.legendShape} ${styles.legendDashed}`}
          d={circle.outline}
          transform="scale(1.05)"
        />
      );
    case 'solid-loop':
      return (
        <path
          className={`${styles.legendShape} ${styles.legendStrong}`}
          d={circle.outline}
          transform="scale(1.05)"
        />
      );
    case 'line':
      return <path className={styles.legendLine} d="M-11 0H11" />;
    case 'dashed-line':
      return <path className={`${styles.legendLine} ${styles.legendDashed}`} d="M-11 0H11" />;
    case 'strong-line':
      return <path className={`${styles.legendLine} ${styles.legendStrong}`} d="M-11 0H11" />;
    case 'arrow':
      return (
        <g className={styles.legendLine}>
          <path d="M-11 0H9" />
          <path d={openArrowHeadPath({ x: 11, y: 0 }, { x: 1, y: 0 }, 8, 3.6)} />
        </g>
      );
    case 'dashed-arrow':
      return (
        <g className={styles.legendLine}>
          <path className={styles.legendDashed} d="M-11 0H9" />
          <path d={openArrowHeadPath({ x: 11, y: 0 }, { x: 1, y: 0 }, 8, 3.6)} />
        </g>
      );
    case 'dotted-arrow':
      return (
        <g className={styles.legendLine}>
          <path className={styles.legendDotted} d="M-11 0H9" />
          <path d={openArrowHeadPath({ x: 11, y: 0 }, { x: 1, y: 0 }, 8, 3.6)} />
        </g>
      );
    case 'bar':
      return <rect className={styles.legendBar} x="-6" y="-9" width="12" height="18" />;
    case 'wave':
      return <path className={styles.legendLine} d="M-12 0C-8 -9 -4 -9 0 0S8 9 12 0" />;
    default:
      return null;
  }
}

/**
 * One compact legend row aligned lower-left (policy: shape/fill first, then
 * connections). Entry widths are estimated from label length so entries never
 * overlap at the desktop presentation size.
 */
export function LegendRow({ entries }: { entries: LegendEntry[] }) {
  let cursor = 0;
  return (
    <g className={styles.legendRow} transform="translate(42 684)" role="group" aria-label="legend">
      {entries.map((entry) => {
        const x = cursor;
        cursor += 34 + entry.label.length * 6.9 + 26;
        return (
          <g key={`${entry.glyph}-${entry.label}`} transform={`translate(${x} 0)`}>
            <g transform="translate(12 0)">
              <LegendGlyphMark glyph={entry.glyph} />
            </g>
            <text x="32" y="4">
              {entry.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** Faint notebook grid behind every figure. The shared hatch pattern
    (#ra-hatch) is defined once at page level by the story component. */
export function Paper() {
  const columns = Array.from({ length: Math.floor(FIG_W / 30) + 1 }, (_, i) => i * 30);
  const rows = Array.from({ length: Math.floor(FIG_H / 30) + 1 }, (_, i) => i * 30);
  return (
    <g className={styles.grid} aria-hidden="true">
      {columns.map((x) => (
        <path key={`x${x}`} d={`M${x} 0V${FIG_H}`} />
      ))}
      {rows.map((y) => (
        <path key={`y${y}`} d={`M0 ${y}H${FIG_W}`} />
      ))}
    </g>
  );
}
