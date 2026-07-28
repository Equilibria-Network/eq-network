// src/components/roadmap/PhaseOverview.tsx
// The high-level phase content: researcher, tagline, description.

import React from 'react';
import type { RoadmapPhase } from '@content/roadmap/types';
import styles from './PhaseDetails.module.css';

interface Props {
  phase: RoadmapPhase;
}

export default function PhaseOverview({ phase }: Props) {
  const descriptionParagraphs = phase.details.description.split('\n\n');

  return (
    <div className={styles.detailsContent}>
      <div className={styles.imageSection}>
        <img
          src={phase.researcher.image}
          alt={phase.researcher.fullName}
          className={styles.largeImage}
          loading="lazy"
          decoding="async"
        />
        <p className={styles.researcherBio}>{phase.researcher.bio}</p>
      </div>

      <div className={styles.textSection}>
        <h2 className={styles.phaseTitle}>
          Phase {phase.id}: {phase.researcher.lastName}
        </h2>
        <p className={styles.phaseTagline}>{phase.details.tagline}</p>
        {descriptionParagraphs.map((paragraph, index) => (
          <p key={index} className={styles.phaseDescription}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
