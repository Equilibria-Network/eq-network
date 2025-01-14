// src/components/HomepageComponents/Mission.js
import React from 'react';
import NetworkGraph from './NetworkGraph';
import styles from './Mission.module.css';

export default function Mission() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.missionContent}>
          <div className={styles.missionText}>
            <h2>Our Mission</h2>
            <p>
              At Equilibria Network, we're dedicated to advancing the frontier of human-AI coordination 
              through research and practical applications. We explore the intersections of network theory, 
              collective intelligence, and artificial intelligence to develop better ways for humans and 
              machines to work together.
            </p>
            <p>
              Our mission is to create and nurture projects that enhance collective decision-making 
              and knowledge sharing, leveraging both human wisdom and computational tools to address 
              increasingly complex challenges.
            </p>
          </div>
          <div className={styles.missionGraphWrapper}>
            <NetworkGraph />
          </div>
        </div>
      </div>
    </section>
  );
}
