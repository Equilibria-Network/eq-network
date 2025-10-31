// src/components/Home/Publications.js
import React from 'react';
import styles from './Publications.module.css';

// Import publications data
import publicationsData from '../../data/home-publications.json';

export default function Publications() {
  const { sectionTitle, sectionDescription, publications } = publicationsData;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{sectionTitle}</h2>
          <p className={styles.description}>{sectionDescription}</p>
        </div>

        {/* Publications Grid - Desktop: Grid, Mobile: Horizontal Scroll */}
        <div className={styles.publicationsWrapper}>
          <div className={styles.publicationsGrid}>
            {publications.map((pub) => (
              <a 
                key={pub.id} 
                href={pub.primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card}
                style={{
                  backgroundImage: pub.image ? `url(${pub.image})` : 'none',
                }}
              >
                {/* Overlay for readability */}
                <div className={styles.cardOverlay}>
                  {/* Title at Top */}
                  <h3 className={styles.cardTitle}>{pub.title}</h3>
                  
                  {/* Spacer grows to push type to bottom */}
                  <div className={styles.cardSpacer} />
                  
                  {/* Type as Plain Text at Bottom */}
                  <p className={styles.cardType}>{pub.type}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
