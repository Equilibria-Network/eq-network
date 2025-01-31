// src/components/HomepageComponents/Hero.js
import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './Hero.module.css';

export default function Hero() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <img 
          src="/Logo Files/PNG Transparent Files/png-01.png"
          alt="Equilibria Network"
          className={styles.heroLogo}
        />
      </div>
    </div>
  );
}