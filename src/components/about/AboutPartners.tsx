// src/components/about/AboutPartners.tsx
import React from 'react';
import { partners } from '@content/about';
import styles from './AboutPartners.module.css';

export default function AboutPartners() {
  const handlePartnerClick = (website: string) => {
    window.open(website, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Partner Organizations</h2>
          <p className={styles.subtitle}>Collaborating to advance collective intelligence</p>
        </div>

        <div className={styles.partnersGrid}>
          {partners.map((partner) => (
            <div 
              key={partner.id} 
              className={styles.partnerCard}
              onClick={() => handlePartnerClick(partner.website)}
            >
              <div className={styles.logoContainer}>
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`}
                  className={styles.partnerLogo}
                />
              </div>
              
              <div className={styles.partnerContent}>
                <h3 className={styles.partnerName}>{partner.name}</h3>
                <p className={styles.partnerDescription}>{partner.description}</p>
                <p className={styles.visitLink}>Visit website →</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
