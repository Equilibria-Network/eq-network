// src/components/Research/ResearchOverviewStats.js
import React from 'react';
import styles from './ResearchOverviewStats.module.css';

export default function ResearchOverviewStats({ papersByArea, areaOrder, researchAreas }) {
  return (
    <div className={styles.overviewSection}>
      <h3 className={styles.overviewTitle}>
        Research Overview
      </h3>
      <div className={styles.statsGrid}>
        {areaOrder.map((areaName) => {
          const papers = papersByArea[areaName] || [];
          const areaColor = researchAreas[areaName];
          
          return (
            <div 
              key={areaName} 
              className={styles.statCard}
              style={{ 
                '--area-color': areaColor, 
                '--area-color-alpha': `${areaColor}20` 
              }}
            >
              <div className={styles.statNumber}>
                {papers.length}
              </div>
              <div className={styles.statLabel}>
                {areaName}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
