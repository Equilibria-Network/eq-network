// src/components/research/CardModal.tsx
// Full-screen overlay showing card details when clicked.

import React from 'react';
import { CARDS } from './graphData';
import styles from './CardModal.module.css';

interface Props {
  cardId: string;
  onClose: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  early: 'Early',
  planned: 'Planned',
  future: 'Future',
};

const COL_LABELS = ['Foundations', 'Construction', 'Simulation', 'Validation'];

const PAPER_STATUS_COLORS: Record<string, string> = {
  published: '#003B7E',
  active: '#0055C4',
  wip: '#4AB3F4',
  draft: '#4AB3F4',
  concept: '#999',
};

const PAPER_STATUS_LABELS: Record<string, string> = {
  published: 'published',
  active: 'in progress',
  wip: 'work in progress',
  draft: 'work in progress',
  concept: 'early concept',
};

export default function CardModal({ cardId, onClose }: Props) {
  const card = CARDS.find((c) => c.id === cardId);
  if (!card) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          &times;
        </button>

        <div className={styles.badges}>
          <span className={styles.phaseBadge}>{COL_LABELS[card.col]}</span>
          <span className={`${styles.statusBadge} ${styles[card.status]}`}>
            {STATUS_LABELS[card.status]}
          </span>
        </div>

        <h2 className={styles.title}>{card.label}</h2>

        <div className={styles.body}>
          {card.fullDescription.split('\n\n').map((paragraph, i) => (
            <p key={i} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        {card.papers && card.papers.length > 0 && (
          <div className={styles.papers}>
            <h3 className={styles.papersHeading}>Working Notes & Early Explorations</h3>
            {card.papers.map((paper, i) => (
              <div key={i} className={styles.paperRow}>
                {paper.status && (
                  <span
                    className={styles.paperDot}
                    style={{ background: PAPER_STATUS_COLORS[paper.status] || '#ccc' }}
                  />
                )}
                <span className={styles.paperTitle}>
                  {paper.pdf ? (
                    <a href={paper.pdf} target="_blank" rel="noopener noreferrer">
                      {paper.title}
                    </a>
                  ) : paper.link ? (
                    <a href={paper.link} target="_blank" rel="noopener noreferrer">
                      {paper.title}
                    </a>
                  ) : (
                    paper.title
                  )}
                </span>
                {paper.status && (
                  <span
                    className={styles.paperStatus}
                    style={{ color: PAPER_STATUS_COLORS[paper.status] || '#999' }}
                  >
                    {PAPER_STATUS_LABELS[paper.status] || paper.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
