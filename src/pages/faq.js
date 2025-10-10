// src/pages/faq.js
import React from 'react';
import Layout from '@theme/Layout';
import SimulationsSection from '../components/FAQ/SimulationsSection';
import FoundationsSection from '../components/FAQ/FoundationsSection';
import styles from './faq.module.css';

export default function FAQ() {
  return (
    <Layout
      title="FAQ"
      description="Frequently asked questions about Equilibria Network's research methodology and approach"
    >
      <div className="parallax-background" />
      
      <main className={styles.faqMain}>
        <div className={styles.container}>
          {/* Page Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Frequently Asked Questions</h1>
            <p className={styles.subtitle}>
              Common questions about our research approach and methodology
            </p>
          </div>

          {/* FAQ Sections */}
          <SimulationsSection />
          <FoundationsSection />
        </div>
      </main>
    </Layout>
  );
}
