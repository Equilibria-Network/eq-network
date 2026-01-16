// src/components/products/ProductsHero.tsx
import React from 'react';
import { productsContent } from '@content/products';
import styles from './ProductsHero.module.css';

export default function ProductsHero() {
  const { hero } = productsContent;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
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
