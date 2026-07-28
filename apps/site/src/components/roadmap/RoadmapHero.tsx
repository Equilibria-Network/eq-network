// src/components/roadmap/RoadmapHero.tsx
import { roadmapOverview } from '@content/roadmap';
import styles from './RoadmapHero.module.css';

export default function RoadmapHero() {
  return (
    <section className={styles.headerSection}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.leftColumn}>
            <h1 className={styles.mainTitle}>{roadmapOverview.ui.heroTitle}</h1>
            <p className={styles.tagline}>{roadmapOverview.tagline}</p>
          </div>
          <div className={styles.rightColumn}>
            <p className={styles.description}>{roadmapOverview.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
