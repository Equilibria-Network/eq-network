import React, { forwardRef } from 'react';
import styles from './StepNarrative.module.css';
import { explainerContent, type ExplainerStep } from '@content/explainer';

interface StepNarrativeProps {
  step: ExplainerStep;
  isActive: boolean;
  showSectionLabel?: boolean;
}

const StepNarrative = forwardRef<HTMLDivElement, StepNarrativeProps>(
  ({ step, isActive, showSectionLabel = false }, ref) => (
    <div
      ref={ref}
      className={`${styles.step} ${isActive ? styles.active : ''}`}
      data-step={step.id}
    >
      {showSectionLabel && (
        <div className={`${styles.sectionLabel} ${styles[step.section]}`}>
          {explainerContent.ui.sectionLabels[step.section]}
        </div>
      )}
      <div className={styles.stepNumber}>
        {explainerContent.ui.stepPrefix}
        {step.id}
      </div>
      <h2 className={styles.headline}>{step.headline}</h2>
      <p className={styles.body}>{step.body}</p>
    </div>
  )
);

StepNarrative.displayName = 'StepNarrative';
export default StepNarrative;
