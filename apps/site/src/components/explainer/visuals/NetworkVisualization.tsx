import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import rough from 'roughjs';
import {
  CLUSTERS,
  BRIDGE_COLOR,
  generateNodes,
  generateIntraEdges,
  generateCrossEdges,
  generateInterClusterEdges,
  getDriftedPositions,
  type NetworkEdge,
} from './networkLayout';

interface Props {
  activeStep: number;
  width: number;
  height: number;
}

// Ease-out cubic
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function NetworkVisualization({ activeStep, width, height }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const animFrameRef = useRef(0);
  const prevPositions = useRef<Map<string, { x: number; y: number }>>(new Map());
  const isSmall = width < 480;
  const nodesPerCluster = isSmall ? 5 : 8;

  const nodes = useMemo(
    () => generateNodes(nodesPerCluster, width, height),
    [nodesPerCluster, width, height]
  );

  const intraEdges = useMemo(() => generateIntraEdges(nodes), [nodes]);
  const crossEdges = useMemo(() => generateCrossEdges(nodes), [nodes]);
  const interEdges = useMemo(() => generateInterClusterEdges(nodes), [nodes]);
  const driftedPositions = useMemo(
    () => getDriftedPositions(nodes, width, height),
    [nodes, width, height]
  );

  const getTargetPositions = useCallback(
    (step: number): Map<string, { x: number; y: number }> => {
      const map = new Map<string, { x: number; y: number }>();

      if (step >= 7) {
        // Step 7: drifted inward + bridge node
        for (const node of nodes) {
          const pos = driftedPositions.get(node.id);
          if (pos) map.set(node.id, pos);
        }
        map.set('bridge', { x: width / 2, y: height / 2 });
      } else {
        // Step 6: original positions (disconnected clusters)
        for (const node of nodes) {
          map.set(node.id, { x: node.x, y: node.y });
        }
      }

      return map;
    },
    [nodes, driftedPositions, width, height]
  );

  const getActiveEdges = useCallback(
    (step: number): NetworkEdge[] => {
      if (step >= 7) return [...intraEdges, ...crossEdges, ...interEdges];
      return intraEdges;
    },
    [intraEdges, crossEdges, interEdges]
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || width < 10 || height < 10) return;

    const targetPositions = getTargetPositions(activeStep);
    const edges = getActiveEdges(activeStep);

    // Initialize prev positions if empty
    if (prevPositions.current.size === 0) {
      for (const [id, pos] of targetPositions) {
        prevPositions.current.set(id, { ...pos });
      }
    }

    // Store start positions for animation
    const startPositions = new Map<string, { x: number; y: number }>();
    for (const [id, pos] of targetPositions) {
      const prev = prevPositions.current.get(id);
      startPositions.set(id, prev ? { ...prev } : { ...pos });
    }

    const duration = 600;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      // Interpolate positions
      const currentPositions = new Map<string, { x: number; y: number }>();
      for (const [id, target] of targetPositions) {
        const start = startPositions.get(id) || target;
        currentPositions.set(id, {
          x: start.x + (target.x - start.x) * easedProgress,
          y: start.y + (target.y - start.y) * easedProgress,
        });
      }

      // Draw frame
      drawFrame(svg, currentPositions, edges, activeStep);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Store final positions
        prevPositions.current = currentPositions;
      }
    };

    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [activeStep, width, height, getTargetPositions, getActiveEdges]);

  const drawFrame = useCallback(
    (
      svg: SVGSVGElement,
      positions: Map<string, { x: number; y: number }>,
      edges: NetworkEdge[],
      step: number
    ) => {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const rc = rough.svg(svg);

      // Draw edges
      for (const edge of edges) {
        const s = positions.get(edge.source);
        const t = positions.get(edge.target);
        if (!s || !t) continue;

        svg.appendChild(
          rc.line(s.x, s.y, t.x, t.y, {
            seed: hashStr(edge.source + edge.target),
            roughness: 0.8,
            stroke: edge.cross ? '#003B7E44' : '#00000022',
            strokeWidth: edge.cross ? 1.5 : 1,
          })
        );
      }

      // Draw cluster labels
      for (let ci = 0; ci < CLUSTERS.length; ci++) {
        const c = CLUSTERS[ci];
        const clusterNodes = nodes.filter((n) => n.cluster === ci);
        // Average position of cluster nodes
        let avgX = 0,
          avgY = 0;
        for (const n of clusterNodes) {
          const pos = positions.get(n.id);
          if (pos) {
            avgX += pos.x;
            avgY += pos.y;
          }
        }
        avgX /= clusterNodes.length;
        avgY /= clusterNodes.length;

        // Find the topmost node in the cluster to place label above it
        let minY = Infinity;
        for (const n of clusterNodes) {
          const pos = positions.get(n.id);
          if (pos && pos.y < minY) minY = pos.y;
        }

        // All labels centered above their cluster
        // CSS (Comp Social Science, index 1) gets extra vertical offset
        const isCSS = ci === 1;
        const labelX = avgX;
        const labelY = minY - (isCSS ? 28 : 18);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', String(labelX));
        label.setAttribute('y', String(labelY));
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '11');
        label.setAttribute('fill', c.color);
        label.setAttribute('font-weight', '600');
        label.setAttribute('font-family', 'inherit');
        label.textContent = c.label;
        svg.appendChild(label);
      }

      // Draw nodes as small institution/journal-style rectangles
      for (const node of nodes) {
        const pos = positions.get(node.id);
        if (!pos) continue;

        const color = CLUSTERS[node.cluster].color;
        const r = node.radius;
        const rectW = r * 2.2;
        const rectH = r * 1.4;

        svg.appendChild(
          rc.rectangle(pos.x - rectW / 2, pos.y - rectH / 2, rectW, rectH, {
            seed: node.seed,
            roughness: 1.2,
            stroke: color,
            strokeWidth: 1.5,
            fill: '#ffffff',
            fillStyle: 'solid',
          })
        );

        // Colored top accent line (like a journal header)
        svg.appendChild(
          rc.line(
            pos.x - rectW / 2 + 1,
            pos.y - rectH / 2,
            pos.x + rectW / 2 - 1,
            pos.y - rectH / 2,
            {
              seed: node.seed + 1,
              roughness: 0.6,
              stroke: color,
              strokeWidth: 2.5,
            }
          )
        );

        // Faint content lines inside
        svg.appendChild(
          rc.line(pos.x - rectW / 2 + 3, pos.y, pos.x + rectW / 2 - 3, pos.y, {
            seed: node.seed + 2,
            roughness: 0.4,
            stroke: color + '44',
            strokeWidth: 0.5,
          })
        );
      }

      // Bridge node (step 7)
      if (step >= 7) {
        const bridgePos = positions.get('bridge');
        if (bridgePos) {
          svg.appendChild(
            rc.circle(bridgePos.x, bridgePos.y, 36, {
              seed: 9999,
              roughness: 1,
              stroke: BRIDGE_COLOR,
              strokeWidth: 2.5,
              fill: BRIDGE_COLOR,
              fillStyle: 'solid',
            })
          );

          // Bridge label
          const bl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          bl.setAttribute('x', String(bridgePos.x));
          bl.setAttribute('y', String(bridgePos.y + 30));
          bl.setAttribute('text-anchor', 'middle');
          bl.setAttribute('font-size', '12');
          bl.setAttribute('fill', BRIDGE_COLOR);
          bl.setAttribute('font-weight', '700');
          bl.setAttribute('font-family', 'inherit');
          bl.textContent = 'Equilibria';
          svg.appendChild(bl);
        }
      }
    },
    [nodes]
  );

  return <svg ref={svgRef} width={width} height={height} style={{ display: 'block' }} />;
}

// Simple string hash for deterministic seeds
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
