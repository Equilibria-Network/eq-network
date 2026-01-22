// src/components/roadmap/PhaseList.tsx
import React from 'react';
import { roadmapPhases } from '@content/roadmap';
import styles from './PhaseList.module.css';

interface PhaseListProps {
  selectedPhase: number | null;
  onPhaseSelect: (phaseId: number) => void;
}

export default function PhaseList({ selectedPhase, onPhaseSelect }: PhaseListProps) {
  return (
    <aside className={styles.phaseSidebar}>
      <div className={styles.sidebarSticky}>
        {roadmapPhases.map((phase) => (
          <button
            key={phase.id}
            className={`${styles.phaseNavItem} ${selectedPhase === phase.id ? styles.phaseNavItemActive : ''}`}
            onClick={() => onPhaseSelect(phase.id)}
          >
            <div className={styles.phaseNavNumber}>{phase.id}</div>
            <div className={styles.phaseNavImage}>
              <img
                src={phase.researcher.image}
                alt={phase.researcher.fullName}
                className={styles.navPortrait}
              />
            </div>
            <div className={styles.phaseNavText}>
              <div className={styles.navPhaseName}>{phase.researcher.lastName}</div>
              <div className={styles.navResearcherName}>{phase.name}</div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
