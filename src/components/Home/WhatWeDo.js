// src/components/HomepageComponents/WhatWeDo.js
import React from 'react';
import styles from './WhatWeDo.module.css';

export default function WhatWeDo() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.splitLayout}>
          <div className={styles.largeTitle}>
            <h2>What We Do</h2>
          </div>
          <div className={styles.description}>
            <p>
              We focus on developing frameworks and tools that enhance collective 
              intelligence and decision-making. Our work spans theoretical research 
              and practical applications, creating bridges between academic insights 
              and real-world implementation.
            </p>
            <p>
              Through our research stream, we explore novel approaches to human-AI 
              coordination and network dynamics. Our product stream translates these 
              insights into practical tools and methodologies that organizations 
              can use to improve their collective decision-making processes.
            </p>
            <div className={styles.capabilities}>
              <div className={styles.capability}>
                <h3>Research</h3>
                <ul>
                  <li>Network Analysis</li>
                  <li>Collective Intelligence</li>
                  <li>Decision Systems</li>
                </ul>
              </div>
              <div className={styles.capability}>
                <h3>Development</h3>
                <ul>
                  <li>Coordination Tools</li>
                  <li>Decision Frameworks</li>
                  <li>Integration Systems</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
