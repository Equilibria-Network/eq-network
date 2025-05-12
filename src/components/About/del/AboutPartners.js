// src/components/About/AboutPartners.js
import React from 'react';
import styles from './AboutPartners.module.css';

export default function AboutPartners() {
  const partners = [
    {
      name: "Stanford Complexity Lab",
      logo: "/img/partners/placeholder-logo-1.svg",
      description: "Collaboration on complex systems modeling and network resilience"
    },
    {
      name: "Institute for Advanced Study",
      logo: "/img/partners/placeholder-logo-2.svg",
      description: "Joint research on category theory applications to multi-agent systems"
    },
    {
      name: "Future of Humanity Institute",
      logo: "/img/partners/placeholder-logo-3.svg",
      description: "Partnership on governance mechanisms for advanced AI systems"
    },
    {
      name: "Santa Fe Institute",
      logo: "/img/partners/placeholder-logo-4.svg",
      description: "Research collaboration on computational social science"
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Our Partners</h2>
        <p className={styles.sectionDescription}>
          We collaborate with leading research institutions and organizations
        </p>
        
        <div className={styles.partnersGrid}>
          {partners.map((partner, index) => (
            <div key={index} className={styles.partnerCard}>
              <div className={styles.partnerLogo}>
                <img src={partner.logo} alt={partner.name} />
              </div>
              <h3 className={styles.partnerName}>{partner.name}</h3>
              <p className={styles.partnerDescription}>{partner.description}</p>
            </div>
          ))}
        </div>
        
        <div className={styles.partnersCta}>
          <p className={styles.ctaText}>
            Interested in collaborating with Equilibria Network?
          </p>
          <a href="mailto:contact@eq-network.org" className={styles.ctaButton}>
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
