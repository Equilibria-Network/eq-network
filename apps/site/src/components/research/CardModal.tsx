// src/components/research/CardModal.tsx
// Full-screen overlay showing card details when clicked.

import { useEffect, useRef } from 'react';
import { CARDS } from './graphData';
import { researchContent } from '@content/research';
import styles from './CardModal.module.css';

interface Props {
  cardId: string;
  onClose: () => void;
}

const STATUS_LABELS: Record<string, string> = researchContent.ui.statusLabels;

const COL_LABELS = researchContent.ui.colLabels;

const PAPER_STATUS_COLORS: Record<string, string> = {
  published: '#003B7E',
  active: '#0055C4',
  wip: '#4AB3F4',
  draft: '#4AB3F4',
  concept: '#595959',
};

const PAPER_STATUS_LABELS: Record<string, string> = researchContent.ui.paperStatusLabels;

export default function CardModal({ cardId, onClose }: Props) {
  const card = CARDS.find((c) => c.id === cardId);
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = `card-modal-title-${cardId}`;

  // Dialog behaviour: close on Escape, trap focus inside the modal while open,
  // move focus in on open, and restore it to the trigger on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const modal = modalRef.current;
      if (!modal) return;
      const focusable = modal.querySelectorAll<HTMLElement>(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    modalRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  if (!card) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={modalRef}
      >
        <button
          className={styles.close}
          onClick={onClose}
          aria-label={researchContent.ui.closeLabel}
        >
          &times;
        </button>

        <div className={styles.badges}>
          <span className={styles.phaseBadge}>{COL_LABELS[card.col]}</span>
          <span className={`${styles.statusBadge} ${styles[card.status]}`}>
            {STATUS_LABELS[card.status]}
          </span>
        </div>

        <h2 id={titleId} className={styles.title}>
          {card.label}
        </h2>

        <div className={styles.body}>
          {card.fullDescription.split('\n\n').map((paragraph, i) => (
            <p key={i} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        {card.papers && card.papers.length > 0 && (
          <div className={styles.papers}>
            <h3 className={styles.papersHeading}>{researchContent.ui.workingNotesHeading}</h3>
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
                    style={{ color: PAPER_STATUS_COLORS[paper.status] || '#595959' }}
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
