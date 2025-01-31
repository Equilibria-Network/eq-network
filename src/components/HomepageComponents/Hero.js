// src/components/HomepageComponents/Hero.js
import React from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <img 
          src="img/logo_text.svg" 
          alt="Equilibria Network"
          className={styles.logo}
        />
      </div>
    </section>
  );
}
