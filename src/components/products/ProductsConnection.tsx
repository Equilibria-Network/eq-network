// src/components/products/ProductsConnection.tsx
import React from 'react';
import { productsContent } from '@content/products';
import styles from './ProductsConnection.module.css';

export default function ProductsConnection() {
  const { connection } = productsContent;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{connection.title}</h2>
        <p className={styles.description}>{connection.description}</p>
      </div>
    </section>
  );
}
