// src/components/lab/LabHero.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';
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
        <a href="#scenarios" className={styles.scrollCta}>
          {hero.scrollCtaLabel}
          <ChevronDown size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
