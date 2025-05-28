// src/components/Research/ResearchModal.js
import React from 'react';
import { X } from 'lucide-react';
import { Tooltip } from '../../utils/tooltip';
import styles from './ResearchModal.module.css';

export default function ResearchModal({ paper, isOpen, onClose }) {
  if (!isOpen || !paper) return null;

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

  const areaColor = 'var(--ifm-color-primary)';

  // Helper function to get progress stage descriptions
  const getProgressDescription = (stageId, status) => {
    const descriptions = {
      'initial-story': {
        completed: 'Initial research narrative and conceptual framework established.',
        active: 'Developing the foundational story and research direction.',
        planned: 'Will establish the core research narrative and initial framework.'
      },
      'internal-review': {
        completed: 'Internal peer review completed with team feedback incorporated.',
        active: 'Currently under internal review by team members and collaborators.',
        planned: 'Will undergo thorough internal review and revision process.'
      },
      'external-review': {
        completed: 'External expert review completed with revisions incorporated.',
        active: 'Currently seeking external expert feedback and conducting revisions.',
        planned: 'Will seek external expert review and incorporate feedback.'
      },
      'preprint': {
        completed: 'Preprint published and available to the research community.',
        active: 'Preparing preprint for publication on arXiv or similar platform.',
        planned: 'Will prepare and publish preprint for community feedback.'
      },
      'beyond': {
        completed: 'Published in peer-reviewed journal.',
        active: 'Submitted to journal and undergoing peer review process.',
        planned: 'Will submit to appropriate peer-reviewed journal for publication.'
      }
    };
    
    return descriptions[stageId]?.[status] || 'Progress stage in development.';
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button 
          className={styles.modalCloseButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{paper.title}</h2>
          <div className={styles.modalAuthors}>
            <span className={styles.modalTeamLabel}>Team:</span>
            <span>{paper.authors.join(', ')}</span>
          </div>
        </div>

        <div className={styles.modalBody}>
          {/* Key Question */}
          <div className={styles.modalSection}>
            <h3 className={styles.modalSectionTitle}>Research Question</h3>
            <p className={styles.modalSectionText}>{paper.keyQuestion}</p>
          </div>

          {/* Project Image */}
          {paper.image && (
            <div className={styles.modalSection}>
              <div className={styles.projectImage}>
                <img 
                  src={paper.image} 
                  alt={`${paper.title} visualization`}
                  className={styles.projectImageImg}
                />
              </div>
            </div>
          )}

          {/* Abstract */}
          <div className={styles.modalSection}>
            <h3 className={styles.modalSectionTitle}>Abstract</h3>
            <p className={styles.modalSectionText}>{paper.abstract}</p>
          </div>

          {/* Approach */}
          <div className={styles.modalSection}>
            <h3 className={styles.modalSectionTitle}>Approach</h3>
            <p className={styles.modalSectionText}>{paper.approach}</p>
          </div>

          {/* Progress Section - Vertical Stack with Descriptions */}
          <div className={styles.modalSection}>
            <h3 className={styles.modalSectionTitle}>Project Progress</h3>
            <div className={styles.progressList}>
              {paper.progressStages.map((stage) => (
                <div 
                  key={stage.id} 
                  className={styles.progressItem}
                  data-incomplete={stage.progress < 100 ? "true" : "false"}
                >
                  <div className={styles.progressItemHeader}>
                    <div 
                      className={styles.progressItemIcon}
                      onClick={stage.link ? (e) => {
                        e.stopPropagation();
                        window.open(stage.link, '_blank');
                      } : undefined}
                      style={{ 
                        cursor: stage.link ? 'pointer' : 'default',
                        opacity: stage.link ? 1 : 0.6
                      }}
                    >
                      <img 
                        src={`/img/icons/${getIconName(stage.type)}.svg`}
                        alt={stage.type}
                        className={styles.progressIcon}
                      />
                    </div>
                    <div className={styles.progressItemInfo}>
                      <h4 className={styles.progressItemTitle}>{stage.name}</h4>
                      <div className={styles.progressItemProgress}>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressBarFill}
                            style={{
                              width: `${stage.progress}%`,
                              backgroundColor: areaColor
                            }}
                          />
                        </div>
                        <span className={styles.progressPercent}>{stage.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.progressItemDescription}>
                    {getProgressDescription(stage.id, stage.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Research - Horizontal Grid Cards */}
          {paper.relatedResearch && paper.relatedResearch.length > 0 && (
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Related Research</h3>
              <div className={styles.relatedPapers}>
                {paper.relatedResearch.map((relatedPaper, index) => (
                  <a 
                    key={index}
                    href={relatedPaper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.relatedPaper}
                  >
                    <div className={styles.relatedPaperIcon}>
                      <img 
                        src={`/img/icons/${relatedPaper.platform}.svg`}
                        alt={relatedPaper.platform}
                        className={styles.platformIcon}
                      />
                    </div>
                    <div className={styles.relatedPaperContent}>
                      <h4 className={styles.relatedPaperTitle}>{relatedPaper.title}</h4>
                      <p className={styles.relatedPaperMeta}>
                        {relatedPaper.authors.includes('et al.') ? 
                          relatedPaper.authors : 
                          relatedPaper.authors.length > 50 ? 
                            `${relatedPaper.authors.split(',')[0]} et al.` : 
                            relatedPaper.authors
                        } • {relatedPaper.year}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
