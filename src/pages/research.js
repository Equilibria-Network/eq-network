// src/pages/research.js
import React from 'react';
import Layout from '@theme/Layout';
import { ResearchAreaSection } from '../components/Research';
import researchData from '../data/research.json';
import styles from './research.module.css';

export default function Research() {
  // Group papers by research area
  const papersByArea = researchData.papers.reduce((acc, paper) => {
    if (!acc[paper.researchArea]) {
      acc[paper.researchArea] = [];
    }
    acc[paper.researchArea].push(paper);
    return acc;
  }, {});

  // Define area descriptions to help visitors understand each research stream
  const areaDescriptions = {
    "Mathematical Foundations": "Developing unified mathematical frameworks and theoretical foundations for understanding collective intelligence systems.",
    "Computational Experiments": "Empirical studies and simulations exploring how collective intelligence mechanisms perform under various conditions.",
    "Research Tools & Infrastructure": "Building the computational tools and platforms needed to study and implement collective intelligence systems.",
    "Applied Governance": "Practical applications of collective intelligence research to real-world governance and coordination challenges."
  };

  // Define area ordering for consistent presentation
  const areaOrder = [
    "Mathematical Foundations",
    "Computational Experiments", 
    "Research Tools & Infrastructure",
    "Applied Governance"
  ];

  // Use consistent theme colors instead of the research area colors from JSON
  const getAreaColor = (areaName) => {
    // Use variations of your primary blue theme
    switch (areaName) {
      case "Mathematical Foundations":
        return 'var(--ifm-color-primary)'; // Main blue
      case "Computational Experiments": 
        return 'var(--ifm-color-primary-dark)'; // Darker blue
      case "Research Tools & Infrastructure":
        return 'var(--ifm-color-primary-darker)'; // Even darker blue
      case "Applied Governance":
        return 'var(--ifm-color-primary-darkest)'; // Darkest blue
      default:
        return 'var(--ifm-color-primary)';
    }
  };

  return (
    <Layout
      title="Research in Progress"
      description="Our ongoing research into mathematical frameworks for collective intelligence, AI governance, and complex systems coordination."
    >
      <div className="parallax-background" />
      
      <main className={styles.researchMain}>
        <div className={styles.container}>
          
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>
              Research in Progress
            </h1>
            <p className={styles.subtitle}>
              Our ongoing research into mathematical frameworks for collective intelligence, 
              AI governance, and complex systems coordination. Each paper represents a piece 
              of our broader mission to understand and design better equilibria.
            </p>
          </div>

          {/* Research Areas */}
          {areaOrder.map((areaName) => {
            const papers = papersByArea[areaName] || [];
            const areaColor = getAreaColor(areaName);
            
            return (
              <ResearchAreaSection
                key={areaName}
                areaName={areaName}
                papers={papers}
                description={areaDescriptions[areaName]}
                areaColor={areaColor}
              />
            );
          })}
        </div>
      </main>
    </Layout>
  );
}

