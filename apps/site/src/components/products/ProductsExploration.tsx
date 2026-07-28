// src/components/products/ProductsExploration.tsx
import React from 'react';
import { productsContent } from '@content/products';
import styles from './ProductsExploration.module.css';

export default function ProductsExploration() {
  const { exploration } = productsContent;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Left: Image */}
          <div className={styles.imageColumn}>
            <img 
              src={exploration.image} 
              alt={exploration.title}
              className={styles.productImage}
            />
          </div>

          {/* Right: Text Content */}
          <div className={styles.textColumn}>
            <h2 className={styles.title}>{exploration.title}</h2>
            <p className={styles.tagline}>{exploration.tagline}</p>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>The problem:</h3>
              <p className={styles.subsectionText}>{exploration.sections.problem}</p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>What we're building:</h3>
              <p className={styles.subsectionText}>{exploration.sections.building}</p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>What it unlocks:</h3>
              <p className={styles.subsectionText}>{exploration.sections.unlocks}</p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Where we are:</h3>
              <p className={styles.subsectionText}>{exploration.sections.status}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
