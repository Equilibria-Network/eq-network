// src/components/Projects/ProgressTracker.js
import React, { useState, useEffect, useRef } from 'react';
import Tippy from '@tippyjs/react';
import { Check, Clock, ArrowRight } from 'lucide-react';
import styles from './ProgressTracker.module.css';

const MilestoneMarker = ({ milestone, index, totalMilestones, isVisible }) => {
  const getStatusIcon = () => {
    switch (milestone.status) {
      case 'completed':
        return <Check size={14} className={styles.checkIcon} />;
      case 'active':
        return <Clock size={14} className={styles.clockIcon} />;
      default:
        return <ArrowRight size={14} className={styles.arrowIcon} />;
    }
  };

  const position = `${(index / (totalMilestones - 1)) * 100}%`;
  const isLast = index === totalMilestones - 1;

  const getTooltipContent = () => (
    <div className={styles.tooltipContent}>
      <div className={styles.tooltipHeader}>
        <span className={styles.milestoneName}>{milestone.name}</span>
        {milestone.status === 'active' && (
          <span className={styles.progressBadge}>
            {milestone.progress}%
          </span>
        )}
      </div>
      <p className={styles.milestoneDescription}>{milestone.description}</p>
      {milestone.status === 'completed' && milestone.completedDate && (
        <div className={styles.completionDate}>
          Completed: {milestone.completedDate}
        </div>
      )}
      {milestone.deliverables && (
        <ul className={styles.deliverablesList}>
          {milestone.deliverables.map((deliverable, idx) => (
            <li key={idx}>{deliverable}</li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <Tippy
      content={getTooltipContent()}
      placement="top"
      animation="shift-away"
      duration={200}
      theme="custom"
      maxWidth={300}
    >
      <div 
        className={styles.milestoneMarker}
        style={{ 
          left: position,
          animationDelay: `${index * 0.1}s`
        }}
      >
        <div className={`${styles.markerContent} ${styles[milestone.status]}`}>
          <div className={styles.markerIcon}>
            {getStatusIcon()}
          </div>
          <div className={styles.markerLabel}>
            {milestone.name}
          </div>
          {milestone.status === 'active' && (
            <div className={styles.progressRing}>
              <svg viewBox="0 0 36 36" className={styles.progressCircle}>
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--progress-track-color)"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--progress-fill-color)"
                  strokeWidth="2"
                  strokeDasharray={`${milestone.progress}, 100`}
                  className={styles.progressPath}
                />
              </svg>
            </div>
          )}
        </div>
        {!isLast && (
          <div 
            className={`${styles.connectionLine} ${milestone.status === 'completed' ? styles.completed : ''}`}
          />
        )}
      </div>
    </Tippy>
  );
};

const ProgressBar = ({ milestones, isVisible }) => {
  const totalProgress = milestones.reduce((acc, milestone, index) => {
    if (milestone.status === 'completed') return acc + (100 / (milestones.length - 1));
    if (milestone.status === 'active') {
      return acc + ((milestone.progress / 100) * (100 / (milestones.length - 1)));
    }
    return acc;
  }, 0);

  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.progressBarTrack} />
      <div 
        className={styles.progressBarFill}
        style={{ 
          width: isVisible ? `${totalProgress}%` : '0%',
        }}
      >
        <div className={styles.progressGlow} />
      </div>
    </div>
  );
};

export default function ProgressTracker({ milestones }) {
  const [isVisible, setIsVisible] = useState(false);
  const trackerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (trackerRef.current) {
      observer.observe(trackerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.progressTracker} ref={trackerRef}>
      <ProgressBar milestones={milestones} isVisible={isVisible} />
      <div className={styles.milestones}>
        {milestones.map((milestone, index) => (
          <MilestoneMarker
            key={milestone.name}
            milestone={milestone}
            index={index}
            totalMilestones={milestones.length}
            isVisible={isVisible}
          />
        ))}
      </div>
    </div>
  );
}
