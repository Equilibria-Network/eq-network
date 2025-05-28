// src/components/Research/ResearchModal.js
import React, { useEffect } from 'react';
import styles from './ResearchModal.module.css';
import ProgressTimeline from './ProgressTimeline';
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  Target, 
  Clock, 
  ExternalLink,
  DollarSign
} from 'lucide-react';

export default function ResearchModal({ paper, researchAreas, onClose }) {
  // Get research area color
  const researchArea = researchAreas.find(area => 
    area.id === paper.researchArea.toLowerCase().replace(/[^a-z]/g, '-')
  );

  // Format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate time remaining
  const calculateTimeRemaining = () => {
    const now = new Date();
    const endDate = new Date(paper.expectedCompletion);
    const timeDiff = endDate - now;
    
    if (timeDiff <= 0) return 'Overdue';
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    
    if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} remaining`;
    } else {
      return `${days} day${days > 1 ? 's' : ''} remaining`;
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.researchAreaBadge} style={{ backgroundColor: researchArea?.color }}>
              {paper.researchArea}
            </div>
            <h2 className={styles.modalTitle}>{paper.title}</h2>
            {paper.subtitle && (
              <h3 className={styles.modalSubtitle}>{paper.subtitle}</h3>
            )}
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.modalBody}>
          {/* Authors */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Users size={18} />
              <h4>Authors</h4>
            </div>
            <p className={styles.authors}>{paper.authors.join(', ')}</p>
          </div>

          {/* Abstract */}
          <div className={styles.section}>
            <h4>Abstract</h4>
            <p className={styles.abstract}>{paper.abstract}</p>
          </div>

          {/* Timeline */}
          <div className={styles.section}>
            <h4>Progress Timeline</h4>
            <ProgressTimeline 
              stages={paper.progressStages} 
              isCompact={false}
              researchAreaColor={researchArea?.color}
            />
          </div>

          {/* Metadata Grid */}
          <div className={styles.metadataGrid}>
            <div className={styles.metadataSection}>
              <h4>Timeline</h4>
              <div className={styles.metadataItems}>
                <div className={styles.metadataItem}>
                  <Calendar size={16} />
                  <span>Started {formatDate(paper.startDate)}</span>
                </div>
                <div className={styles.metadataItem}>
                  <Target size={16} />
                  <span>Due {formatDate(paper.expectedCompletion)}</span>
                </div>
                <div className={styles.metadataItem}>
                  <Clock size={16} />
                  <span className={styles.timeRemaining}>{calculateTimeRemaining()}</span>
                </div>
              </div>
            </div>

            <div className={styles.metadataSection}>
              <h4>Publication</h4>
              <div className={styles.metadataItems}>
                <div className={styles.metadataItem}>
                  <MapPin size={16} />
                  <span>{paper.targetVenue}</span>
                </div>
                <div className={styles.metadataItem}>
                  <DollarSign size={16} />
                  <span>{paper.fundingSource}</span>
                </div>
                {paper.publicDraftUrl && (
                  <div className={styles.metadataItem}>
                    <ExternalLink size={16} />
                    <a 
                      href={paper.publicDraftUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.draftLink}
                    >
                      View Public Draft
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className={styles.section}>
            <h4>Keywords</h4>
            <div className={styles.keywords}>
              {paper.keywords.map(keyword => (
                <span key={keyword} className={styles.keywordTag}>
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Collaborators */}
          {paper.collaborators && paper.collaborators.length > 0 && (
            <div className={styles.section}>
              <h4>Collaborators</h4>
              <div className={styles.collaborators}>
                {paper.collaborators.map((collab, idx) => (
                  <div key={idx} className={styles.collaborator}>
                    <strong>{collab.name}</strong>
                    <span className={styles.collaboratorType}>({collab.type})</span>
                    <span className={styles.collaboratorRole}>{collab.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
