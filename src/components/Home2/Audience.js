// src/components/Home2/Audience.js
import React from 'react';
import styles from './Audience.module.css';

// Import centralized content
import homeContent from '../../data/home.json';

export default function Audience() {
  const { audience } = homeContent;
  const { title, audiences } = audience;

  return (
    <section className={`${styles.section} snap-section allow-overflow`}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>

        {/* Audience Cards */}
        <div className={styles.audienceGrid}>
          {audiences.map((audienceItem) => {
            return (
              <div key={audienceItem.id} className={styles.audienceCard}>
                {/* Card Image */}
                <div className={styles.imageContainer}>
                  <img 
                    src={audienceItem.image} 
                    alt={audienceItem.title}
                    className={styles.audienceImage}
                  />
                </div>

                {/* Card Content */}
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{audienceItem.title}</h3>
                  
                  <p className={styles.cardClaim}>{audienceItem.claim}</p>
                  
                  <div className={styles.cardExample}>
                    <h4 className={styles.exampleTitle}>Example</h4>
                    <p className={styles.exampleText}>{audienceItem.example}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
