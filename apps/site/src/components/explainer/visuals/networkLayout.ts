// Deterministic cluster layout for Steps 5-7 network visualization

export interface NetworkNode {
  id: string;
  x: number;
  y: number;
  cluster: number;
  radius: number;
  seed: number;
}

export interface NetworkEdge {
  source: string;
  target: string;
  cross: boolean; // true = inter-cluster edge
}

export interface ClusterDef {
  label: string;
  color: string;
  cx: number;
  cy: number;
}

export const CLUSTERS: ClusterDef[] = [
  { label: 'Cooperative AI', color: '#2ecc71', cx: 0.25, cy: 0.25 },
  { label: 'Computational Social Science', color: '#3498db', cx: 0.75, cy: 0.25 },
  { label: 'Agent Foundations', color: '#e74c3c', cx: 0.25, cy: 0.75 },
  { label: 'Complex Systems', color: '#e67e22', cx: 0.75, cy: 0.75 },
];

const BRIDGE_COLOR = '#003B7E'; // --color-primary

// Seeded pseudo-random number generator (mulberry32)
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateNodes(
  nodesPerCluster: number,
  width: number,
  height: number
): NetworkNode[] {
  const nodes: NetworkNode[] = [];
  const rng = mulberry32(42);
  const clusterRadius = Math.min(width, height) * 0.15;

  for (let ci = 0; ci < CLUSTERS.length; ci++) {
    const c = CLUSTERS[ci];
    for (let i = 0; i < nodesPerCluster; i++) {
      const angle = (2 * Math.PI * i) / nodesPerCluster + rng() * 0.4;
      const dist = clusterRadius * (0.4 + rng() * 0.6);
      nodes.push({
        id: `c${ci}-n${i}`,
        x: c.cx * width + Math.cos(angle) * dist,
        y: c.cy * height + Math.sin(angle) * dist,
        cluster: ci,
        radius: 6 + rng() * 6,
        seed: Math.floor(rng() * 100000),
      });
    }
  }
  return nodes;
}

export function generateIntraEdges(nodes: NetworkNode[]): NetworkEdge[] {
  const edges: NetworkEdge[] = [];
  const rng = mulberry32(99);

  for (let ci = 0; ci < CLUSTERS.length; ci++) {
    const clusterNodes = nodes.filter((n) => n.cluster === ci);
    // Connect each node to 2-3 neighbors within its cluster
    for (let i = 0; i < clusterNodes.length; i++) {
      const next = (i + 1) % clusterNodes.length;
      edges.push({ source: clusterNodes[i].id, target: clusterNodes[next].id, cross: false });
      if (rng() > 0.4) {
        const skip = (i + 2) % clusterNodes.length;
        edges.push({ source: clusterNodes[i].id, target: clusterNodes[skip].id, cross: false });
      }
    }
  }
  return edges;
}

export function generateCrossEdges(nodes: NetworkNode[]): NetworkEdge[] {
  // Edges from bridge node to one node in each cluster
  const edges: NetworkEdge[] = [];
  for (let ci = 0; ci < CLUSTERS.length; ci++) {
    const clusterNodes = nodes.filter((n) => n.cluster === ci);
    // Connect bridge to the closest node in each cluster (first one)
    edges.push({ source: 'bridge', target: clusterNodes[0].id, cross: true });
    edges.push({ source: 'bridge', target: clusterNodes[1].id, cross: true });
  }
  return edges;
}

export function generateInterClusterEdges(nodes: NetworkNode[]): NetworkEdge[] {
  // For step 7: edges between adjacent clusters
  const pairs: [number, number][] = [
    [0, 1], // Cooperative AI ↔ Comp Social Sci
    [0, 2], // Cooperative AI ↔ Agent Foundations
    [1, 3], // Comp Social Sci ↔ Complex Systems
    [2, 3], // Agent Foundations ↔ Complex Systems
  ];
  const edges: NetworkEdge[] = [];
  const rng = mulberry32(777);

  for (const [a, b] of pairs) {
    const nodesA = nodes.filter((n) => n.cluster === a);
    const nodesB = nodes.filter((n) => n.cluster === b);
    // 2-3 cross-edges per pair
    const count = 2 + (rng() > 0.5 ? 1 : 0);
    for (let i = 0; i < count; i++) {
      const ai = Math.floor(rng() * nodesA.length);
      const bi = Math.floor(rng() * nodesB.length);
      edges.push({ source: nodesA[ai].id, target: nodesB[bi].id, cross: true });
    }
  }
  return edges;
}

// Step 7: drift clusters inward by 15%
export function getDriftedPositions(
  nodes: NetworkNode[],
  width: number,
  height: number
): Map<string, { x: number; y: number }> {
  const cx = width / 2;
  const cy = height / 2;
  const driftFactor = 0.15;
  const map = new Map<string, { x: number; y: number }>();

  for (const node of nodes) {
    const dx = cx - node.x;
    const dy = cy - node.y;
    map.set(node.id, {
      x: node.x + dx * driftFactor,
      y: node.y + dy * driftFactor,
    });
  }
  return map;
}

export { BRIDGE_COLOR };
