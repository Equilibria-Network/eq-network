// src/components/About/AboutHero.js
import React from 'react';
import styles from './AboutHero.module.css';

// Import centralized content
import aboutContent from '../../data/About/content.json';

export default function AboutHero() {
  const { hero } = aboutContent;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          {/* Left Section - Title + Subtitle - Desktop Only */}
          <div className={styles.leftSection}>
            <div className={styles.titleArea}>
              <h1 className={styles.title}>{hero.title}</h1>
            </div>
            
            <div className={styles.subtitleArea}>
              <p className={styles.subtitle}>{hero.leftText}</p>
            </div>
          </div>
          
          {/* Mobile Top Section - Title Only */}
          <div className={styles.topTextSection}>
            <div className={styles.titleArea}>
              <h1 className={styles.title}>{hero.title}</h1>
            </div>
          </div>
          
          {/* Right Section - Extended Description */}
          <div className={styles.rightSection}>
            <div className={styles.rightTextContainer}>
              <p className={styles.rightText}>{hero.rightText}</p>
            </div>
          </div>
          
          {/* Mobile Bottom Section - Both Text Blocks */}
          <div className={styles.bottomTextSection}>
            <div className={styles.subtitleArea}>
              <p className={styles.subtitle}>{hero.leftText}</p>
            </div>
            
            <div className={styles.textArea}>
              <p className={styles.text}>{hero.rightText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
