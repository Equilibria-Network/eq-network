// src/components/About/AboutMission.js
import React from 'react';
import styles from './AboutMission.module.css';

export default function AboutMission() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          
          <div className={styles.missionStatement}>
            <div className={styles.missionCard}>
              <p className={styles.lead}>
                Equilibria Network develops mathematical frameworks that address how AI systems transform collective
                decision-making dynamics and power structures.
              </p>
              
              <p>
                We combine research in active inference, decentralized consensus mechanisms, and social choice theory
                to map intervention points that can shift inadequate equilibria toward more robust, sustainable systems 
                that benefit humanity.
              </p>
              
              <p>
                Our work is founded on the premise that many AI risks stem from the interaction of AI with other complex
                systems. We believe that system-level emergent risks need systems-level emergent safety properties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
