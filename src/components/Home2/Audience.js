// src/components/Home2/Audience.js
import React from 'react';
import styles from './Audience.module.css';
import { Users, Shield, Cpu } from 'lucide-react';

export default function Audience() {
  const audiences = [
    {
      id: 'policymakers',
      title: 'For Policymakers',
      icon: Users,
      claim: 'Test AI governance before catastrophic implementation',
      description: 'Mathematical stress-testing prevents trillion-dollar regulatory failures',
      example: 'Semiconductor supply chain policies often create hidden vulnerabilities when critical nodes concentrate in adversarial regions. Our models reveal which interventions actually increase resilience versus which just look good on paper.'
    },
    {
      id: 'researchers',
      title: 'For AI Safety Researchers',
      icon: Shield,
      claim: 'Formal guarantees for multi-agent AI systems',
      description: 'The mathematical framework AI safety needs for collective intelligence risks',
      example: 'When AI systems coordinate with each other, they behave like crowds of people - but faster and in ways current safety approaches can\'t predict. We\'re building the mathematical foundations to understand these digital crowds before they become uncontrollable.'
    },
    {
      id: 'labs',
      title: 'For AI Labs',
      icon: Cpu,
      claim: 'Predict emergent behaviors before expensive deployment',
      description: 'Design coordination mechanisms with mathematical optimization, not trial-and-error',
      example: 'Your AI systems will need to coordinate someday. Should they trade information like a market, share everything like networks, or vote like democracies? We can tell you which approach will work best before you spend millions building the wrong system.'
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Who This Matters To</h2>
          <p className={styles.subtitle}>
            Our research provides unique value to decision-makers across policy, research, and industry
          </p>
        </div>

        {/* Audience Cards */}
        <div className={styles.audienceGrid}>
          {audiences.map((audience) => {
            const IconComponent = audience.icon;
            
            return (
              <div key={audience.id} className={styles.audienceCard}>
                {/* Card Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>
                    <IconComponent size={28} />
                  </div>
                  <h3 className={styles.cardTitle}>{audience.title}</h3>
                </div>

                {/* Bold Claim */}
                <div className={styles.cardClaim}>
                  <p className={styles.claimText}>{audience.claim}</p>
                </div>

                {/* Description */}
                <div className={styles.cardDescription}>
                  <p className={styles.descriptionText}>{audience.description}</p>
                </div>

                {/* Example */}
                <div className={styles.cardExample}>
                  <h4 className={styles.exampleTitle}>Example</h4>
                  <p className={styles.exampleText}>{audience.example}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className={styles.bottomCta}>
          <p className={styles.ctaText}>
            Ready to explore how our research applies to your work?
          </p>
          <a href="/research" className={styles.ctaButton}>
            Explore Our Research
          </a>
        </div>
      </div>
    </section>
  );
}
