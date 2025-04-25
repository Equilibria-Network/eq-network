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
Equilibria Network is an interdisciplinary research organization focused on problems of destabilizing and emergent dynamics in complex system, and the problem of multi agent verifiable commit and trust mechanisms.

              </p>
              <p>

True to our interdisciplinary nature, we are a team of researchers from diverse backgrounds including complexity science, computational biology, systems theory and AI safety.

              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
