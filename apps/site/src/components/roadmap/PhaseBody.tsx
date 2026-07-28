// src/components/roadmap/PhaseBody.tsx
// The detailed research areas and publications for a phase.

import React from 'react';
import type { RoadmapPhase, PublicationLinks, Publication } from '@content/roadmap/types';
import styles from './PhaseDetails.module.css';

interface Props {
  phase: RoadmapPhase;
}

const platformOrder = ['substack', 'lesswrong', 'arxiv', 'youtube'] as const;

const platformIcons: Record<string, string> = {
  substack: '/img/socials/substack.svg',
  lesswrong: '/img/socials/lesswrong.svg',
  arxiv: '/img/socials/arxiv.svg',
  youtube: '/img/socials/youtube.svg',
};

function getOrderedPlatformLinks(links: PublicationLinks) {
  return platformOrder
    .filter((platform) => links[platform])
    .map((platform) => ({
      platform,
      url: links[platform]!,
      icon: platformIcons[platform],
    }));
}

function PublicationCard({ pub }: { pub: Publication }) {
  const orderedLinks = pub.links ? getOrderedPlatformLinks(pub.links) : [];
  const hasLinks = orderedLinks.length > 0;

  return (
    <div className={styles.publicationCard}>
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
                  loading="lazy"
                  decoding="async"
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
}

export default function PhaseBody({ phase }: Props) {
  const hasResearchAreas = phase.researchAreas && phase.researchAreas.length > 0;
  const hasPublications = phase.publications && phase.publications.length > 0;

  if (!hasResearchAreas && !hasPublications) return null;

  return (
    <div className={styles.detailsContent}>
      <div className={styles.textSection}>
        {hasResearchAreas && (
          <div className={styles.researchAreasSection}>
            {phase.researchAreas!.map((area) => (
              <div key={area.id} className={styles.researchArea}>
                <h3 className={styles.areaTitle}>{area.name}</h3>
                <p className={styles.areaDescription}>{area.description}</p>
                {area.publications.length > 0 && (
                  <div className={styles.publicationsGrid}>
                    {area.publications.map((pub) => (
                      <PublicationCard key={pub.id} pub={pub} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {hasPublications && (
          <div className={styles.researchAreasSection}>
            <div className={styles.researchArea}>
              <h3 className={styles.areaTitle}>Published Research</h3>
              <div className={styles.publicationsGrid}>
                {phase.publications!.map((pub) => (
                  <PublicationCard key={pub.id} pub={pub} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
