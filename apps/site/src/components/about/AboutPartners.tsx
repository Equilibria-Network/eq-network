// src/components/about/AboutPartners.tsx
import { partners } from '@content/about';
import styles from './AboutPartners.module.css';

export default function AboutPartners() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Partner Organizations</h2>
          <p className={styles.subtitle}>Collaborating to advance collective intelligence</p>
        </div>

        <div className={styles.partnersGrid}>
          {partners.map((partner) => (
            <a
              key={partner.id}
              className={styles.partnerCard}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.logoContainer}>
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className={styles.partnerLogo}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className={styles.partnerContent}>
                <h3 className={styles.partnerName}>{partner.name}</h3>
                <p className={styles.partnerDescription}>{partner.description}</p>
                <p className={styles.visitLink}>Visit website →</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
