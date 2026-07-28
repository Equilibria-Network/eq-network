// src/components/products/ProductsCoordination.tsx
import React from 'react';
import { productsContent } from '@content/products';
import styles from './ProductsCoordination.module.css';

export default function ProductsCoordination() {
  const { coordination } = productsContent;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Left: Image */}
          <div className={styles.imageColumn}>
            <img
              src={coordination.image}
              alt={coordination.title}
              className={styles.productImage}
            />
          </div>

          {/* Right: Text Content */}
          <div className={styles.textColumn}>
            <h2 className={styles.title}>{coordination.title}</h2>
            <p className={styles.tagline}>{coordination.tagline}</p>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>The problem:</h3>
              <p className={styles.subsectionText}>{coordination.sections.problem}</p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>What we're building:</h3>
              <p className={styles.subsectionText}>{coordination.sections.building}</p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>What it unlocks:</h3>
              <p className={styles.subsectionText}>{coordination.sections.unlocks}</p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Where we are:</h3>
              <p className={styles.subsectionText}>{coordination.sections.status}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
