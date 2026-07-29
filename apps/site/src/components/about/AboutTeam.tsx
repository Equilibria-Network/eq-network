// src/components/about/AboutTeam.tsx
import React, { useState, useEffect, useRef } from 'react';
import { teamMembers } from '@content/team';
import { aboutUi } from '@content/about';
import styles from './AboutTeam.module.css';

export default function AboutTeam() {
  const { team } = aboutUi;
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleCardClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFlippedCard(flippedCard === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Any click that is not on a card dismisses the flipped card, whether it
      // lands elsewhere in the section or anywhere else on the page.
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
          <h2 className={styles.sectionTitle}>{team.title}</h2>
          <p className={styles.subtitle}>{team.subtitle}</p>
        </div>

        <div className={styles.teamGrid}>
          {teamMembers.map((member) => (
            <button
              type="button"
              key={member.id}
              className={styles.cardWrapper}
              onClick={(e) => handleCardClick(e, member.id)}
              aria-pressed={flippedCard === member.id}
            >
              <div className={`${styles.card} ${flippedCard === member.id ? styles.flipped : ''}`}>
                {/* Front Side */}
                <div className={styles.cardFront}>
                  <div className={styles.imageContainer}>
                    <img
                      loading="lazy"
                      decoding="async"
                      src={member.image}
                      alt={member.name}
                      className={styles.memberImage}
                    />
                  </div>

                  <div className={styles.frontContent}>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    <p className={styles.memberRole}>{member.role}</p>
                    <p className={styles.memberBio}>{member.bio}</p>
                    <p className={styles.clickHint}>{team.flipHint}</p>
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
                    <p className={styles.clickHint}>{team.backHint}</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
