// Shared deterministic layout for the "society network" used in steps 1–4.
// Provides ~20 nodes (mix of institution rectangles and agent circles) with edges.
// Each step renders this same layout with different visual overlays.

export interface SocietyNode {
  id: string;
  /** Normalized position 0–1, scaled to canvas at render time */
  nx: number;
  ny: number;
  /** 'institution' = rectangle, 'agent' = circle */
  kind: 'institution' | 'agent';
  radius: number;
  seed: number;
}

export interface SocietyEdge {
  source: string;
  target: string;
  seed: number;
}

// ── Nodes ──────────────────────────────────────────────

export const SOCIETY_NODES: SocietyNode[] = [
  // Institutions (rectangles) — larger, more central
  { id: 'inst-0', nx: 0.28, ny: 0.22, kind: 'institution', radius: 18, seed: 1001 },
  { id: 'inst-1', nx: 0.72, ny: 0.18, kind: 'institution', radius: 16, seed: 1002 },
  { id: 'inst-2', nx: 0.5, ny: 0.48, kind: 'institution', radius: 20, seed: 1003 },
  { id: 'inst-3', nx: 0.2, ny: 0.65, kind: 'institution', radius: 16, seed: 1004 },
  { id: 'inst-4', nx: 0.78, ny: 0.7, kind: 'institution', radius: 17, seed: 1005 },
  { id: 'inst-5', nx: 0.48, ny: 0.82, kind: 'institution', radius: 15, seed: 1006 },

  // Agents (circles) — smaller, distributed around institutions
  { id: 'ag-0', nx: 0.15, ny: 0.15, kind: 'agent', radius: 8, seed: 2001 },
  { id: 'ag-1', nx: 0.38, ny: 0.12, kind: 'agent', radius: 9, seed: 2002 },
  { id: 'ag-2', nx: 0.58, ny: 0.1, kind: 'agent', radius: 7, seed: 2003 },
  { id: 'ag-3', nx: 0.85, ny: 0.28, kind: 'agent', radius: 8, seed: 2004 },
  { id: 'ag-4', nx: 0.12, ny: 0.4, kind: 'agent', radius: 9, seed: 2005 },
  { id: 'ag-5', nx: 0.38, ny: 0.35, kind: 'agent', radius: 7, seed: 2006 },
  { id: 'ag-6', nx: 0.65, ny: 0.35, kind: 'agent', radius: 8, seed: 2007 },
  { id: 'ag-7', nx: 0.88, ny: 0.5, kind: 'agent', radius: 7, seed: 2008 },
  { id: 'ag-8', nx: 0.08, ny: 0.58, kind: 'agent', radius: 8, seed: 2009 },
  { id: 'ag-9', nx: 0.35, ny: 0.6, kind: 'agent', radius: 9, seed: 2010 },
  { id: 'ag-10', nx: 0.62, ny: 0.58, kind: 'agent', radius: 7, seed: 2011 },
  { id: 'ag-11', nx: 0.9, ny: 0.78, kind: 'agent', radius: 8, seed: 2012 },
  { id: 'ag-12', nx: 0.3, ny: 0.8, kind: 'agent', radius: 7, seed: 2013 },
  { id: 'ag-13', nx: 0.68, ny: 0.85, kind: 'agent', radius: 8, seed: 2014 },
];

// ── Edges ──────────────────────────────────────────────

export const SOCIETY_EDGES: SocietyEdge[] = [
  // Institution–institution (backbone)
  { source: 'inst-0', target: 'inst-2', seed: 3001 },
  { source: 'inst-1', target: 'inst-2', seed: 3002 },
  { source: 'inst-2', target: 'inst-3', seed: 3003 },
  { source: 'inst-2', target: 'inst-4', seed: 3004 },
  { source: 'inst-3', target: 'inst-5', seed: 3005 },
  { source: 'inst-4', target: 'inst-5', seed: 3006 },
  { source: 'inst-0', target: 'inst-1', seed: 3007 },

  // Agent–institution
  { source: 'ag-0', target: 'inst-0', seed: 3010 },
  { source: 'ag-1', target: 'inst-0', seed: 3011 },
  { source: 'ag-2', target: 'inst-1', seed: 3012 },
  { source: 'ag-3', target: 'inst-1', seed: 3013 },
  { source: 'ag-4', target: 'inst-0', seed: 3014 },
  { source: 'ag-5', target: 'inst-2', seed: 3015 },
  { source: 'ag-6', target: 'inst-2', seed: 3016 },
  { source: 'ag-7', target: 'inst-4', seed: 3017 },
  { source: 'ag-8', target: 'inst-3', seed: 3018 },
  { source: 'ag-9', target: 'inst-3', seed: 3019 },
  { source: 'ag-10', target: 'inst-4', seed: 3020 },
  { source: 'ag-11', target: 'inst-4', seed: 3021 },
  { source: 'ag-12', target: 'inst-5', seed: 3022 },
  { source: 'ag-13', target: 'inst-5', seed: 3023 },

  // Agent–agent (peer connections)
  { source: 'ag-0', target: 'ag-1', seed: 3030 },
  { source: 'ag-2', target: 'ag-3', seed: 3031 },
  { source: 'ag-5', target: 'ag-6', seed: 3032 },
  { source: 'ag-4', target: 'ag-8', seed: 3033 },
  { source: 'ag-9', target: 'ag-10', seed: 3034 },
  { source: 'ag-12', target: 'ag-13', seed: 3035 },
  { source: 'ag-9', target: 'ag-12', seed: 3036 },
  { source: 'ag-6', target: 'ag-10', seed: 3037 },
  { source: 'ag-1', target: 'ag-5', seed: 3038 },
];

// ── Defection assignment (used by steps 2–4) ──────────

/** Node IDs that "defect" in steps 2+ */
export const DEFECTING_NODES = new Set([
  'ag-3',
  'ag-7',
  'inst-4',
  'ag-11',
  'ag-6',
  'ag-13',
  'inst-1',
]);

/** Edges that break (become dashed) in steps 2+ */
export const BROKEN_EDGES = new Set([
  'inst-1-inst-2',
  'ag-3-inst-1',
  'ag-7-inst-4',
  'ag-6-inst-2',
  'ag-6-ag-10',
  'ag-11-inst-4',
  'ag-13-inst-5',
]);

/** Helper to create an edge key for set lookup */
export function edgeKey(source: string, target: string): string {
  return `${source}-${target}`;
}

// ── Region assignment for step 3 (cooperative vs non-cooperative) ──

/** Nodes in the "cooperative" region (left/center cluster) */
export const COOPERATIVE_REGION = new Set([
  'inst-0',
  'inst-2',
  'inst-3',
  'inst-5',
  'ag-0',
  'ag-1',
  'ag-4',
  'ag-5',
  'ag-8',
  'ag-9',
  'ag-12',
]);

/** Nodes in the "non-cooperative" region (right cluster) */
export const NON_COOPERATIVE_REGION = new Set([
  'inst-1',
  'inst-4',
  'ag-2',
  'ag-3',
  'ag-6',
  'ag-7',
  'ag-10',
  'ag-11',
  'ag-13',
]);

// ── Colors ─────────────────────────────────────────────

export const COLORS = {
  neutral: '#003B7E',
  neutralFill: '#003B7E',
  cooperative: '#2ecc71',
  cooperativeFill: '#2ecc71',
  defecting: '#e74c3c',
  defectingFill: '#e74c3c',
  edgeNeutral: '#00000030',
  edgeBroken: '#e74c3c55',
  uncertain: '#e67e22',
} as const;
