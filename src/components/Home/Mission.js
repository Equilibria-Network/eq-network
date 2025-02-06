// src/components/HomepageComponents/Mission.js
import React from 'react';
import styles from './Mission.module.css';

export default function Mission() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.missionContent}>
          <div className={styles.missionText}>
            <div className={styles.logoContainer}>
              <img 
                src="img/logo_text.svg" 
                alt="Equilibria Network"
                className={styles.mainLogo}
              />
            </div>
            <p>
              The future of decision-making lies in the intersection of human and artificial intelligence. We're witnessing a rapid transformation as organizations increasingly integrate AI into their workflows and entering a world where small numbers of humans oversee largescale semi-autonomous multi-agent systems.
            </p>
            <p>
              Our mission is to foster resilience, agency, and positive-sum collaboration in hybrid human-AI systems, harnessing diverse intelligences for better decisions under uncertainty.
            </p>
          </div>
          <div className={styles.logoWrapper}>
            <div className={styles.butterflyLogoContainer}>
              <img 
                //src="/Logo Files/SVG Vector/svg-02.svg" 
                src="img/logo_icon.svg" 
                alt="Equilibria Network Butterfly Logo"
                className={styles.butterflyLogo}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
