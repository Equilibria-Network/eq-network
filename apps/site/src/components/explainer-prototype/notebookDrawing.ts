export interface DrawingPoint {
  x: number;
  y: number;
}

export interface DraftedNode {
  radius: number;
  outline: string;
  correction?: string;
}

export type NotebookNodeShape = 'circle' | 'rounded-square' | 'triangle' | 'capsule';
export type EdgeGesture = 'steady' | 'sweeping' | 'quick';

function variation(seed: number, amplitude: number) {
  return ((((seed * 47) % 101) / 100) * 2 - 1) * amplitude;
}

function rounded(value: number) {
  return Math.round(value * 100) / 100;
}

/**
 * A confident hand-drafted ellipse: smooth enough to read as intentional,
 * asymmetric enough not to look stamped by a geometry tool.
 */
export function draftedNode(id: number, shape: NotebookNodeShape = 'circle'): DraftedNode {
  const radius = 10.4 + variation(id + 3, 1.15);
  const rx = radius * (1 + variation(id + 11, 0.055));
  const ry = radius * (1 + variation(id + 29, 0.065));
  const left = -rx + variation(id + 17, 0.42);
  const right = rx + variation(id + 31, 0.42);
  const top = -ry + variation(id + 43, 0.38);
  const bottom = ry + variation(id + 59, 0.38);
  const k = 0.552;

  let outline: string;
  if (shape === 'rounded-square') {
    outline = [
      `M${rounded(left + variation(id + 67, 0.48))},${rounded(top + variation(id + 71, 0.34))}`,
      `L${rounded(right + variation(id + 73, 0.42))},${rounded(top + variation(id + 79, 0.38))}`,
      `L${rounded(right + variation(id + 83, 0.46))},${rounded(bottom + variation(id + 89, 0.34))}`,
      `L${rounded(left + variation(id + 97, 0.42))},${rounded(bottom + variation(id + 101, 0.38))}`,
      'Z',
    ].join(' ');
  } else if (shape === 'triangle') {
    outline = [
      `M${rounded(variation(id + 7, 0.38))},${rounded(top - 0.45)}`,
      `L${rounded(right + variation(id + 13, 0.4))},${rounded(bottom * 0.76 + variation(id + 19, 0.34))}`,
      `L${rounded(left + variation(id + 23, 0.4))},${rounded(bottom * 0.74 + variation(id + 31, 0.34))}`,
      'Z',
    ].join(' ');
  } else if (shape === 'capsule') {
    const wide = rx * 1.28;
    outline = [
      `M${rounded(-wide + ry * 0.72)},${rounded(top)}`,
      `L${rounded(wide - ry * 0.7)},${rounded(top + variation(id + 13, 0.2))}`,
      `C${rounded(wide + 1)},${rounded(top)} ${rounded(wide + 1)},${rounded(bottom)} ${rounded(wide - ry * 0.7)},${rounded(bottom)}`,
      `L${rounded(-wide + ry * 0.72)},${rounded(bottom + variation(id + 17, 0.2))}`,
      `C${rounded(-wide - 1)},${rounded(bottom)} ${rounded(-wide - 1)},${rounded(top)} ${rounded(-wide + ry * 0.72)},${rounded(top)} Z`,
    ].join(' ');
  } else {
    outline = [
      `M${rounded(variation(id + 7, 0.22))},${rounded(top)}`,
      `C${rounded(right * k)},${rounded(top - variation(id + 13, 0.25))}`,
      `${rounded(right + variation(id + 19, 0.22))},${rounded(-ry * k)}`,
      `${rounded(right)},${rounded(variation(id + 23, 0.2))}`,
      `C${rounded(right)},${rounded(bottom * k)}`,
      `${rounded(rx * k)},${rounded(bottom + variation(id + 37, 0.2))}`,
      `${rounded(variation(id + 41, 0.2))},${rounded(bottom)}`,
      `C${rounded(left * k)},${rounded(bottom)}`,
      `${rounded(left + variation(id + 53, 0.2))},${rounded(ry * k)}`,
      `${rounded(left)},${rounded(variation(id + 61, 0.2))}`,
      `C${rounded(left)},${rounded(top * k)}`,
      `${rounded(-rx * k)},${rounded(top)}`,
      `${rounded(variation(id + 7, 0.22))},${rounded(top)}`,
    ].join(' ');
  }

  const correction =
    id % 7 === 1
      ? `M${rounded(left * 0.76)},${rounded(top * 0.63)} Q${rounded(variation(id, 0.35))},${rounded(top - 0.75)} ${rounded(right * 0.7)},${rounded(top * 0.68)}`
      : undefined;

  return { radius, outline, correction };
}

export function draftedEdge(
  source: DrawingPoint,
  target: DrawingPoint,
  sourceRadius: number,
  targetRadius: number,
  index: number,
  gesture: EdgeGesture = 'steady'
) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const startGap = gesture === 'quick' ? sourceRadius - 1.2 : sourceRadius + 0.8;
  const endGap = gesture === 'quick' ? targetRadius + 3.2 : targetRadius + 0.8;
  const start = { x: source.x + ux * startGap, y: source.y + uy * startGap };
  const end = { x: target.x - ux * endGap, y: target.y - uy * endGap };
  const bend =
    gesture === 'sweeping'
      ? variation(index + 5, 7) + (index % 2 === 0 ? 10 : -10)
      : variation(index + 5, gesture === 'quick' ? 5.4 : 3.6);
  const control = {
    x: (start.x + end.x) / 2 - uy * bend,
    y: (start.y + end.y) / 2 + ux * bend,
  };

  return `M${rounded(start.x)},${rounded(start.y)} Q${rounded(control.x)},${rounded(control.y)} ${rounded(end.x)},${rounded(end.y)}`;
}

/**
 * A restrained terminal gesture used on only a few edges. It suggests the
 * pressure fading as a pen leaves the page without applying noise everywhere.
 */
export function edgeFinish(
  source: DrawingPoint,
  target: DrawingPoint,
  targetRadius: number,
  index: number
) {
  if (index % 6 !== 2) return null;
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const end = {
    x: target.x - ux * (targetRadius + 0.8),
    y: target.y - uy * (targetRadius + 0.8),
  };
  const side = index % 2 === 0 ? 1 : -1;
  const start = { x: end.x - ux * 9, y: end.y - uy * 9 };
  const lift = {
    x: end.x + ux * 2.8 - uy * side * 0.65,
    y: end.y + uy * 2.8 + ux * side * 0.65,
  };
  return `M${rounded(start.x)},${rounded(start.y)} Q${rounded(end.x)},${rounded(end.y)} ${rounded(lift.x)},${rounded(lift.y)}`;
}
