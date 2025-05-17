// src/components/Home/Lorenz_2/controls/ControlPanel/TabInfo.js
/**
 * Information tab content for the Lorenz attractor control panel.
 * 
 * This component renders educational information about the Lorenz system,
 * its relevance to Equilibria Network's work, and its significance in
 * understanding complex systems and emergent behaviors.
 * 
 * Responsibilities:
 * - Display information about the Lorenz attractor
 * - Relate the visualization to Equilibria's mission
 * - Adapt content based on visualization type
 * 
 * Dependencies:
 * - Receives visualization type from parent
 */

import React from 'react';
import styles from './ControlPanel.module.css';

const TabInfo = ({ visualizationType = 'standard' }) => {
  // Render different content based on visualization type
  switch (visualizationType) {
    case 'butterfly-effect':
      return (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>The Butterfly Effect</div>
            <p className={styles.description}>
              You're seeing two trajectories (blue and green) with nearly identical 
              initial conditions (difference of only 0.000001). Watch how they follow similar paths
              at first but eventually diverge completely.
            </p>
          </div>
          
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Why This Matters for Equilibria</div>
            <p className={styles.description}>
              This demonstration illustrates a core challenge in complex systems governance: small 
              differences in initial conditions or minor interventions can lead to dramatically 
              different outcomes over time.
            </p>
            <p className={styles.description}>
              At Equilibria Network, we develop frameworks for understanding these sensitive 
              dependencies in AI governance systems, helping identify where small changes might 
              have outsized impacts on systemic outcomes.
            </p>
          </div>
          
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Implications for AI Governance</div>
            <p className={styles.description}>
              AI systems interact with other complex systems like markets, politics, and information 
              networks. Ensuring these hybrid systems remain stable and beneficial despite their chaotic 
              potential is central to our research on collective intelligence.
            </p>
          </div>
        </div>
      );
      
    case 'ml-prediction':
      return (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Prediction in Chaotic Systems</div>
            <p className={styles.description}>
              This visualization demonstrates both the power and limitations of prediction in 
              chaotic systems. The faint gray line shows an ML model's prediction of future states, 
              with accuracy diminishing over time.
            </p>
          </div>
          
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Connection to Our Research</div>
            <p className={styles.description}>
              At Equilibria Network, we explore the fundamental limits of prediction in complex multi-agent 
              systems. Understanding these boundaries is essential for designing realistic AI governance 
              frameworks that don't rely on unreasonable predictive capabilities.
            </p>
            <p className={styles.description}>
              Our work on social choice theory and decentralized consensus mechanisms accounts for the 
              inherent unpredictability in these systems while still providing robust governance approaches.
            </p>
          </div>
          
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Practical Implications</div>
            <p className={styles.description}>
              Rather than trying to predict exact trajectories far into the future, our research focuses 
              on identifying stable equilibria and intervention points that can maintain desirable 
              system properties despite uncertainty and chaos.
            </p>
          </div>
        </div>
      );
    
    case 'standard':
    default:
      return (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>The Lorenz Attractor & Complex Systems</div>
            <p className={styles.description}>
              The Lorenz attractor visualized here demonstrates how simple mathematical rules can 
              generate complex, unpredictable behavior—a key concept in chaos theory and complex 
              systems research.
            </p>
          </div>
          
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Connection to Equilibria Network</div>
            <p className={styles.description}>
              At Equilibria Network, we study complex systems and emergent behavior to understand 
              how AI systems interact with human societies. This visualization serves as a symbol 
              of our approach: analyzing the underlying patterns in seemingly chaotic interactions.
            </p>
            <p className={styles.description}>
              Just as the Lorenz system produces the butterfly-shaped attractor you see here, 
              AI governance systems exhibit emergent properties that can't be understood by 
              looking at individual components in isolation.
            </p>
          </div>
          
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Our Approach</div>
            <p className={styles.description}>
              We develop mathematical frameworks and agent-based models inspired by complex systems 
              science to map intervention points that can shift inadequate equilibria toward more 
              robust, sustainable systems that benefit humanity.
            </p>
            <p className={styles.description}>
              By understanding the attractors and phase transitions in governance systems, we can 
              design frameworks that maintain human agency and control even as AI capabilities grow.
            </p>
          </div>
        </div>
      );
  }
};

export default TabInfo;
