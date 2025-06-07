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
            
            <div className={styles.textContent}>
              <h1 className={styles.claim}>
                Modelling the impact of AI on civilization.
              </h1>
              
              <p className={styles.description}>
                We help decision makers test interventions before implementing them in the real world, 
                using large scale simulations powered by rigorous mathematical foundations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
