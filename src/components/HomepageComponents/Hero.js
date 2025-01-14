// src/components/HomepageComponents/Hero.js
import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import NetworkBackground from './NetworkBackground';
import styles from './Hero.module.css';

export default function Hero() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <div className={styles.hero}>
      <NetworkBackground />
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Equilibria Network</h1>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
      </div>
    </div>
  );
}
