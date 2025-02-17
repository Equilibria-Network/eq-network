// src/components/Projects/ProjectList.js
import React from 'react';
import ProjectCard from './ProjectCard';
import styles from './ProjectList.module.css';

export default function ProjectList({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyStateText}>
          No projects available at this time.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {projects.map((project, index) => (
        <div 
          key={project.id} 
          className={styles.projectWrapper}
          style={{ 
            animationDelay: `${index * 0.15}s` 
          }}
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}
