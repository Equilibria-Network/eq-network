// src/components/about/AboutHero.tsx
import { aboutContent } from '@content/about';
import styles from './AboutHero.module.css';

export default function AboutHero() {
  const { hero } = aboutContent;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          {/* Desktop Layout: Two columns */}
          <div className={styles.leftColumn}>
            <h1 className={styles.title}>{hero.title}</h1>
            <p className={styles.subtitle}>{hero.leftText}</p>
          </div>

          <div className={styles.rightColumn}>
            <p className={styles.description}>{hero.rightText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
