import React, { useRef, useEffect } from 'react';
import rough from 'roughjs';
import { SOCIETY_NODES, SOCIETY_EDGES, COLORS } from './societyLayout';

interface Props {
  width: number;
  height: number;
}

/** The 4 research fields as institutional blocks */
const FIELDS = [
  {
    label: 'Complex Systems',
    subtitle: 'emergent behavior',
    color: '#e67e22',
    // Positioned in quadrants
    qx: 0.25,
    qy: 0.25,
    seed: 5001,
  },
  {
    label: 'Comp. Social Science',
    subtitle: 'institutions & norms',
    color: '#3498db',
    qx: 0.75,
    qy: 0.25,
    seed: 5002,
  },
  {
    label: 'Cooperative AI',
    subtitle: 'joint strategies',
    color: '#2ecc71',
    qx: 0.25,
    qy: 0.72,
    seed: 5003,
  },
  {
    label: 'Agent Foundations',
    subtitle: 'theoretical groundwork',
    color: '#e74c3c',
    qx: 0.75,
    qy: 0.72,
    seed: 5004,
  },
];

export default function StepFieldsIntro({ width, height }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const drawnRef = useRef(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || width < 10 || height < 10) return;
    if (drawnRef.current) return;
    drawnRef.current = true;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const pad = 30;
    const w = width - 2 * pad;
    const h = height - 2 * pad;

    // Draw faint ghost of the society network in the background
    for (const edge of SOCIETY_EDGES) {
      const sn = SOCIETY_NODES.find((n) => n.id === edge.source);
      const tn = SOCIETY_NODES.find((n) => n.id === edge.target);
      if (!sn || !tn) continue;
      svg.appendChild(
        rc.line(
          pad + sn.nx * w, pad + sn.ny * h,
          pad + tn.nx * w, pad + tn.ny * h,
          { seed: edge.seed, roughness: 0.8, stroke: '#00000008', strokeWidth: 0.5 }
        )
      );
    }
    for (const node of SOCIETY_NODES) {
      const x = pad + node.nx * w;
      const y = pad + node.ny * h;
      svg.appendChild(
        rc.circle(x, y, node.radius * 1.2, {
          seed: node.seed,
          roughness: 1,
          stroke: '#00000010',
          strokeWidth: 0.5,
          fill: '#00000008',
          fillStyle: 'solid',
        })
      );
    }

    // Draw the 4 field blocks as institution-style rounded rectangles
    const isSmall = width < 480;
    const blockW = isSmall ? w * 0.38 : w * 0.34;
    const blockH = isSmall ? 48 : 56;

    for (const field of FIELDS) {
      const cx = pad + field.qx * w;
      const cy = pad + field.qy * h;
      const bx = cx - blockW / 2;
      const by = cy - blockH / 2;

      // Block background
      svg.appendChild(
        rc.rectangle(bx, by, blockW, blockH, {
          seed: field.seed,
          roughness: 1.2,
          stroke: field.color,
          strokeWidth: 2,
          fill: '#ffffff',
          fillStyle: 'solid',
        })
      );

      // Colored left accent bar
      svg.appendChild(
        rc.rectangle(bx, by, 4, blockH, {
          seed: field.seed + 10,
          roughness: 0.8,
          stroke: field.color,
          strokeWidth: 0,
          fill: field.color,
          fillStyle: 'solid',
        })
      );

      // Field name
      const nameEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nameEl.setAttribute('x', String(cx + 2));
      nameEl.setAttribute('y', String(cy - 5));
      nameEl.setAttribute('text-anchor', 'middle');
      nameEl.setAttribute('font-size', isSmall ? '10' : '12');
      nameEl.setAttribute('font-weight', '700');
      nameEl.setAttribute('fill', field.color);
      nameEl.setAttribute('font-family', 'inherit');
      nameEl.textContent = field.label;
      svg.appendChild(nameEl);

      // Subtitle (what it studies)
      const subEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      subEl.setAttribute('x', String(cx + 2));
      subEl.setAttribute('y', String(cy + 12));
      subEl.setAttribute('text-anchor', 'middle');
      subEl.setAttribute('font-size', isSmall ? '8' : '10');
      subEl.setAttribute('fill', '#666');
      subEl.setAttribute('font-style', 'italic');
      subEl.setAttribute('font-family', 'inherit');
      subEl.textContent = field.subtitle;
      svg.appendChild(subEl);
    }

    // Faint arrows from each field block pointing toward the center (the problem space)
    const centerX = pad + 0.5 * w;
    const centerY = pad + 0.48 * h;

    for (const field of FIELDS) {
      const fx = pad + field.qx * w;
      const fy = pad + field.qy * h;
      const dx = centerX - fx;
      const dy = centerY - fy;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = dx / len;
      const ny = dy / len;

      // Start from edge of block, end partway toward center
      const startDist = Math.max(blockW, blockH) / 2 + 8;
      const endDist = len * 0.45;
      const sx = fx + nx * startDist;
      const sy = fy + ny * startDist;
      const ex = fx + nx * endDist;
      const ey = fy + ny * endDist;

      svg.appendChild(
        rc.line(sx, sy, ex, ey, {
          seed: field.seed + 20,
          roughness: 0.6,
          stroke: field.color + '55',
          strokeWidth: 1.5,
          strokeLineDash: [4, 3],
        })
      );
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
