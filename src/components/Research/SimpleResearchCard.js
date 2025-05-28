// src/components/Research/SimpleResearchCard.js
import React, { useState } from 'react';
import styles from './SimpleResearchCard.module.css';
import { ChevronDown } from 'lucide-react';
import { Tooltip } from '../../utils/tooltip';
import ResearchModal from './ResearchModal';

// Import research data
import researchData from '../../data/research.json';

export default function SimpleResearchCard({ paperId = 'langlands-ci' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get paper data from JSON
  const paper = researchData.papers.find(p => p.id === paperId);
  if (!paper) return null;
  
  // Use consistent theme colors
  const areaColor = 'var(--ifm-color-primary)';

  // Helper function to get action text for tooltips
  const getActionText = (type) => {
    switch (type) {
      case 'google-doc':
        return 'view draft';
      case 'overleaf':
        return 'review';
      case 'arxiv':
        return 'read preprint';
      case 'journal':
        return 'read publication';
      default:
        return 'view';
    }
  };

  // Helper function to get correct icon name
  const getIconName = (type) => {
    if (type === 'publication') return 'journal';
    return type;
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <article className={styles.card} onClick={openModal}>
        <div className={styles.cardContent}>
          {/* Header */}
          <div className={styles.header}>
            <h3 className={styles.title}>{paper.title}</h3>
            
            <div className={styles.authors}>
              <img 
                src="/img/icons/team.svg" 
                alt="team" 
                width="16" 
                height="16"
                className={styles.teamIcon}
              />
              <span className={styles.teamLabel}>TEAM MEMBERS:</span>
              <span>{paper.authors.join(', ')}</span>
            </div>
          </div>

          {/* Key Research Question */}
          <div className={styles.keyQuestion}>
            <p className={styles.questionText}>{paper.keyQuestion}</p>
          </div>

          {/* Chunked Progress Bar - 5 Standardized Phases */}
          <div className={styles.progressSection}>
            <div className={styles.chunkedProgress}>
              {paper.progressStages.map((stage) => (
                <div key={stage.id} className={styles.progressChunk}>
                  {/* Icon above the bar */}
                  <Tooltip 
                    content={
                      stage.link 
                        ? `Click to ${getActionText(stage.type)}`
                        : `${stage.name} - Coming soon`
                    }
                  >
                    <div 
                      className={`${styles.stageIcon} ${stage.progress === 100 && stage.link ? styles.iconActive : styles.iconInactive}`}
                      onClick={stage.link ? (e) => {
                        e.stopPropagation();
                        window.open(stage.link, '_blank');
                      } : undefined}
                    >
                      <img 
                        src={`/img/icons/${getIconName(stage.type)}.svg`}
                        alt={stage.type}
                        width="40"
                        height="40"
                        className={styles.iconImage}
                      />
                    </div>
                  </Tooltip>
                  
                  <div className={styles.chunkContainer}>
                    <div 
                      className={styles.chunkFill}
                      style={{
                        width: `${stage.progress}%`,
                        backgroundColor: areaColor
                      }}
                    />
                    <span 
                      className={styles.chunkPercentage}
                      style={{
                        color: stage.progress === 0 ? areaColor : 'white'
                      }}
                    >
                      {stage.progress}%
                    </span>
                  </div>
                  <span className={styles.chunkLabel}>{stage.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Click indicator */}
          <div className={styles.clickIndicator}>
            <span>Click for details</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </article>

      {/* Reusable Modal Component */}
      <ResearchModal 
        paper={paper}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
