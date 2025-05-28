// src/components/Research/ProgressTimeline.js
import React from 'react';
import styles from './ProgressTimeline.module.css';
import { CheckCircle, Circle, Clock, Calendar } from 'lucide-react';

export default function ProgressTimeline({ stages, isCompact, researchAreaColor }) {
  // Format duration in days to readable format
  const formatDuration = (days) => {
    if (days < 30) return `${days}d`;
    const months = Math.round(days / 30);
    return `${months}mo`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status icon
  const getStatusIcon = (stage) => {
    switch (stage.status) {
      case 'completed':
        return <CheckCircle size={16} className={styles.completedIcon} />;
      case 'active':
        return <Clock size={16} className={styles.activeIcon} />;
      case 'planned':
      default:
        return <Circle size={16} className={styles.plannedIcon} />;
    }
  };

  // Get progress percentage for active stage
  const getProgressWidth = (stage) => {
    if (stage.status === 'completed') return '100%';
    if (stage.status === 'active') return `${stage.progress || 0}%`;
    return '0%';
  };

  if (isCompact) {
    // Compact view - horizontal timeline with just status indicators
    return (
      <div className={styles.compactTimeline}>
        <div className={styles.compactHeader}>
          <span className={styles.timelineLabel}>Progress Timeline</span>
          <span className={styles.stageCount}>
            {stages.filter(s => s.status === 'completed').length}/{stages.length} stages
          </span>
        </div>
        <div className={styles.compactStages}>
          {stages.map((stage, index) => (
            <div 
              key={stage.id} 
              className={`${styles.compactStage} ${styles[stage.status]}`}
              title={`${stage.name} - ${stage.status}${stage.progress ? ` (${stage.progress}%)` : ''}`}
            >
              <div className={styles.compactStageIndicator}>
                {getStatusIcon(stage)}
              </div>
              <div className={styles.compactStageName}>
                {stage.name}
              </div>
              {stage.status === 'active' && stage.progress && (
                <div className={styles.compactProgress}>
                  <div 
                    className={styles.compactProgressFill}
                    style={{ 
                      width: `${stage.progress}%`,
                      backgroundColor: researchAreaColor || 'var(--ifm-color-primary)'
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full timeline view
  return (
    <div className={styles.timeline}>
      <div className={styles.timelineHeader}>
        <h5>Detailed Progress Timeline</h5>
      </div>
      
      <div className={styles.stages}>
        {stages.map((stage, index) => (
          <div key={stage.id} className={`${styles.stage} ${styles[stage.status]}`}>
            {/* Connection Line */}
            {index > 0 && (
              <div className={styles.connectionLine} />
            )}
            
            {/* Stage Indicator */}
            <div className={styles.stageIndicator}>
              {getStatusIcon(stage)}
            </div>
            
            {/* Stage Content */}
            <div className={styles.stageContent}>
              <div className={styles.stageHeader}>
                <h6 className={styles.stageName}>{stage.name}</h6>
                <div className={styles.stageMeta}>
                  <span className={styles.duration}>
                    <Calendar size={12} />
                    {formatDuration(stage.duration)}
                  </span>
                  {stage.completedDate && (
                    <span className={styles.completedDate}>
                      Completed {formatDate(stage.completedDate)}
                    </span>
                  )}
                </div>
              </div>
              
              <p className={styles.stageDescription}>{stage.description}</p>
              
              {/* Progress bar for active stage */}
              {stage.status === 'active' && stage.progress !== undefined && (
                <div className={styles.stageProgress}>
                  <div className={styles.stageProgressBar}>
                    <div 
                      className={styles.stageProgressFill}
                      style={{ 
                        width: getProgressWidth(stage),
                        backgroundColor: researchAreaColor || 'var(--ifm-color-primary)'
                      }}
                    />
                  </div>
                  <span className={styles.stageProgressText}>{stage.progress}%</span>
                </div>
              )}
              
              {/* Deliverables */}
              {stage.deliverables && stage.deliverables.length > 0 && (
                <div className={styles.deliverables}>
                  <strong>Deliverables:</strong>
                  <ul>
                    {stage.deliverables.map((deliverable, idx) => (
                      <li key={idx}>{deliverable}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
