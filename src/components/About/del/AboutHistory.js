// src/components/About/AboutHistory.js
import React from 'react';
import styles from './AboutHistory.module.css';

export default function AboutHistory() {
  const timeline = [
    {
      year: "2021",
      title: "Origins",
      description: "Equilibria Network began as an informal research collective focused on applying complex systems thinking to AI alignment challenges."
    },
    {
      year: "2022",
      title: "Foundation",
      description: "Formally established as a research organization with initial funding to pursue work on mathematical frameworks for collective intelligence."
    },
    {
      year: "2023",
      title: "Research Expansion",
      description: "Expanded our team and launched our first major research streams in coordination mechanisms and morphological computing."
    },
    {
      year: "2024",
      title: "Theory to Practice",
      description: "Developed simulation frameworks to test governance mechanisms, and began collaborations with policy organizations and industry partners."
    },
    {
      year: "2025",
      title: "Current Focus",
      description: "Now focusing on translating theoretical insights into practical governance mechanisms for emerging AI systems, while continuing to develop our core mathematical frameworks."
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Our History</h2>
        <p className={styles.sectionDescription}>
          The evolving story of Equilibria Network
        </p>
        
        <div className={styles.timeline}>
          {timeline.map((event, index) => (
            <div key={index} className={styles.timelineItem}>
              <div className={styles.timelineYear}>{event.year}</div>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}>{event.title}</h3>
                <p className={styles.timelineDescription}>{event.description}</p>
              </div>
            </div>
          ))}
          
          <div className={styles.timelineLine}></div>
        </div>
      </div>
    </section>
  );
}
