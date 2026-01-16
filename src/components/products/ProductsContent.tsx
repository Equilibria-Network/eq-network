// src/components/products/ProductsContent.tsx
import React from 'react';
import { productsContent } from '@content/products';
import styles from './ProductsContent.module.css';

export default function ProductsContent() {
  const { hero, sections } = productsContent;

  return (
    <>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>{hero.title}</h1>
          <p className={styles.heroDescription}>{hero.description}</p>
        </div>
      </section>

      {/* Sections */}
      <section className={styles.sectionsWrapper}>
        <div className={styles.container}>
          {sections.map((section, index) => (
            <div key={index} className={styles.sectionItem}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <div className={styles.contentText}>
                {section.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
