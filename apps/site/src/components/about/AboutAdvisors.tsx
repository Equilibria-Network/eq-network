// src/components/about/AboutAdvisors.tsx
import { advisors } from '@content/about';
import styles from './AboutAdvisors.module.css';

export default function AboutAdvisors() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Advisors</h2>
          <p className={styles.subtitle}>Expert guidance from across disciplines</p>
        </div>

        <div className={styles.advisorsGrid}>
          {advisors.map((advisor) => {
            const clickable = Boolean(advisor.website && advisor.website !== 'TBD');
            const cardInner = (
              <div className={styles.card}>
                <div className={styles.imageContainer}>
                  <img
                    loading="lazy"
                    decoding="async"
                    src={advisor.image}
                    alt={advisor.name}
                    className={styles.advisorImage}
                  />
                </div>

                <div className={styles.content}>
                  <h3 className={styles.advisorName}>{advisor.name}</h3>
                  <p className={styles.advisorAffiliation}>{advisor.affiliation}</p>
                  {advisor.bio && <p className={styles.advisorBio}>{advisor.bio}</p>}
                  {clickable && <p className={styles.clickHint}>Click to visit profile</p>}
                </div>
              </div>
            );

            return clickable ? (
              <a
                key={advisor.id}
                className={`${styles.cardWrapper} ${styles.clickable}`}
                href={advisor.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {cardInner}
              </a>
            ) : (
              <div key={advisor.id} className={styles.cardWrapper}>
                {cardInner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
