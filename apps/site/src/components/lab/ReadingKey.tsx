// src/components/lab/ReadingKey.tsx
// Thin legend strip: teaches the animation grammar in ~5 seconds before the
// scenario sections use it. Static roughjs glyphs, drawn once per mount.
import { useEffect, useRef } from 'react';
import rough from 'roughjs';
import styles from './ReadingKey.module.css';
import { labContent, type ReadingKeyGlyph } from '@content/lab';
import { INK, SPREAD_RED } from './visuals/types';

const GLYPH_WIDTH = 44;
const GLYPH_HEIGHT = 26;

function drawKeyGlyph(svg: SVGSVGElement, glyph: ReadingKeyGlyph): void {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const rc = rough.svg(svg);
  const cx = GLYPH_WIDTH / 2;
  const cy = GLYPH_HEIGHT / 2;

  switch (glyph) {
    case 'agent':
      svg.appendChild(
        rc.circle(cx, cy, 17, { stroke: INK, strokeWidth: 1.4, roughness: 0.8, seed: 11 })
      );
      break;
    case 'ai':
      svg.appendChild(
        rc.rectangle(cx - 6, cy - 6, 12, 12, {
          stroke: INK,
          strokeWidth: 1.4,
          roughness: 0.8,
          seed: 12,
        })
      );
      break;
    case 'edge': {
      svg.appendChild(
        rc.line(4, cy, GLYPH_WIDTH - 4, cy, {
          stroke: '#9aa2ab',
          strokeWidth: 1.2,
          strokeLineDash: [4, 4],
          roughness: 0.6,
          seed: 13,
        })
      );
      break;
    }
    case 'spread':
      svg.appendChild(
        rc.circle(cx, cy, 18, {
          stroke: SPREAD_RED,
          strokeWidth: 1.4,
          fill: SPREAD_RED,
          fillStyle: 'solid',
          roughness: 0.8,
          seed: 15,
        })
      );
      break;
  }
}

function KeyGlyph({ glyph }: { glyph: ReadingKeyGlyph }) {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (svgRef.current) drawKeyGlyph(svgRef.current, glyph);
  }, [glyph]);
  return (
    <svg
      ref={svgRef}
      width={GLYPH_WIDTH}
      height={GLYPH_HEIGHT}
      className={styles.glyph}
      aria-hidden="true"
    />
  );
}

export default function ReadingKey() {
  const { title, items } = labContent.readingKey;
  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.container}>
        <span className={styles.title}>{title}</span>
        <ul className={styles.items}>
          {items.map((item) => (
            <li key={item.glyph} className={styles.item}>
              <KeyGlyph glyph={item.glyph} />
              <span className={styles.label}>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
