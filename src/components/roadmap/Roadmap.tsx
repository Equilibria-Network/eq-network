// src/components/roadmap/Roadmap.tsx
import React, { useState } from 'react';
import { roadmapPhases, roadmapOverview } from '@content/roadmap';
import type { PublicationLinks } from '@content/roadmap';
import { SubareasSection } from './RoadmapWithSubareas';
import styles from './Roadmap.module.css';

export default function Roadmap() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(1);

  const currentPhase = roadmapPhases.find(p => p.id === selectedPhase);

  // Map platform names to icon paths
  const platformIcons: Record<keyof PublicationLinks, string> = {
    substack: '/img/socials/substack.svg',
    lesswrong: '/img/socials/lesswrong.svg',
    arxiv: '/img/socials/arxiv.svg',
    youtube: '/img/socials/youtube.svg'
  };

  return (
    <div className={styles.roadmapWrapper}>
      {/* Header Section */}
      <section className={styles.headerSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.leftColumn}>
              <h1 className={styles.mainTitle}>Roadmap</h1>
              <p className={styles.tagline}>{roadmapOverview.tagline}</p>
            </div>
            <div className={styles.rightColumn}>
              <p className={styles.description}>{roadmapOverview.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Side-by-Side Layout */}
      <section className={styles.mainContentSection}>
        <div className={styles.container}>
          <div className={styles.splitLayout}>
            {/* Left Sidebar - Phase Navigation */}
            <aside className={styles.phaseSidebar}>
              <div className={styles.sidebarSticky}>
                {roadmapPhases.map((phase) => (
                  <button
                    key={phase.id}
                    className={`${styles.phaseNavItem} ${selectedPhase === phase.id ? styles.phaseNavItemActive : ''}`}
                    onClick={() => setSelectedPhase(phase.id)}
                  >
                    <div className={styles.phaseNavNumber}>{phase.id}</div>
                    <div className={styles.phaseNavImage}>
                      <img 
                        src={phase.researcher.image} 
                        alt={phase.researcher.fullName}
                        className={styles.navPortrait}
                      />
                    </div>
                    <div className={styles.phaseNavText}>
                      <div className={styles.navPhaseName}>{phase.name}</div>
                      <div className={styles.navResearcherName}>{phase.researcher.lastName}</div>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* Right Panel - Phase Details */}
            <main className={styles.detailsPanel}>
              {currentPhase && (
                <div className={styles.detailsContent}>
                  {/* Image Section */}
                  <div className={styles.imageSection}>
                    <img 
                      src={currentPhase.researcher.image} 
                      alt={currentPhase.researcher.fullName}
                      className={styles.largeImage}
                    />
                    <p className={styles.researcherBio}>
                      {currentPhase.researcher.bio}
                    </p>
                  </div>

                  {/* Text Content */}
                  <div className={styles.textSection}>
                    <h2 className={styles.phaseTitle}>
                      Phase {currentPhase.id}: {currentPhase.name}
                    </h2>
                    <p className={styles.phaseTagline}>{currentPhase.details.tagline}</p>
                    <p className={styles.phaseDescription}>{currentPhase.details.description}</p>

                    {/* Publications */}
                    {currentPhase.publications.length > 0 && (
                      <div className={styles.publicationsSection}>
                        <h3 className={styles.publicationsHeading}>Published Research</h3>
                        <div className={styles.publicationsList}>
                          {currentPhase.publications.map((pub) => (
                            <div key={pub.id} className={styles.publicationItem}>
                              <a
                                href={pub.primaryLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.publicationLink}
                              >
                                {pub.title}
                              </a>
                              <div className={styles.publicationMeta}>
                                <span className={styles.publicationType}>{pub.type}</span>
                                {pub.links && (
                                  <div className={styles.publicationLinks}>
                                    {(Object.keys(pub.links) as Array<keyof PublicationLinks>).map((platform) => {
                                      const url = pub.links[platform];
                                      if (!url) return null;
                                      return (
                                        <a
                                          key={platform}
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={styles.platformLink}
                                          aria-label={`Read on ${platform}`}
                                        >
                                          <img
                                            src={platformIcons[platform]}
                                            alt={platform}
                                            className={styles.platformIcon}
                                          />
                                        </a>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Research Areas */}
                    {currentPhase.subareas && (
                      <SubareasSection
                        subareas={currentPhase.subareas}
                        overview={currentPhase.subareasOverview}
                      />
                    )}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
