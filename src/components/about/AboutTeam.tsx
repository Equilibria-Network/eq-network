// src/components/about/AboutTeam.tsx
import React, { useState, useEffect, useRef } from 'react';
import { teamMembers } from '@content/team';
import styles from './AboutTeam.module.css';

export default function AboutTeam() {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleCardClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFlippedCard(flippedCard === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sectionRef.current && !sectionRef.current.contains(e.target as Node)) {
        return;
      }
      
      // Check if click is on a card
      const target = e.target as HTMLElement;
      const clickedCard = target.closest(`.${styles.cardWrapper}`);
      
      if (!clickedCard && flippedCard) {
        setFlippedCard(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [flippedCard]);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Team</h2>
          <p className={styles.subtitle}>The people building Equilibria Network</p>
        </div>

        <div className={styles.teamGrid}>
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              className={styles.cardWrapper}
              onClick={(e) => handleCardClick(e, member.id)}
            >
              <div className={`${styles.card} ${flippedCard === member.id ? styles.flipped : ''}`}>
                {/* Front Side */}
                <div className={styles.cardFront}>
                  <div className={styles.imageContainer}>
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className={styles.memberImage}
                    />
                  </div>
                  
                  <div className={styles.frontContent}>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    <p className={styles.memberRole}>{member.role}</p>
                    <p className={styles.memberBio}>{member.bio}</p>
                    <p className={styles.clickHint}>Click to read more</p>
                  </div>
                </div>

                {/* Back Side */}
                <div className={styles.cardBack}>
                  <div className={styles.backContent}>
                    <h3 className={styles.backName}>{member.name}</h3>
                    <div className={styles.detailsText}>
                      {member.details.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className={styles.detailParagraph}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    <p className={styles.clickHint}>Click to return</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
