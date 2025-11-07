// src/components/Roadmap/RoadmapCards.js
import React, { useState, useEffect } from 'react';
import styles from './RoadmapCards.module.css';

export default function RoadmapCards({ selectedPhase, onPhaseSelect }) {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load all phase files
    const loadPhases = async () => {
      try {
        const phase1 = await import('../../data/Roadmap/phase-1.json');
        const phase2 = await import('../../data/Roadmap/phase-2.json');
        const phase3 = await import('../../data/Roadmap/phase-3.json');
        const phase4 = await import('../../data/Roadmap/phase-4.json');
        const phase5 = await import('../../data/Roadmap/phase-5.json');
        
        setPhases([
          phase1.default,
          phase2.default,
          phase3.default,
          phase4.default,
          phase5.default
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading phase data:', error);
        setLoading(false);
      }
    };

    loadPhases();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Page Title */}
        <div className={styles.header}>
          <h1 className={styles.title}>Roadmap</h1>
        </div>

        {/* Phase Cards */}
        <div className={styles.cardsWrapper}>
          {phases.map((phase) => (
            <div 
              key={phase.id} 
              className={`${styles.card} ${selectedPhase === phase.id ? styles.cardActive : ''}`}
              onClick={() => onPhaseSelect(phase.id)}
            >
              <div className={styles.cardContent}>
                {/* Phase Number Badge */}
                <div className={styles.phaseNumber}>{phase.id}</div>
                
                {/* Portrait Image - Monochrome */}
                <div className={styles.imageContainer}>
                  <img 
                    src={phase.researcher.image} 
                    alt={phase.researcher.fullName}
                    className={styles.portrait}
                  />
                </div>
                
                {/* Researcher Name - Primary */}
                <div className={styles.researcherName}>
                  {phase.researcher.lastName}
                </div>
                
                {/* Phase Name - Secondary/Muted */}
                <div className={styles.phaseName}>
                  {phase.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
