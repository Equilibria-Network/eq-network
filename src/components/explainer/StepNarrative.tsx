import React, { forwardRef } from 'react';
import styles from './StepNarrative.module.css';
import type { ExplainerStep } from '@content/explainer';

interface StepNarrativeProps {
  step: ExplainerStep;
  isActive: boolean;
  showSectionLabel?: boolean;
}

const SECTION_LABELS: Record<string, string> = {
  problem: 'The Problem',
  solution: 'The Solution',
};

const StepNarrative = forwardRef<HTMLDivElement, StepNarrativeProps>(
  ({ step, isActive, showSectionLabel = false }, ref) => (
    <div
      ref={ref}
      className={`${styles.step} ${isActive ? styles.active : ''}`}
      data-step={step.id}
    >
      {showSectionLabel && (
        <div className={`${styles.sectionLabel} ${styles[step.section]}`}>
          {SECTION_LABELS[step.section]}
        </div>
      )}
      <div className={styles.stepNumber}>Step {step.id}</div>
      <h2 className={styles.headline}>{step.headline}</h2>
      <p className={styles.body}>{step.body}</p>
    </div>
  )
);

StepNarrative.displayName = 'StepNarrative';
export default StepNarrative;
