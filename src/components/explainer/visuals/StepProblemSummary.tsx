import React, { useRef, useEffect } from 'react';
import rough from 'roughjs';
import {
  SOCIETY_NODES,
  SOCIETY_EDGES,
  COOPERATIVE_REGION,
  COLORS,
} from './societyLayout';

interface Props {
  width: number;
  height: number;
}

export default function StepProblemSummary({ width, height }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const drawnRef = useRef(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || width < 10 || height < 10) return;
    if (drawnRef.current) return;
    drawnRef.current = true;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    // Zoomed-out effect: more padding to make network appear smaller / further away
    const pad = 60;
    const w = width - 2 * pad;
    const h = height - 2 * pad;

    // Draw edges — all slightly faded
    for (const edge of SOCIETY_EDGES) {
      const sn = SOCIETY_NODES.find((n) => n.id === edge.source);
      const tn = SOCIETY_NODES.find((n) => n.id === edge.target);
      if (!sn || !tn) continue;

      svg.appendChild(
        rc.line(
          pad + sn.nx * w, pad + sn.ny * h,
          pad + tn.nx * w, pad + tn.ny * h,
          {
            seed: edge.seed,
            roughness: 0.8,
            stroke: '#00000018',
            strokeWidth: 0.8,
          }
        )
      );
    }

    // Draw nodes — mixed green/red/orange with uncertainty
    for (const node of SOCIETY_NODES) {
      const x = pad + node.nx * w;
      const y = pad + node.ny * h;
      const isCoop = COOPERATIVE_REGION.has(node.id);
      const color = isCoop ? COLORS.cooperative : COLORS.defecting;

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

      // Question mark labels on a subset of nodes
      if (node.id === 'inst-2' || node.id === 'ag-5' || node.id === 'ag-10' ||
          node.id === 'inst-4' || node.id === 'ag-9' || node.id === 'ag-3') {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', String(x));
        label.setAttribute('y', String(y - node.radius - 5));
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '14');
        label.setAttribute('font-weight', '700');
        label.setAttribute('fill', COLORS.uncertain);
        label.setAttribute('font-family', 'inherit');
        label.textContent = '?';
        svg.appendChild(label);
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
