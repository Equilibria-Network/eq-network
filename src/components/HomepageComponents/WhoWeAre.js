// src/components/HomepageComponents/WhoWeAre.js
import React from 'react';
import styles from './WhoWeAre.module.css';

export default function WhoWeAre() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.splitLayout}>
          <div className={styles.largeTitle}>
            <div className={styles.card}>
              <h2>Who We Are</h2>
            </div>
          </div>
          <div className={styles.description}>
            <div className={styles.card}>
              <p>
                We are a diverse group of researchers, engineers, and practitioners 
                working at the intersection of human coordination and artificial intelligence. 
                Our team brings together expertise from complex systems, social science, 
                machine learning, and organizational design.
              </p>
              <p>
                We believe that the future of human-AI coordination requires both technical 
                innovation and deep understanding of human systems. Our interdisciplinary 
                approach allows us to tackle these challenges from multiple angles, 
                developing solutions that are both technically sound and socially aware.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
