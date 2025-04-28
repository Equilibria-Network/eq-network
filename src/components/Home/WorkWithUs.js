// src/components/Home/WorkWithUs.js
import React, { useState } from 'react';
import styles from './WorkWithUs.module.css';

export default function WorkWithUs() {
  const [activeProfile, setActiveProfile] = useState(null);

  const profiles = [
    {
      id: 'researcher',
      title: 'Researchers',
      shortDesc: 'Academic or independent researchers exploring collective intelligence',
      longDesc: 'You are working on theoretical or applied research in areas like complex systems, category theory, multi-agent systems, or computational social choice. You see connections between your field and the broader challenges of AI alignment and governance.',
      expertise: ['Complex Systems', 'Network Theory', 'Mathematical Modeling', 'Category Theory']
    },
    {
      id: 'practitioner',
      title: 'Practitioners',
      shortDesc: 'Those implementing AI governance or coordination mechanisms',
      longDesc: 'You work in industry, government, or civil society on practical coordination challenges. You are looking for frameworks and models that can help address real-world governance issues in AI development and deployment.',
      expertise: ['Governance Frameworks', 'Policy Implementation', 'Institutional Design', 'Risk Assessment']
    },
    {
      id: 'interdisciplinary',
      title: 'Interdisciplinary Connectors',
      shortDesc: 'Bridging traditionally separated fields and perspectives',
      longDesc: 'You have expertise across multiple domains and enjoy making connections between seemingly disparate fields. You can translate between technical, philosophical, and practical perspectives on coordination and collective intelligence.',
      expertise: ['Cross-domain Translation', 'Interdisciplinary Collaboration', 'Systems Thinking', 'Conceptual Bridges']
    },
    {
      id: 'experimentalist',
      title: 'Experimentalists',
      shortDesc: 'Building and testing systems to study collective intelligence',
      longDesc: 'You design and implement experiments, simulations, or real-world tests of coordination mechanisms. You are interested in empirical approaches to understanding how multi-agent systems function and evolve.',
      expertise: ['Simulation Design', 'Experimental Methods', 'Data Analysis', 'Prototype Development']
    }
  ];

  const handleProfileClick = (id) => {
    setActiveProfile(activeProfile === id ? null : id);
  };

  const closeActiveProfile = () => {
    setActiveProfile(null);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Work With Us</h2>
          <p className={styles.subtitle}>
            We are building a community of collaborators who share our fascination with collective intelligence and its role in shaping safer AI systems.
          </p>
        </div>

        <div className={styles.profilesGrid}>
          {profiles.map((profile) => (
            <div 
              key={profile.id}
              className={`${styles.profileCard} ${activeProfile === profile.id ? styles.active : ''}`}
              onClick={() => handleProfileClick(profile.id)}
            >
              <h3 className={styles.profileTitle}>{profile.title}</h3>
              <p className={styles.profileDesc}>{profile.shortDesc}</p>
              <span className={styles.profileMore}>Learn more</span>
            </div>
          ))}
        </div>

        {activeProfile && (
          <div className={styles.profileDetail}>
            <button className={styles.closeButton} onClick={closeActiveProfile}>×</button>
            <div className={styles.profileDetailContent}>
              <h3>{profiles.find(p => p.id === activeProfile).title}</h3>
              <p className={styles.profileLongDesc}>
                {profiles.find(p => p.id === activeProfile).longDesc}
              </p>
              <div className={styles.profileExpertise}>
                <h4>Key Areas of Expertise</h4>
                <div className={styles.expertiseTags}>
                  {profiles.find(p => p.id === activeProfile).expertise.map((skill, index) => (
                    <span key={index} className={styles.expertiseTag}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.cta}>
          <p>
            Our work thrives on diverse viewpoints and complementary skills. Whether you are a researcher, practitioner, advisor, or simply someone with a passionate interest in these questions, there are meaningful ways to contribute to our mission.
          </p>
          <a href="mailto:contact@eq-network.org" className={styles.ctaButton}>
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
