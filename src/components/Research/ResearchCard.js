// src/components/Research/ResearchCard.js
import React, { useState } from 'react';
import styles from './ResearchCard.module.css';
import ResearchModal from './ResearchModal';
import { 
  Users, 
  ExternalLink
} from 'lucide-react';

export default function ResearchCard({ paper, researchAreas, index }) {
  const [showModal, setShowModal] = useState(false);
  
  // Get research area color
  const researchArea = researchAreas.find(area => 
    area.id === paper.researchArea.toLowerCase().replace(/[^a-z]/g, '-')
  );
  
  // Calculate overall progress
  const totalStages = paper.progressStages.length;
  const completedStages = paper.progressStages.filter(stage => stage.status === 'completed').length;
  const activeStage = paper.progressStages.find(stage => stage.status === 'active');
  const activeProgress = activeStage ? activeStage.progress || 0 : 0;
  
  const overallProgress = ((completedStages + (activeProgress / 100)) / totalStages) * 100;
  
  // Get current stage name
  const getCurrentStageName = () => {
    if (activeStage) return activeStage.name;
    if (completedStages === totalStages) return 'Completed';
    return 'Planning';
  };
  
  // Get random slight rotation for cards
  const getCardRotation = () => {
    const rotations = ['-0.5deg', '0.3deg', '-0.2deg', '0.6deg'];
    return rotations[index % rotations.length];
  };

  // Handle progress bar click
  const handleProgressClick = () => {
    if (paper.publicDraftUrl) {
      window.open(paper.publicDraftUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <article 
        className={styles.card}
        style={{ 
          transform: `rotate(${getCardRotation()})`,
          '--research-area-color': researchArea?.color || '#003B7E'
        }}
      >
        {/* Research Area Badge */}
        <div className={styles.researchAreaBadge}>
          {paper.researchArea}
        </div>
        
        {/* Card Header */}
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>{paper.title}</h3>
          {paper.subtitle && (
            <h4 className={styles.subtitle}>{paper.subtitle}</h4>
          )}
        </div>
        
        {/* Authors */}
        <div className={styles.authors}>
          <Users size={16} />
          <span>{paper.authors.join(', ')}</span>
        </div>
        
        {/* Abstract */}
        <div className={styles.abstract}>
          <p>{paper.abstract}</p>
        </div>
        
        {/* Single Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <div className={styles.progressInfo}>
              <span className={styles.progressLabel}>
                {getCurrentStageName()} • {Math.round(overallProgress)}%
              </span>
              {paper.publicDraftUrl && (
                <span className={styles.draftIndicator}>
                  <ExternalLink size={14} />
                  Public Draft
                </span>
              )}
            </div>
          </div>
          <div 
            className={`${styles.progressBar} ${paper.publicDraftUrl ? styles.clickable : ''}`}
            onClick={handleProgressClick}
            title={paper.publicDraftUrl ? 'Click to view public draft' : undefined}
          >
            <div 
              className={styles.progressFill}
              style={{ 
                width: `${overallProgress}%`,
                backgroundColor: researchArea?.color || 'var(--ifm-color-primary)'
              }}
            />
          </div>
        </div>
        
        {/* Details Button */}
        <button 
          className={styles.detailsButton}
          onClick={() => setShowModal(true)}
          aria-label="View details"
        >
          View Details
        </button>
      </article>

      {/* Modal for detailed information */}
      {showModal && (
        <ResearchModal 
          paper={paper}
          researchAreas={researchAreas}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
