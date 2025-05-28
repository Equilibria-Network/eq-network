// src/components/Research/ResearchHeader.js
import React from 'react';
import styles from './ResearchHeader.module.css';

export default function ResearchHeader() {
  return (
    <section className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Research in Progress</h1>
          <p className={styles.subtitle}>
            Our ongoing research into mathematical frameworks for collective intelligence, 
            AI governance, and complex systems coordination. Each paper represents a piece 
            of our broader mission to understand and design better equilibria.
          </p>

        </div>
      </div>
    </section>
  );
}
