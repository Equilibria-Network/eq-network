import React, { useRef, useEffect } from 'react';
import rough from 'roughjs';
import {
  SOCIETY_NODES,
  SOCIETY_EDGES,
  COOPERATIVE_REGION,
  NON_COOPERATIVE_REGION,
  COLORS,
} from './societyLayout';

interface Props {
  width: number;
  height: number;
}

export default function StepBadEquilibria({ width, height }: Props) {
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

    // Slight horizontal separation: cooperative nodes shift left, non-cooperative shift right
    const separation = 0.04;

    function nodeX(node: typeof SOCIETY_NODES[0]): number {
      const shift = COOPERATIVE_REGION.has(node.id) ? -separation : separation;
      return pad + (node.nx + shift) * w;
    }
    function nodeY(node: typeof SOCIETY_NODES[0]): number {
      return pad + node.ny * h;
    }

    // Draw region backgrounds (rough ellipses)
    // Cooperative region — left/center
    const coopNodes = SOCIETY_NODES.filter((n) => COOPERATIVE_REGION.has(n.id));
    const nonCoopNodes = SOCIETY_NODES.filter((n) => NON_COOPERATIVE_REGION.has(n.id));

    function regionBounds(nodes: typeof SOCIETY_NODES) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const n of nodes) {
        const x = nodeX(n);
        const y = nodeY(n);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      return { minX, maxX, minY, maxY };
    }

    // Cooperative zone
    const cb = regionBounds(coopNodes);
    const cPadding = 35;
    svg.appendChild(
      rc.ellipse(
        (cb.minX + cb.maxX) / 2,
        (cb.minY + cb.maxY) / 2,
        cb.maxX - cb.minX + cPadding * 2,
        cb.maxY - cb.minY + cPadding * 2,
        {
          seed: 4001,
          roughness: 1.5,
          stroke: COLORS.cooperative + '44',
          strokeWidth: 1.5,
          fill: COLORS.cooperative + '10',
          fillStyle: 'solid',
        }
      )
    );

    // Non-cooperative zone
    const nb = regionBounds(nonCoopNodes);
    svg.appendChild(
      rc.ellipse(
        (nb.minX + nb.maxX) / 2,
        (nb.minY + nb.maxY) / 2,
        nb.maxX - nb.minX + cPadding * 2,
        nb.maxY - nb.minY + cPadding * 2,
        {
          seed: 4002,
          roughness: 1.5,
          stroke: COLORS.defecting + '44',
          strokeWidth: 1.5,
          fill: COLORS.defecting + '10',
          fillStyle: 'solid',
        }
      )
    );

    // Region labels
    const addLabel = (text: string, x: number, y: number, color: string) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      el.setAttribute('x', String(x));
      el.setAttribute('y', String(y));
      el.setAttribute('text-anchor', 'middle');
      el.setAttribute('font-size', '11');
      el.setAttribute('fill', color);
      el.setAttribute('font-weight', '600');
      el.setAttribute('font-family', 'inherit');
      el.textContent = text;
      svg.appendChild(el);
    };

    addLabel('cooperative', (cb.minX + cb.maxX) / 2, cb.minY - cPadding + 5, COLORS.cooperative);
    addLabel('non-cooperative', (nb.minX + nb.maxX) / 2, nb.minY - cPadding + 5, COLORS.defecting);

    // Draw edges
    for (const edge of SOCIETY_EDGES) {
      const sn = SOCIETY_NODES.find((n) => n.id === edge.source);
      const tn = SOCIETY_NODES.find((n) => n.id === edge.target);
      if (!sn || !tn) continue;

      // Cross-region edges are faint and dashed
      const sameRegion =
        (COOPERATIVE_REGION.has(sn.id) && COOPERATIVE_REGION.has(tn.id)) ||
        (NON_COOPERATIVE_REGION.has(sn.id) && NON_COOPERATIVE_REGION.has(tn.id));

      svg.appendChild(
        rc.line(nodeX(sn), nodeY(sn), nodeX(tn), nodeY(tn), {
          seed: edge.seed,
          roughness: 0.8,
          stroke: sameRegion ? COLORS.edgeNeutral : '#00000012',
          strokeWidth: sameRegion ? 1 : 0.8,
          strokeLineDash: sameRegion ? undefined : [4, 4],
        })
      );
    }

    // Draw nodes
    for (const node of SOCIETY_NODES) {
      const x = nodeX(node);
      const y = nodeY(node);
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
