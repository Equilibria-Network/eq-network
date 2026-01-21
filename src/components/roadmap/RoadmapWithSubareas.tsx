// src/components/roadmap/RoadmapWithSubareas.tsx
import React, { useState } from 'react';
import type { Subarea, WorkItem, WorkItemStatus } from '@content/roadmap';
import styles from './RoadmapWithSubareas.module.css';

// Status badge component
const StatusBadge: React.FC<{ status: WorkItemStatus }> = ({ status }) => {
  const statusConfig: Record<WorkItemStatus, { label: string; className: string }> = {
    'published': { label: 'Published', className: styles.statusPublished },
    'in-review': { label: 'In Review', className: styles.statusInReview },
    'active': { label: 'Active Development', className: styles.statusActive },
    'draft': { label: 'Draft', className: styles.statusDraft },
    'concept': { label: 'Concept', className: styles.statusConcept },
    'not-started': { label: 'Not Started', className: styles.statusNotStarted }
  };

  const config = statusConfig[status];
  return <span className={`${styles.statusBadge} ${config.className}`}>{config.label}</span>;
};

// Work item component
const WorkItemCard: React.FC<{ item: WorkItem }> = ({ item }) => (
  <div className={styles.workItem}>
    <div className={styles.workHeader}>
      <h5 className={styles.workTitle}>{item.title}</h5>
      <StatusBadge status={item.status} />
    </div>
    <p className={styles.workDescription}>{item.description}</p>
    {item.link ? (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.workLink}
      >
        View Document →
      </a>
    ) : (
      <span className={styles.linkPlaceholder}>Link to be added</span>
    )}
  </div>
);

// Subarea detail component - goal is already shown above, so skip it here
const SubareaDetail: React.FC<{ subarea: Subarea }> = ({ subarea }) => (
  <div className={styles.subareaDetail}>
    <section className={styles.section}>
      <h4 className={styles.sectionTitle}>Why This Matters</h4>
      <p className={styles.sectionText}>{subarea.why}</p>
    </section>

    {subarea.work.length > 0 && (
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Work So Far</h4>
        <div className={styles.workList}>
          {subarea.work.map((item, idx) => (
            <WorkItemCard key={idx} item={item} />
          ))}
        </div>
      </section>
    )}

    {subarea.missing.length > 0 && (
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>What's Missing</h4>
        <ul className={styles.list}>
          {subarea.missing.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>
    )}

    {subarea.collaboration.length > 0 && (
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Collaboration Opportunities</h4>
        <ul className={styles.list}>
          {subarea.collaboration.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>
    )}
  </div>
);

// Subarea card component - shows key info upfront
const SubareaCard: React.FC<{ subarea: Subarea }> = ({ subarea }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={styles.subareaCard}>
      {/* Always visible: header info */}
      <div className={styles.cardHeader}>
        <h3 className={styles.subareaTitle}>
          {subarea.number} {subarea.title}
        </h3>
        <StatusBadge status={subarea.status} />
      </div>

      {/* Always visible: summary and goal */}
      <p className={styles.subareaSummary}>{subarea.summary}</p>

      <div className={styles.goalSection}>
        <h4 className={styles.miniHeading}>Goal</h4>
        <p className={styles.goalText}>{subarea.goal}</p>
      </div>

      {/* Collapsible: detailed sections */}
      {(subarea.why || subarea.work.length > 0 || subarea.missing.length > 0 || subarea.collaboration.length > 0) && (
        <div className={styles.detailsToggle}>
          <button
            className={styles.toggleButton}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide details' : 'Show details'}
            <span className={styles.toggleIcon}>{showDetails ? '−' : '+'}</span>
          </button>
        </div>
      )}

      {showDetails && (
        <div className={styles.detailsContent}>
          <SubareaDetail subarea={subarea} />
        </div>
      )}
    </div>
  );
};

// Main subareas section component
export const SubareasSection: React.FC<{ subareas: Subarea[]; overview?: string }> = ({ subareas, overview }) => {
  if (!subareas || subareas.length === 0) return null;

  return (
    <div className={styles.subareasSection}>
      <h3 className={styles.subareasHeading}>Research Areas</h3>
      {overview && <p className={styles.subareasOverview}>{overview}</p>}
      <div className={styles.subareasGrid}>
        {subareas.map((subarea) => (
          <SubareaCard key={subarea.id} subarea={subarea} />
        ))}
      </div>
    </div>
  );
};
