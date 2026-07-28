// src/components/about/AboutAdvisors.tsx
import React from 'react';
import { advisors } from '@content/about';
import styles from './AboutAdvisors.module.css';

export default function AboutAdvisors() {
  const handleCardClick = (website?: string) => {
    if (website && website !== 'TBD') {
      window.open(website, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Advisors</h2>
          <p className={styles.subtitle}>Expert guidance from across disciplines</p>
        </div>

        <div className={styles.advisorsGrid}>
          {advisors.map((advisor) => (
            <div 
              key={advisor.id} 
              className={`${styles.cardWrapper} ${advisor.website && advisor.website !== 'TBD' ? styles.clickable : ''}`}
              onClick={() => handleCardClick(advisor.website)}
            >
              <div className={styles.card}>
                <div className={styles.imageContainer}>
                  <img 
                    src={advisor.image} 
                    alt={advisor.name}
                    className={styles.advisorImage}
                  />
                </div>
                
                <div className={styles.content}>
                  <h3 className={styles.advisorName}>{advisor.name}</h3>
                  <p className={styles.advisorAffiliation}>{advisor.affiliation}</p>
                  {advisor.bio && (
                    <p className={styles.advisorBio}>{advisor.bio}</p>
                  )}
                  {advisor.website && advisor.website !== 'TBD' && (
                    <p className={styles.clickHint}>Click to visit profile</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
