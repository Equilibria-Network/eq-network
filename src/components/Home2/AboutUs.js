// src/components/Home2/AboutUs.js
import React from 'react';
import styles from './AboutUs.module.css';

export default function AboutUs() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.aboutContent}>
          {/* About Us content goes here */}
          <h2>About Us Section</h2>
          <p>This is where the about us content will go.</p>
        </div>
      </div>
    </section>
  );
}
