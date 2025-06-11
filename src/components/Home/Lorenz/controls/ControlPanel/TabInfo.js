// src/components/Home/Lorenz/controls/ControlPanel/TabInfo.js
/**
 * Information tab content for the Lorenz attractor control panel.
 * 
 * This component renders educational information about the Lorenz system
 * and its significance in understanding complex systems and emergent behaviors.
 * 
 * Responsibilities:
 * - Display information about the Lorenz attractor
 * - Adapt content based on visualization type
 * 
 * Dependencies:
 * - Receives visualization type from parent
 */

import React from 'react';
import styles from './ControlPanel.module.css';

const TabInfo = ({ visualizationType = 'butterfly-effect' }) => {
  // Render different content based on visualization type
  switch (visualizationType) {
    case 'butterfly-effect':
      return (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>The Butterfly Effect</div>
            <p className={styles.description}>
              Two trajectories with nearly identical initial conditions (difference of 0.000001) 
              diverge exponentially over time. This demonstrates sensitive dependence on initial 
              conditions - a hallmark of chaotic systems.
            </p>
          </div>
          
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Exponential Divergence</div>
            <p className={styles.description}>
              Small differences compound over time. What starts as a microscopic separation 
              becomes dramatically different trajectories, making long-term prediction 
              fundamentally impossible despite perfect knowledge of the underlying equations.
            </p>
          </div>
          
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Universal Principle</div>
            <p className={styles.description}>
              This sensitivity appears across many complex systems - from weather patterns 
              to population dynamics to economic markets. Understanding these dependencies 
              is crucial for recognizing the limits of prediction and control.
            </p>
          </div>
        </div>
      );
      
    case 'ml-prediction':
      return (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Algorithm Comparison</div>
            <p className={styles.description}>
              Multiple prediction algorithms branch from the current point, each using 
              different mathematical approaches. Watch how they diverge and fail at different rates.
            </p>
          </div>
          
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Visual Legend</div>
            <div className={styles.algorithmList}>
              <div className={styles.algorithmItem}>
                <div className={styles.colorLine} style={{backgroundColor: '#dc3245'}}></div>
                <div className={styles.algorithmInfo}>
                  <strong>Linear (Red, Dashed)</strong> - Simple dx/dt extrapolation. Fails quickly as it cannot account for changing rates.
                </div>
              </div>
              <div className={styles.algorithmItem}>
                <div className={styles.colorLine} style={{backgroundColor: '#ff7e00'}}></div>
                <div className={styles.algorithmInfo}>
                  <strong>Euler (Orange, Dash-Dot)</strong> - Forward Euler method. Recalculates rates at each step for better accuracy.
                </div>
              </div>
              <div className={styles.algorithmItem}>
                <div className={styles.colorLine} style={{backgroundColor: '#28a745'}}></div>
                <div className={styles.algorithmInfo}>
                  <strong>RK4 (Green, Solid)</strong> - Fourth-order Runge-Kutta. Most mathematically accurate numerical integration.
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Mathematical Accuracy</div>
            <p className={styles.description}>
              Higher-order methods maintain accuracy longer, but all face fundamental limits 
              in chaotic systems. The Lyapunov exponent determines how quickly small errors 
              compound, creating an absolute ceiling on prediction horizons.
            </p>
          </div>
          
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Error Accumulation</div>
            <p className={styles.description}>
              Notice how prediction lines fade as they extend further - this represents 
              growing uncertainty. Even with perfect mathematical models, sensitive 
              dependence on initial conditions makes long-term prediction impossible.
            </p>
          </div>
        </div>
      );
    
    default:
      return (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>The Lorenz System</div>
            <p className={styles.description}>
              Three coupled differential equations describing atmospheric convection. 
              Despite their mathematical simplicity, they generate infinitely complex, 
              non-repeating behavior constrained to a finite region of phase space.
            </p>
          </div>
          
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Strange Attractor</div>
            <p className={styles.description}>
              The butterfly-shaped structure emerges from the system's dynamics without 
              being explicitly programmed. This strange attractor has fractal structure - 
              infinite detail at every scale of magnification.
            </p>
          </div>
          
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Bifurcation Point</div>
            <p className={styles.description}>
              When the parameter ρ exceeds 24.74, the system transitions from stable 
              fixed points to chaotic behavior. This bifurcation represents a 
              fundamental change in system dynamics at a precise mathematical threshold.
            </p>
          </div>
        </div>
      );
  }
};

export default TabInfo;
