// src/components/HomepageComponents/WhoWeAre.js
import React from 'react';
import styles from './WhoWeAre.module.css';

export default function WhoWeAre() {
  return (
    <section className={`${styles.section} ${styles.blueSection} section-full-width`}>
      <div className={styles.container}>
        <div className={styles.splitLayout}>
          <div className={styles.largeTitle}>
            <div className={styles.card}>
              <h2>Who We Are</h2>
            </div>
          </div>
          <div className={styles.description}>
            <div className={styles.card}>
              <p>
                We're an interdisciplinary team of researchers and builders working to transform how organizations make decisions in synergistic human and AI systems.
              </p>
              <p>
                As a hybrid research organization, we focus on foundational inquiry in tandem with impactful, practical solutions.
              </p>
              <p>
                Our expertise spans complexity science, AI safety, and systems thinking, allowing us to bring important perspectives to the challenges of multi-agent systems and collective cognition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
