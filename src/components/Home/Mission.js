// src/components/Home/Mission.js
import React from 'react';
import styles from './Mission.module.css';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function Mission() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.missionContent}>
          <div className={styles.attractorContainer}>
            {/* Use BrowserOnly to ensure Lorenz attractor only renders in browser */}
            <BrowserOnly>
              {() => {
                // Dynamically import the component only in browser environment
                const LorenzAttractor = require('./Lorenz').default;
                return <LorenzAttractor />;
              }}
            </BrowserOnly>
          </div>
          <div className={styles.contentRight}>
            <div className={styles.logoContainer}>
              <img 
                src="img/logo_text.svg" 
                alt="Equilibria Network"
                className={styles.mainLogo}
              />
            </div>
            <div className={styles.descriptionText}>
              <p>
                We are a hybrid research institute, developing mathematical frameworks that address how AI systems transform collective decision-making dynamics and power structures.
              </p>
              <p>
                We combine research in active inference, decentralized consensus mechanisms, and social choice theory to map intervention points that can shift inadequate equilibria toward more robust, sustainable systems that benefit humanity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
