// src/components/Blog/BlogHeader.js
import React from 'react';
import styles from './BlogHeader.module.css';

export default function BlogHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Equilibria Network Blog</h1>
          <p className={styles.subtitle}>
            Insights on collective intelligence, AI governance, and complex systems
          </p>
        </div>
      </div>
    </div>
  );
}
