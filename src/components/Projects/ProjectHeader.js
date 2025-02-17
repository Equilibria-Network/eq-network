import React from 'react';
import styles from './ProjectHeader.module.css';

export default function ProjectHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.headerTitle}>
          Our Projects
        </h1>
        <p className={styles.headerSubtitle}>
          Exploring the frontiers of collective intelligence and decision-making systems
          through research and practical applications.
        </p>
      </div>
    </header>
  );
}
