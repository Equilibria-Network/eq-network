// src/components/roadmap/Roadmap.tsx
import React, { useState } from 'react';
import { roadmapPhases } from '@content/roadmap';
import RoadmapHero from './RoadmapHero';
import PhaseList from './PhaseList';
import PhaseDetails from './PhaseDetails';
import styles from './Roadmap.module.css';

export default function Roadmap() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(1);

  const currentPhase = roadmapPhases.find(p => p.id === selectedPhase);

  return (
    <div className={styles.roadmapWrapper}>
      <RoadmapHero />

      {/* Side-by-Side Layout */}
      <section className={styles.mainContentSection}>
        <div className={styles.container}>
          <div className={styles.splitLayout}>
            {/* Left Sidebar - Phase Navigation */}
            <PhaseList 
              selectedPhase={selectedPhase}
              onPhaseSelect={setSelectedPhase}
            />

            {/* Right Panel - Phase Details */}
            <main className={styles.detailsPanel}>
              {currentPhase && <PhaseDetails phase={currentPhase} />}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
