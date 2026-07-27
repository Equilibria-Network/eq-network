// src/components/lab/ScenarioSection.tsx
import React from 'react';
import styles from './ScenarioSection.module.css';
import StatusChip from './StatusChip';
import ScenarioVisual from './visuals/ScenarioVisual';
import type { Scenario } from '@content/lab';

interface ScenarioSectionProps {
  scenario: Scenario;
}

export default function ScenarioSection({ scenario }: ScenarioSectionProps) {
  return (
    <section id={`scenario-${scenario.id}`} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.visualColumn}>
            <ScenarioVisual scenario={scenario} className={styles.visualFrame} />
          </div>

          <div className={styles.textColumn}>
            <div className={styles.metaRow}>
              <StatusChip status={scenario.status} />
              <span className={styles.orderLabel}>Scenario {scenario.order}</span>
            </div>

            <h2 className={styles.title}>{scenario.name}</h2>

            <p className={styles.anchor}>
              {scenario.anchor.href ? (
                <a href={scenario.anchor.href} target="_blank" rel="noopener noreferrer">
                  {scenario.anchor.label}
                </a>
              ) : (
                scenario.anchor.label
              )}
            </p>

            <p className={styles.story}>{scenario.story}</p>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>The dynamic</h3>
              <p className={styles.subsectionText}>{scenario.dynamic}</p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>In the Lab</h3>
              <p className={styles.subsectionText}>{scenario.example}</p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>What we measure</h3>
              <ul className={styles.defenseList}>
                {scenario.measures.map((measure) => (
                  <li key={measure} className={styles.defenseItem}>
                    {measure}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Defenses to try</h3>
              <ul className={styles.defenseList}>
                {scenario.defenses.map((defense) => (
                  <li key={defense} className={styles.defenseItem}>
                    {defense}
                  </li>
                ))}
              </ul>
            </div>

            {scenario.assumptions && scenario.assumptions.length > 0 && (
              <details className={styles.assumptions}>
                <summary className={styles.assumptionsSummary}>Modelling assumptions</summary>
                <ul className={styles.assumptionsList}>
                  {scenario.assumptions.map((a) => (
                    <li key={a.text} className={styles.assumptionsItem}>
                      {a.text}
                      {a.omits && <span className={styles.assumptionsOmits}> — leaves out: {a.omits}</span>}
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {scenario.engineNote && <p className={styles.engineNote}>{scenario.engineNote}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
