// src/components/research/ResearchGraph.tsx
// Two views: Overview (pipeline) and Detail (tech tree grid + SVG arrows).
// No React Flow — pure CSS Grid + SVG.

import React, { useState, useCallback, useRef, useLayoutEffect } from 'react';
import CardModal from './CardModal';
import { CARDS, ARROWS, HEADERS, PHASE_DESCRIPTIONS } from './graphData';
import { researchContent } from '@content/research';
import styles from './ResearchGraph.module.css';

interface ArrowPath {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  source: string;
  target: string;
}

export default function ResearchGraph() {
  const [view, setView] = useState<'overview' | 'detail'>('overview');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [arrowPaths, setArrowPaths] = useState<ArrowPath[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());

  const registerCard = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) cardRefs.current.set(id, el);
      else cardRefs.current.delete(id);
    },
    []
  );

  // Compute arrow positions from DOM
  useLayoutEffect(() => {
    if (view !== 'detail') return;

    const compute = () => {
      const container = containerRef.current;
      if (!container) return;
      const cr = container.getBoundingClientRect();

      const paths: ArrowPath[] = [];
      for (const arrow of ARROWS) {
        const sEl = cardRefs.current.get(arrow.source);
        const tEl = cardRefs.current.get(arrow.target);
        if (!sEl || !tEl) continue;
        const s = sEl.getBoundingClientRect();
        const t = tEl.getBoundingClientRect();

        paths.push({
          x1: s.right - cr.left,
          y1: s.top + s.height / 2 - cr.top,
          x2: t.left - cr.left,
          y2: t.top + t.height / 2 - cr.top,
          label: arrow.label,
          source: arrow.source,
          target: arrow.target,
        });
      }
      setArrowPaths(paths);
    };

    // Delay to let CSS grid settle
    const timer = setTimeout(compute, 50);
    const ro = new ResizeObserver(() => compute());
    if (containerRef.current) ro.observe(containerRef.current);
    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
  }, [view]);

  const isArrowHighlighted = useCallback(
    (a: ArrowPath) => hoveredCard === a.source || hoveredCard === a.target,
    [hoveredCard]
  );

  const cardsByCol = HEADERS.map((_, ci) => CARDS.filter((c) => c.col === ci));

  return (
    <div className={styles.wrapper}>
      {/* ─── View 1: Overview ─── */}
      {view === 'overview' && (
        <div className={styles.overview}>
          <p className={styles.hint}>{researchContent.ui.overviewHint}</p>
          <div className={styles.pipeline}>
            {HEADERS.map((header, i) => (
              <React.Fragment key={i}>
                <button className={styles.phaseBox} onClick={() => setView('detail')}>
                  <div className={styles.phaseBoxInner}>
                    <span className={styles.phaseNum}>{i + 1}</span>
                    <h3 className={styles.phaseTitle}>{header}</h3>
                    <p className={styles.phaseDesc}>{PHASE_DESCRIPTIONS[i]}</p>
                  </div>
                </button>
                {i < HEADERS.length - 1 && (
                  <div className={styles.pipelineArrow}>
                    <div className={styles.pipelineArrowRow}>
                      <span className={styles.pipelineArrowLine} />
                      <span className={styles.pipelineArrowHead} />
                    </div>
                    <span className={styles.pipelineArrowLabel}>
                      {researchContent.ui.pipelineConnectors[i]}
                    </span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* ─── View 2: Detail ─── */}
      {view === 'detail' && (
        <div className={styles.detail}>
          <div className={styles.detailTop}>
            <button className={styles.backBtn} onClick={() => setView('overview')}>
              {researchContent.ui.backButton}
            </button>
            <p className={styles.hint}>{researchContent.ui.detailHint}</p>
          </div>

          <div className={styles.grid} ref={containerRef}>
            {/* Column headers */}
            <div className={styles.colHeaders}>
              {HEADERS.map((h, i) => (
                <div key={i} className={styles.colHeader}>
                  {h}
                </div>
              ))}
            </div>

            {/* Cards grid */}
            <div className={styles.cardsGrid}>
              {cardsByCol.map((colCards, ci) => (
                <div key={ci} className={styles.column}>
                  {colCards.map((card) => (
                    <button
                      key={card.id}
                      ref={registerCard(card.id)}
                      className={`${styles.card} ${card.type === 'apply' ? styles.cardApply : ''} ${
                        hoveredCard && hoveredCard !== card.id ? styles.cardDimmed : ''
                      }`}
                      onClick={() => setSelectedCard(card.id)}
                      onMouseEnter={() => setHoveredCard(card.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className={styles.cardInner}>
                        <h4 className={styles.cardLabel}>{card.label}</h4>
                        <p className={styles.cardDesc}>{card.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* SVG arrow overlay */}
            <svg className={styles.arrowSvg}>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="6"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <path
                    d="M0,0 L8,3 L0,6"
                    fill="none"
                    stroke="var(--color-primary, #003B7E)"
                    strokeWidth="1.5"
                  />
                </marker>
                <marker
                  id="arrowhead-bright"
                  markerWidth="8"
                  markerHeight="6"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <path
                    d="M0,0 L8,3 L0,6"
                    fill="none"
                    stroke="var(--color-primary, #003B7E)"
                    strokeWidth="2"
                  />
                </marker>
              </defs>
              {arrowPaths.map((a) => {
                const highlighted = isArrowHighlighted(a);
                const anyHovered = hoveredCard !== null;
                const opacity = anyHovered ? (highlighted ? 0.6 : 0.06) : 0.2;
                return (
                  <g key={`${a.source}-${a.target}`}>
                    <line
                      x1={a.x1}
                      y1={a.y1}
                      x2={a.x2}
                      y2={a.y2}
                      stroke="var(--color-primary, #003B7E)"
                      strokeWidth={highlighted ? 2 : 1.5}
                      opacity={opacity}
                      markerEnd={highlighted ? 'url(#arrowhead-bright)' : 'url(#arrowhead)'}
                      style={{ transition: 'opacity 0.2s ease' }}
                    />
                    {highlighted && (
                      <text
                        x={(a.x1 + a.x2) / 2}
                        y={(a.y1 + a.y2) / 2 - 8}
                        textAnchor="middle"
                        fontSize={10}
                        fill="var(--color-primary, #003B7E)"
                        opacity={0.7}
                        fontStyle="italic"
                      >
                        {a.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {selectedCard && <CardModal cardId={selectedCard} onClose={() => setSelectedCard(null)} />}
    </div>
  );
}
