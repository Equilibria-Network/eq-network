// src/components/About/AboutValues.js
import React from 'react';
import styles from './AboutValues.module.css';
import { CircleSlash, GitMerge, Scale, Zap } from 'lucide-react';

export default function AboutValues() {
  const values = [
    {
      icon: <GitMerge size={40} />,
      title: "Interdisciplinary Synthesis",
      description: "We bring together ideas from complexity science, social choice theory, category theory, and other fields to create novel frameworks for addressing coordination problems."
    },
    {
      icon: <Scale size={40} />,
      title: "Rigorous Pluralism",
      description: "We value intellectual diversity while maintaining high standards of mathematical rigor, seeking to integrate multiple perspectives into coherent theoretical frameworks."
    },
    {
      icon: <Zap size={40} />,
      title: "Practical Impact",
      description: "Our work aims to bridge theory and practice, creating actionable insights that can be applied to real-world governance challenges in AI development and deployment."
    },
    {
      icon: <CircleSlash size={40} />,
      title: "Systems Thinking",
      description: "We recognize that emergent properties of complex systems often cannot be reduced to their component parts, requiring holistic approaches to safety and alignment."
    }
  ];

  return (
    <section className={`${styles.section} ${styles.valuesSection}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Our Values</h2>
        <p className={styles.sectionDescription}>
          The principles that guide our research and collaboration
        </p>
        
        <div className={styles.valuesGrid}>
          {values.map((value, index) => (
            <div key={index} className={styles.valueCard}>
              <div className={styles.valueIcon}>
                {value.icon}
              </div>
              <h3 className={styles.valueTitle}>{value.title}</h3>
              <p className={styles.valueDescription}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
