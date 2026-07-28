import React, { useRef, useEffect } from 'react';
import rough from 'roughjs';
import { SOCIETY_NODES, SOCIETY_EDGES, COLORS } from './societyLayout';

interface Props {
  width: number;
  height: number;
}

export default function StepSocietyNetwork({ width, height }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || width < 10 || height < 10) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const pad = 30;
    const w = width - 2 * pad;
    const h = height - 2 * pad;

    // Draw edges
    for (const edge of SOCIETY_EDGES) {
      const sn = SOCIETY_NODES.find((n) => n.id === edge.source);
      const tn = SOCIETY_NODES.find((n) => n.id === edge.target);
      if (!sn || !tn) continue;

      svg.appendChild(
        rc.line(pad + sn.nx * w, pad + sn.ny * h, pad + tn.nx * w, pad + tn.ny * h, {
          seed: edge.seed,
          roughness: 0.8,
          stroke: COLORS.edgeNeutral,
          strokeWidth: 1,
        })
      );
    }

    // Draw nodes
    for (const node of SOCIETY_NODES) {
      const x = pad + node.nx * w;
      const y = pad + node.ny * h;

      if (node.kind === 'institution') {
        const size = node.radius * 2;
        svg.appendChild(
          rc.rectangle(x - size / 2, y - size * 0.35, size, size * 0.7, {
            seed: node.seed,
            roughness: 1.2,
            stroke: COLORS.neutral,
            strokeWidth: 1.5,
            fill: COLORS.neutralFill,
            fillStyle: 'solid',
          })
        );
      } else {
        svg.appendChild(
          rc.circle(x, y, node.radius * 2, {
            seed: node.seed,
            roughness: 1.2,
            stroke: COLORS.neutral,
            strokeWidth: 1.5,
            fill: COLORS.neutralFill,
            fillStyle: 'solid',
          })
        );
      }
    }
  }, [width, height]);

  return <svg ref={svgRef} width={width} height={height} style={{ display: 'block' }} />;
}
