// src/components/about/AboutPhilosophy.tsx
import { aboutContent } from '@content/about';
import styles from './AboutPhilosophy.module.css';

export default function AboutPhilosophy() {
  const { philosophy } = aboutContent;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>{philosophy.sectionTitle}</h2>
          <p className={styles.subtitle}>{philosophy.subtitle}</p>
        </div>

        <div className={styles.principlesGrid}>
          {philosophy.principles.map((principle, index) => (
            <div key={index} className={styles.principleItem}>
              {/* Large Icon */}
              <div className={styles.iconContainer}>
                <img
                  loading="lazy"
                  decoding="async"
                  src={principle.icon}
                  alt=""
                  className={styles.icon}
                />
              </div>

              {/* Text Content */}
              <div className={styles.textContent}>
                <h3 className={styles.principleTitle}>{principle.title}</h3>
                <p className={styles.principleText}>{principle.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
