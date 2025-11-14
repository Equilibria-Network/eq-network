// src/components/Roadmap/RoadmapDetails.js
import React, { useState, useEffect } from 'react';
import { Tooltip } from '../../utils/tooltip';
import styles from './RoadmapDetails.module.css';

// Platform icon mapping - maps platform names to icon filenames
const PLATFORM_ICONS = {
  'arxiv': 'arxiv.svg',
  'lesswrong': 'lesswrong.svg',
  'substack': 'substack.svg',
  'github': 'github.svg',
  'linkedin': 'linkedin.svg',
  'youtube': 'youtube.svg',
  'luma': 'luma.svg',
};

// Fixed order for platform icons (always display in this sequence)
const PLATFORM_ORDER = [
  'arxiv',
  'lesswrong', 
  'substack',
  'github',
  'linkedin',
  'youtube',
  'luma'
];

// Helper to get platform display name for tooltip
const getPlatformDisplayName = (platform) => {
  const displayNames = {
    'arxiv': 'arXiv',
    'lesswrong': 'LessWrong',
    'substack': 'Substack',
    'github': 'GitHub',
    'linkedin': 'LinkedIn',
    'youtube': 'YouTube',
    'luma': 'Luma',
  };
  return displayNames[platform.toLowerCase()] || platform;
};

export default function RoadmapDetails({ selectedPhase }) {
  const [phase, setPhase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no phase selected, clear the display
    if (!selectedPhase) {
      setPhase(null);
      return;
    }

    const loadPhase = async () => {
      try {
        const phaseData = await import(`../../data/Roadmap/phase-${selectedPhase}.json`);
        setPhase(phaseData.default);
        setLoading(false);
      } catch (error) {
        console.error('Error loading phase data:', error);
        setLoading(false);
      }
    };

    loadPhase();
  }, [selectedPhase]);

  // Don't render anything if no phase is selected
  if (!selectedPhase || !phase) return null;
  if (loading) return null;

  const { details, researcher, name, publications, id } = phase;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.detailsContent}>
          {/* Left - Large Image */}
          <div className={styles.imageSection}>
            <img 
              src={researcher.image} 
              alt={researcher.fullName}
              className={styles.largeImage}
            />
            {/* Researcher bio - optional, handles gracefully if not present */}
            {researcher.bio && (
              <p className={styles.researcherBio}>{researcher.bio}</p>
            )}
          </div>

          {/* Right - Title and Text Content */}
          <div className={styles.textSection}>
            <h2 className={styles.phaseTitle}>Phase {id}: {name}</h2>
            <p className={styles.tagline}>{details.tagline}</p>

            {/* Single description paragraph */}
            <p className={styles.detailText}>{details.description}</p>

            {/* Published Research Section */}
            {publications && publications.length > 0 && (
              <div className={styles.publicationsSection}>
                <h3 className={styles.publicationsHeading}>Published Research</h3>
                <div className={styles.publicationsList}>
                  {publications.map((pub) => (
                    <div key={pub.id} className={styles.publicationItem}>
                      {/* Single line: Title (type) [icon] [icon] [icon] */}
                      <div className={styles.publicationLine}>
                        <div className={styles.publicationText}>
                          <a 
                            href={pub.primaryLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.publicationTitle}
                          >
                            {pub.title}
                          </a>
                          <span className={styles.publicationType}>({pub.type})</span>
                        </div>
                        
                        {/* Platform icons row - FIXED ORDER */}
                        {pub.links && Object.keys(pub.links).length > 0 && (
                          <div className={styles.platformIcons}>
                            {PLATFORM_ORDER
                              .filter(platform => pub.links[platform.toLowerCase()])
                              .map(platform => {
                                const platformKey = platform.toLowerCase();
                                const url = pub.links[platformKey];
                                const iconFileName = PLATFORM_ICONS[platformKey];
                                
                                if (!iconFileName) {
                                  console.warn(`No icon found for platform: ${platform}`);
                                  return null;
                                }

                                return (
                                  <Tooltip 
                                    key={platform} 
                                    content={`View on ${getPlatformDisplayName(platform)}`}
                                    placement="top"
                                  >
                                    
                          <a 
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={styles.platformIconLink}
                                      aria-label={`View on ${getPlatformDisplayName(platform)}`}
                                    >
                                      <img
                                        src={`/img/socials/${iconFileName}`}
                                        alt={getPlatformDisplayName(platform)}
                                        className={styles.platformIcon}
                                      />
                                    </a>
                                  </Tooltip>
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
          </div>
        </div>
      </div>
    </section>
  );
}
