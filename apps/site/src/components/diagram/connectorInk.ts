export interface DiagramPoint {
  x: number;
  y: number;
}

/**
 * Canonical connector ink selected in the brand stroke lab on 2026-07-30.
 *
 * The three approved seeds all held up across direct, bow, and soft-S routes,
 * so this is a profile token rather than a specimen-specific exception.
 */
export const NOTEBOOK_CONNECTOR_MEDIUM = {
  id: 'notebook-connector-medium-v1',
  sourceLabProfileId: 'rough-reference',
  roughness: 1,
  bowing: 1,
  maxRandomnessOffset: 2,
  disableMultiStroke: false,
  preserveVertices: false,
  strokeWidth: 1.05,
} as const;

export const NOTEBOOK_CONNECTOR_SEEDS = [1103, 4409, 7919] as const;

export const APPROVED_CONNECTOR_GEOMETRIES = [
  'direct',
  'bow-shallow',
  'bow-deep',
  's-soft',
] as const;

export const NOTEBOOK_CONNECTION_PATTERNS = {
  solid: {
    id: 'solid',
    dashArray: undefined,
  },
  dashLong: {
    id: 'dash-long',
    dashArray: '12 8',
  },
  dashShort: {
    id: 'dash-short',
    dashArray: '6 6',
  },
  dotOpen: {
    id: 'dot-open',
    dashArray: '1 7',
  },
  dotDense: {
    id: 'dot-dense',
    dashArray: '1 4.5',
  },
} as const;

export type NotebookConnectionPattern =
  (typeof NOTEBOOK_CONNECTION_PATTERNS)[keyof typeof NOTEBOOK_CONNECTION_PATTERNS];

export function connectorSeed(index: number) {
  return NOTEBOOK_CONNECTOR_SEEDS[index % NOTEBOOK_CONNECTOR_SEEDS.length];
}

export function openArrowHeadPath(
  end: DiagramPoint,
  tangent: DiagramPoint,
  length = 14,
  spread = 6.8
) {
  const tangentLength = Math.hypot(tangent.x, tangent.y) || 1;
  const tx = tangent.x / tangentLength;
  const ty = tangent.y / tangentLength;
  const nx = -ty;
  const ny = tx;
  const upper = {
    x: end.x - tx * length + nx * spread,
    y: end.y - ty * length + ny * spread,
  };
  const lower = {
    x: end.x - tx * length - nx * spread,
    y: end.y - ty * length - ny * spread,
  };

  return `M${upper.x.toFixed(2)} ${upper.y.toFixed(2)}L${end.x.toFixed(
    2
  )} ${end.y.toFixed(2)}L${lower.x.toFixed(2)} ${lower.y.toFixed(2)}`;
}
