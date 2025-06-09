// src/components/Home2/Hero.js
import React from 'react';
import styles from './Hero.module.css';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function Hero() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          {/* Left Section - Text Content - Desktop Only */}
          <div className={styles.leftSection}>
            {/* Logo Area */}
            <div className={styles.logoArea}>
              <img 
                src="/img/logo/logo_text_only.svg" 
                alt="Equilibria Network"
                className={styles.logo}
              />
            </div>
            
            {/* Tagline Area */}
            <div className={styles.taglineArea}>
              <p className={styles.tagline}>Modelling the impact of AI on civilization.</p>
            </div>
            
            {/* Description Area */}
            <div className={styles.descriptionArea}>
              <p className={styles.description}>
                We help decision makers test interventions before implementing them in the real world, 
                using large scale <span className={styles.highlight}>simulations</span> powered by rigorous <span className={styles.highlight}>mathematical foundations</span>.
              </p>
            </div>
          </div>
          
          {/* Mobile Top Section - Logo Only */}
          <div className={styles.topTextSection}>
            <div className={styles.logoArea}>
              <img 
                src="/img/logo/logo_text_only.svg" 
                alt="Equilibria Network"
                className={styles.logo}
              />
            </div>
          </div>
          
          {/* Right Section - D3 Animation - Edge to Edge */}
          <div className={styles.rightSection}>
            <div className={styles.animationContainer}>
              {/* Use BrowserOnly to ensure Lorenz attractor only renders in browser */}
              <BrowserOnly>
                {() => {
                  // Dynamically import the component only in browser environment
                  const LorenzAttractor = require('../Home/Lorenz').default;
                  return <LorenzAttractor />;
                }}
              </BrowserOnly>
            </div>
          </div>
          
          {/* Mobile Bottom Section - Tagline + Description */}
          <div className={styles.bottomTextSection}>
            {/* Tagline Area */}
            <div className={styles.taglineArea}>
              <p className={styles.tagline}>Modelling the impact of AI on civilization.</p>
            </div>
            
            {/* Description Area */}
            <div className={styles.descriptionArea}>
              <p className={styles.description}>
                We help decision makers test interventions before implementing them in the real world, 
                using large scale <span className={styles.highlight}>simulations</span> powered by rigorous <span className={styles.highlight}>mathematical foundations</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
