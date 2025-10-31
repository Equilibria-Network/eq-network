// src/components/About/AboutPhilosophy.js
import React from 'react';
import styles from './AboutPhilosophy.module.css';

// Import centralized content
import aboutContent from '../../data/About/content.json';

export default function AboutPhilosophy() {
  const { philosophy } = aboutContent;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Section Header with Subtitle */}
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>{philosophy.sectionTitle}</h2>
          <p className={styles.sectionSubtitle}>{philosophy.subtitle}</p>
        </div>

        {/* Philosophy Grid - Now vertical stack with horizontal items */}
        <div className={styles.principlesGrid}>
          {philosophy.principles.map((principle, index) => (
            <div key={index} className={styles.card}>
              {/* Icon - Left side, large */}
              {principle.icon && (
                <div className={styles.iconContainer}>
                  <img src={principle.icon} alt="" className={styles.icon} />
                </div>
              )}
              
              {/* Text Container - Right side with title on top, description below */}
              <div className={styles.textContainer}>
                <h3 className={styles.cardTitle}>{principle.title}</h3>
                <p className={styles.cardText}>{principle.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
