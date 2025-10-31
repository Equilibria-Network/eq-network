// src/components/Home2/Hero.js
import React from 'react';
import styles from './Hero.module.css';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Import centralized content
import homeContent from '../../data/home.json';

export default function Hero() {
  const { hero } = homeContent;

  // Helper to wrap highlighted terms in spans
  const renderTextWithHighlights = (text, highlights = []) => {
    if (!highlights.length) return text;
    
    let result = text;
    highlights.forEach(highlight => {
      const regex = new RegExp(`\\b${highlight}\\b`, 'gi');
      result = result.replace(regex, `<span class="${styles.highlight}">${highlight}</span>`);
    });
    
    return { __html: result };
  };

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
              <p className={styles.tagline}>{hero.tagline}</p>
            </div>
            
            {/* Description Area */}
            <div className={styles.descriptionArea}>
              <p 
                className={styles.description}
                dangerouslySetInnerHTML={renderTextWithHighlights(hero.description, hero.highlights)}
              />
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
                  const LorenzAttractor = require('./Lorenz').default;
                  return <LorenzAttractor />;
                }}
              </BrowserOnly>
            </div>
          </div>
          
          {/* Mobile Bottom Section - Tagline + Description */}
          <div className={styles.bottomTextSection}>
            {/* Tagline Area */}
            <div className={styles.taglineArea}>
              <p className={styles.tagline}>{hero.tagline}</p>
            </div>
            
            {/* Description Area */}
            <div className={styles.descriptionArea}>
              <p 
                className={styles.description}
                dangerouslySetInnerHTML={renderTextWithHighlights(hero.description, hero.highlights)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
