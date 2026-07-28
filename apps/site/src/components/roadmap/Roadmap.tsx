// src/components/roadmap/Roadmap.tsx
import React, { useState } from 'react';
import { roadmapPhases } from '@content/roadmap';
import RoadmapHero from './RoadmapHero';
import PhaseList from './PhaseList';
import PhaseOverview from './PhaseOverview';
// Rendered block is commented out below; kept pending the roadmap detailed-view
// decision (docs/tasks/task-0001-pristine-baseline.md). Remove with that decision.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import PhaseBody from './PhaseBody';
import ResearchGraph from '../research/ResearchGraph';
import styles from './Roadmap.module.css';

export default function Roadmap() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(1);

  const currentPhase = roadmapPhases.find((p) => p.id === selectedPhase);

  return (
    <div className={styles.roadmapWrapper}>
      <RoadmapHero />

      {/* Phase Navigation + Overview */}
      <section className={styles.mainContentSection}>
        <div className={styles.container}>
          <div className={styles.splitLayout}>
            <PhaseList selectedPhase={selectedPhase} onPhaseSelect={setSelectedPhase} />
            <main className={styles.detailsPanel}>
              {currentPhase && <PhaseOverview phase={currentPhase} />}
            </main>
          </div>
        </div>
      </section>

      {/* Tech Tree */}
      <ResearchGraph />

      {/* Detailed Research Areas & Publications — commented out for now */}
      {/* {currentPhase && (
        <section className={styles.mainContentSection}>
          <div className={styles.container}>
            <div className={styles.bodyPanel}>
              <PhaseBody phase={currentPhase} />
            </div>
          </div>
        </section>
      )} */}
    </div>
  );
}
