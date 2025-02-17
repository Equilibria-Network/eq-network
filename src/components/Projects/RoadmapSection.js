// src/components/Projects/RoadmapSection.js
import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import styles from './RoadmapSection.module.css';

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 size={20} className={styles.completedIcon} />;
    case 'active':
      return <Clock size={20} className={styles.activeIcon} />;
    default:
      return <Circle size={20} className={styles.plannedIcon} />;
  }
};

const RoadmapSection = ({ phases }) => {
  return (
    <div className={styles.roadmap}>
      {phases.map((phase, index) => (
        <div key={phase.name} className={styles.phase}>
          <div className={styles.phaseContent}>
            <div className={styles.phaseHeader}>
              <div className={styles.statusIcon}>
                {getStatusIcon(phase.status)}
              </div>
              <h4 className={styles.phaseName}>{phase.name}</h4>
              {phase.status === 'active' && (
                <div className={styles.progressIndicator}>
                  <div className={styles.progressText}>{phase.progress}%</div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                </div>
              )}
              {phase.status === 'completed' && phase.completedDate && (
                <div className={styles.completedDate}>
                  Completed: {phase.completedDate}
                </div>
              )}
            </div>
            <div className={styles.phaseDetails}>
              <p className={styles.phaseDescription}>
                {phase.description}
              </p>
              {phase.deliverables && (
                <ul className={styles.phaseDeliverables}>
                  {phase.deliverables.map((deliverable, idx) => (
                    <li key={idx} className={styles.deliverable}>
                      {deliverable}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {index < phases.length - 1 && (
            <div className={`${styles.connector} ${styles[phase.status]}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default RoadmapSection;
