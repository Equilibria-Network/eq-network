// src/components/HomepageComponents/Focus.js
import React from 'react';
import styles from './Focus.module.css';

function StreamCard({ title, description, items }) {
  return (
    <div className={styles.streamCard}>
      <div className={styles.card}>
        <h3 className={styles.streamTitle}>{title}</h3>
        <p className={styles.streamDescription}>{description}</p>
        <div className={styles.streamItems}>
          {items.map((item, index) => (
            <div key={index} className={styles.streamItem}>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Focus() {
  const researchStream = {
    title: 'Research Stream',
    description: 'We study complex systems and collective intelligence to develop new frameworks for human-AI coordination.',
    items: [
      {
        title: 'Network Theory',
        description: 'Analyzing information flows and emergent behavior in complex networks'
      },
      {
        title: 'Collective Intelligence',
        description: 'Understanding how groups can make better decisions together'
      },
      {
        title: 'Coordination Mechanisms',
        description: 'Developing new tools and frameworks for effective collaboration'
      }
    ]
  };

  const productStream = {
    title: 'Product Stream',
    description: 'We build practical tools and systems that help groups coordinate more effectively.',
    items: [
      {
        title: 'Decision Support Systems',
        description: 'Tools that help groups reach better decisions together'
      },
      {
        title: 'Knowledge Management',
        description: 'Systems for capturing and sharing collective wisdom'
      },
      {
        title: 'Integration Frameworks',
        description: 'Solutions that bridge human insight with AI capabilities'
      }
    ]
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.card}>
            <h2 className={styles.title}>Our Focus</h2>
            <p className={styles.subtitle}>
              We operate across two complementary streams, combining theoretical research 
              with practical applications to advance the field of human-AI coordination.
            </p>
          </div>
        </div>
        <div className={styles.streams}>
          <StreamCard {...researchStream} />
          <StreamCard {...productStream} />
        </div>
      </div>
    </section>
  );
}
