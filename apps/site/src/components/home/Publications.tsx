// src/components/home/Publications.tsx
import React from 'react';
import { homeContent } from '@content/home';
import styles from './Publications.module.css';

export default function Publications() {
  const { publications } = homeContent;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{publications.sectionTitle}</h2>
          <p className={styles.description}>{publications.sectionDescription}</p>
        </div>

        {/* Publications Grid */}
        <div className={styles.publicationsGrid}>
          {publications.publications.map((pub) => (
            <a
              key={pub.id}
              href={pub.primaryLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <div className={styles.cardContent}>
                {pub.image && (
                  <div className={styles.imageContainer}>
                    <img
                      loading="lazy"
                      decoding="async"
                      src={pub.image}
                      alt={pub.title}
                      className={styles.cardImage}
                    />
                  </div>
                )}
                <div className={styles.textContent}>
                  <h3 className={styles.cardTitle}>{pub.title}</h3>
                  <p className={styles.cardType}>{pub.type}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
