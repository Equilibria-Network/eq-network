// src/components/roadmap/Roadmap.tsx
import { useState } from 'react';
import { roadmapPhases } from '@content/roadmap';
import RoadmapHero from './RoadmapHero';
import PhaseList from './PhaseList';
import PhaseOverview from './PhaseOverview';
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
    </div>
  );
}
