// src/components/lab/PipelineSection.tsx
// "How the Lab works": the authoring pipeline shown through the actual
// interface design sketches (Excalidraw exports, embedded as images).
import styles from './PipelineSection.module.css';
import type { LabContent } from '@content/lab';

interface PipelineSectionProps {
  pipeline: LabContent['pipeline'];
}

export default function PipelineSection({ pipeline }: PipelineSectionProps) {
  return (
    <section id="pipeline" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{pipeline.title}</h2>
        <p className={styles.intro}>{pipeline.intro}</p>

        <div className={styles.steps}>
          {pipeline.steps.map((step, index) => (
            <div key={step.img} className={styles.step}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <div className={styles.stepText}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                </div>
              </div>
              <div className={styles.imageFrame}>
                <img src={step.img} alt={step.alt} loading="lazy" className={styles.image} />
              </div>
            </div>
          ))}
        </div>

        <p className={styles.note}>{pipeline.note}</p>
      </div>
    </section>
  );
}
