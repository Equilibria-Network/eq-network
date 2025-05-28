// src/components/Research/ResearchAreaSection.js
import React from 'react';
// Using named import to match your existing export pattern
import { SimpleResearchCard } from './';
import styles from './ResearchAreaSection.module.css';

export default function ResearchAreaSection({ 
  areaName, 
  papers, 
  description, 
  areaColor 
}) {
  if (!papers || papers.length === 0) return null;

  return (
    <section 
      className={styles.researchArea}
      style={{ 
        '--area-color': areaColor, 
        '--area-color-alpha': `${areaColor}20` 
      }}
    >
      {/* Area Header */}
      <div className={styles.areaHeader}>
        <div className={styles.areaIndicator} />
        <div className={styles.areaContent}>
          <h2 className={styles.areaTitle}>
            {areaName}
          </h2>
          <p className={styles.areaDescription}>
            {description}
          </p>
        </div>
        <div className={styles.projectCount}>
          {papers.length} project{papers.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Papers Grid */}
      <div className={`${styles.papersGrid} ${papers.length === 1 ? styles.papersGridSingle : styles.papersGridMultiple}`}>
        {papers.map((paper) => (
          <div key={paper.id}>
            <SimpleResearchCard paperId={paper.id} />
          </div>
        ))}
      </div>
    </section>
  );
}
