// src/components/HomepageComponents/WhoWeAre.js
import React from 'react';
import styles from './WorkWithUs.module.css';

export default function WorkWithUs() {
  return (
    <section className={`${styles.section} ${styles.blueSection} section-full-width`}>
      <div className={styles.container}>
        <div className={styles.splitLayout}>
          <div className={styles.largeTitle}>
            <div className={styles.card}>
              <h2>Work With Us</h2>
            </div>
          </div>
          <div className={styles.description}>
            <div className={styles.card}>
              <p>
Who we’re looking for:
We're building a community of collaborators who share our fascination with collective intelligence and its role in shaping safer AI systems. If you're excited about any of these areas, we'd love to connect:

              </p>


<ul>

<li> Interdisciplinary connections that bridge traditionally separate fields like computational biology, social choice theory, and AI alignment </li>

<li> Applied perspectives on how theoretical insights can address practical coordination challenges in AI governance and safety </li>

<li> Experimental approaches to testing coordination mechanisms in multi-agent systems, from simulation environments to real-world implementations </li>

<li> Mathematical frameworks for describing collective intelligence across different domains—whether you're versed in category theory, complex systems, or active inference </li>

</ul>




              <p>

Our work thrives on diverse viewpoints and complementary skills. Whether you're a researcher, practitioner, advisor, or simply someone with a passionate interest in these questions, there are meaningful ways to contribute to our mission of understanding and shaping the coordination systems that will determine our collective future.

              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

