// src/components/roadmap/PhaseDetails.tsx
import React from 'react';

import type { RoadmapPhase, PublicationLinks } from '@content/roadmap/types';
import styles from './PhaseDetails.module.css';


interface PhaseDetailsProps {
  phase: RoadmapPhase;
}

export default function PhaseDetails({ phase }: PhaseDetailsProps) {
  // Split description by \n\n to handle multiple paragraphs
  const descriptionParagraphs = phase.details.description.split('\n\n');

  // Define platform order and icon paths
  const platformOrder = ['substack', 'lesswrong', 'arxiv', 'youtube'] as const;
  
  const platformIcons: Record<string, string> = {
    substack: '/img/socials/substack.svg',
    lesswrong: '/img/socials/lesswrong.svg',
    arxiv: '/img/socials/arxiv.svg',
    youtube: '/img/socials/youtube.svg'
  };

  // Helper function to get ordered platform links
const getOrderedPlatformLinks = (links: PublicationLinks) => {
  return platformOrder
    .filter(platform => links[platform])
    .map(platform => ({
      platform,
      url: links[platform]!,  // Add non-null assertion
      icon: platformIcons[platform]
    }));
};

  return (
    <div className={styles.detailsContent}>
      {/* Image Section */}
      <div className={styles.imageSection}>
        <img 
          src={phase.researcher.image} 
          alt={phase.researcher.fullName}
          className={styles.largeImage}
        />
        <p className={styles.researcherBio}>
          {phase.researcher.bio}
        </p>
      </div>

      {/* Text Content */}
      <div className={styles.textSection}>
        <h2 className={styles.phaseTitle}>
          Phase {phase.id}: {phase.researcher.lastName}
        </h2>



        <p className={styles.phaseTagline}>{phase.details.tagline}</p>
        
        {/* Multiple paragraphs for description */}
        {descriptionParagraphs.map((paragraph, index) => (
          <p key={index} className={styles.phaseDescription}>
            {paragraph}
          </p>
        ))}

        {/* Research Areas */}
        {phase.researchAreas && phase.researchAreas.length > 0 && (
          <div className={styles.researchAreasSection}>
            {phase.researchAreas.map((area) => (
              <div key={area.id} className={styles.researchArea}>
                <h3 className={styles.areaTitle}>{area.name}</h3>
                <p className={styles.areaDescription}>{area.description}</p>

                {/* Publications for this research area */}
                {area.publications.length > 0 && (
                  <div className={styles.publicationsGrid}>
                    {area.publications.map((pub) => {
                      const orderedLinks = pub.links ? getOrderedPlatformLinks(pub.links) : [];
                      const hasLinks = orderedLinks.length > 0;
                      
                      return (
                        <div key={pub.id} className={styles.publicationCard}>
                          <div className={styles.cardContent}>
                            {/* Left side - Text content */}
                            <div className={styles.cardText}>
                              <h4 className={styles.publicationTitle}>{pub.title}</h4>
                              <div className={styles.publicationMeta}>
                                <span className={styles.status}>{pub.status}</span>
                                <span className={styles.separator}>·</span>
                                <span className={styles.medium}>{pub.medium}</span>
                              </div>
                            </div>

                            {/* Right side - Platform icons in consistent order */}
                            {hasLinks && (
                              <div className={styles.platformLinks}>
                                {orderedLinks.map(({ platform, url, icon }) => (
                                  <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.platformLink}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <img
                                      src={icon}
                                      alt={platform}
                                      className={styles.platformIcon}
                                    />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Old publications fallback - for phases without research areas */}
        {phase.publications && phase.publications.length > 0 && (
          <div className={styles.researchAreasSection}>
            <div className={styles.researchArea}>
              <h3 className={styles.areaTitle}>Published Research</h3>
              <div className={styles.publicationsGrid}>
                {phase.publications.map((pub) => {
                  const orderedLinks = pub.links ? getOrderedPlatformLinks(pub.links) : [];
                  const hasLinks = orderedLinks.length > 0;
                  
                  return (
                    <div key={pub.id} className={styles.publicationCard}>
                      <div className={styles.cardContent}>
                        <div className={styles.cardText}>
                          <h4 className={styles.publicationTitle}>{pub.title}</h4>
                          <div className={styles.publicationMeta}>
                            <span className={styles.status}>{pub.status}</span>
                            <span className={styles.separator}>·</span>
                            <span className={styles.medium}>{pub.medium}</span>
                          </div>
                        </div>

                        {hasLinks && (
                          <div className={styles.platformLinks}>
                            {orderedLinks.map(({ platform, url, icon }) => (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.platformLink}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <img
                                  src={icon}
                                  alt={platform}
                                  className={styles.platformIcon}
                                />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
