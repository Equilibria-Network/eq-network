// src/components/Roadmap/RoadmapDetails.js
import React, { useState, useEffect } from 'react';
import styles from './RoadmapDetails.module.css';

export default function RoadmapDetails({ selectedPhase }) {
  const [phase, setPhase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (!selectedPhase || !phase) return null;
  if (loading) return <div>Loading...</div>;

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
                      <div className={styles.publicationHeader}>
                        <h4 className={styles.publicationTitle}>
                          <a 
                            href={pub.primaryLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.publicationLink}
                          >
                            {pub.title}
                          </a>
                        </h4>
                        <span className={styles.publicationType}>{pub.type}</span>
                      </div>
                      
                      {/* Additional platform links */}
                      {pub.links && Object.keys(pub.links).length > 1 && (
                        <div className={styles.publicationLinks}>
                          <span className={styles.linksLabel}>Also on:</span>
                          {Object.entries(pub.links)
                            .filter(([platform, url]) => url !== pub.primaryLink)
                            .map(([platform, url]) => (
                              
                          <a 
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.platformLink}
                              >
                                {platform}
                              </a>
                            ))}
                        </div>
                      )}
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
