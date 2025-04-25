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

Our work is founded on the premise that many AI risks stem the interaction of AI with other complex systems like our political, social and economic systems. This is different than the focus individual agent interactions, and single-agent misalignment. Sytem level emergent risks, also need systems level emergent safety properties. Our goal is to serve as a bridge between theoretical mathematical insights and practical governance applications.
</p>

            <p>

<b>Identifying core needs in technical AI governance:</b> We work on building a network of technical AI governance stakeholders to understand on-ground real-world complex system challenges. Understanding the needs of research, industry, and policy, helps us identify concrete problems where system level thinking is needed—ensuring our work addresses practical governance issues rather than theoretical abstractions.
            </p>

            <p>

<b>Building Simulation Frameworks:</b> We build agent-based models that allow members of out network to visualize how their proposed policies might play out in practice. These simulations provide intuitive ways to test governance approaches before implementation, revealing potential cascading effects and unexpected macro system level consequences that might not be obvious from multi agent simulations alone.

            </p>

            <p>

<b>Research Mathematical Foundations:</b> To power these simulations accurately, we're developing formal mathematical models that capture how information flows through networks of agents, how incentives shape behavior across systems, and how different coordination mechanisms respond under pressure. This theoretical work underpins our simulations and ensures they reflect real-world dynamics accurately.

            </p>



          </div>
        </div>
      </div>
    </section>
  );
}
