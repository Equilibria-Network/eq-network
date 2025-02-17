// src/components/Projects/ProjectCard.js
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import DetailedProjectView from './DetailedProjectView';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ project }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.shortDescription}</p>
      </div>

      <div className={`${styles.expandedContent} ${isExpanded ? styles.expanded : ''}`}>
        <DetailedProjectView project={project} />
      </div>

      <button 
        className={styles.expandButton}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
    </div>
  );
}
