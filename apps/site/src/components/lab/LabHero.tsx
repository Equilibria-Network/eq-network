// src/components/lab/LabHero.tsx
import { ChevronDown, Play } from 'lucide-react';
import styles from './LabHero.module.css';
import type { LabContent } from '@content/lab';

interface LabHeroProps {
  hero: LabContent['hero'];
}

export default function LabHero({ hero }: LabHeroProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.question}>{hero.question}</h1>
        <span className={styles.badge}>{hero.badge}</span>
        <p className={styles.subline}>{hero.subline}</p>
        <p className={styles.kicker}>{hero.kicker}</p>
        <p className={styles.honesty}>{hero.honesty}</p>
        <div className={styles.ctaRow}>
          <a href={hero.playgroundCta.href} className={styles.playCta}>
            <Play size={16} aria-hidden="true" />
            {hero.playgroundCta.label}
          </a>
          <a href="#scenarios" className={styles.scrollCta}>
            {hero.scrollCtaLabel}
            <ChevronDown size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
