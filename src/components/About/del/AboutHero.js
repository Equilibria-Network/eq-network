// src/components/About/AboutHero.js
import React from 'react';
import styles from './AboutHero.module.css';

export default function AboutHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>About Equilibria Network</h1>
          <p className={styles.subtitle}>
            Building mathematical frameworks for computational coordination and collective intelligence in the age of AI.
          </p>
        </div>
      </div>
    </section>
  );
}
