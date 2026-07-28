import React, { useRef, useEffect } from 'react';
import rough from 'roughjs';
import {
  SOCIETY_NODES,
  SOCIETY_EDGES,
  DEFECTING_NODES,
  BROKEN_EDGES,
  edgeKey,
  COLORS,
} from './societyLayout';

interface Props {
  width: number;
  height: number;
}

export default function StepDefection({ width, height }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || width < 10 || height < 10) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const pad = 30;
    const w = width - 2 * pad;
    const h = height - 2 * pad;

    // Draw edges — broken ones get dashed style
    for (const edge of SOCIETY_EDGES) {
      const sn = SOCIETY_NODES.find((n) => n.id === edge.source);
      const tn = SOCIETY_NODES.find((n) => n.id === edge.target);
      if (!sn || !tn) continue;

      const isBroken = BROKEN_EDGES.has(edgeKey(edge.source, edge.target));

      svg.appendChild(
        rc.line(
          pad + sn.nx * w, pad + sn.ny * h,
          pad + tn.nx * w, pad + tn.ny * h,
          {
            seed: edge.seed,
            roughness: 0.8,
            stroke: isBroken ? COLORS.edgeBroken : COLORS.edgeNeutral,
            strokeWidth: isBroken ? 1.5 : 1,
            strokeLineDash: isBroken ? [6, 4] : undefined,
          }
        )
      );
    }

    // Draw self-interest arrows from defecting nodes
    for (const node of SOCIETY_NODES) {
      if (!DEFECTING_NODES.has(node.id)) continue;
      const x = pad + node.nx * w;
      const y = pad + node.ny * h;

      // Arrow pointing outward from center
      const cx = width / 2;
      const cy = height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const arrowLen = 20;
      const ax = (dx / len) * arrowLen;
      const ay = (dy / len) * arrowLen;

      svg.appendChild(
        rc.line(x, y, x + ax, y + ay, {
          seed: node.seed + 500,
          roughness: 0.6,
          stroke: COLORS.defecting,
          strokeWidth: 1.5,
        })
      );
      // Arrowhead
      const angle = Math.atan2(ay, ax);
      const headLen = 6;
      const tipX = x + ax;
      const tipY = y + ay;
      svg.appendChild(
        rc.line(
          tipX, tipY,
          tipX - Math.cos(angle - 0.5) * headLen,
          tipY - Math.sin(angle - 0.5) * headLen,
          { seed: node.seed + 501, roughness: 0.5, stroke: COLORS.defecting, strokeWidth: 1.5 }
        )
      );
      svg.appendChild(
        rc.line(
          tipX, tipY,
          tipX - Math.cos(angle + 0.5) * headLen,
          tipY - Math.sin(angle + 0.5) * headLen,
          { seed: node.seed + 502, roughness: 0.5, stroke: COLORS.defecting, strokeWidth: 1.5 }
        )
      );
    }

    // Draw nodes — defecting ones are red
    for (const node of SOCIETY_NODES) {
      const x = pad + node.nx * w;
      const y = pad + node.ny * h;
      const isDefecting = DEFECTING_NODES.has(node.id);
      const color = isDefecting ? COLORS.defecting : COLORS.neutral;

      if (node.kind === 'institution') {
        const size = node.radius * 2;
        svg.appendChild(
          rc.rectangle(x - size / 2, y - size * 0.35, size, size * 0.7, {
            seed: node.seed,
            roughness: 1.2,
            stroke: color,
            strokeWidth: 1.5,
            fill: color,
            fillStyle: 'solid',
          })
        );
      } else {
        svg.appendChild(
          rc.circle(x, y, node.radius * 2, {
            seed: node.seed,
            roughness: 1.2,
            stroke: color,
            strokeWidth: 1.5,
            fill: color,
            fillStyle: 'solid',
          })
        );
      }
    }
  }, [width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ display: 'block' }}
    />
  );
}
