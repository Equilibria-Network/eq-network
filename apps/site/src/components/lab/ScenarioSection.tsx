// src/components/lab/ScenarioSection.tsx
import React from 'react';
import styles from './ScenarioSection.module.css';
import StatusChip from './StatusChip';
import ScenarioVisual from './visuals/ScenarioVisual';
import { labContent, type Scenario } from '@content/lab';

const { scenario: scenarioUi } = labContent.ui;

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
              <span className={styles.orderLabel}>
                {scenarioUi.orderPrefix}
                {scenario.order}
              </span>
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
              <h3 className={styles.subsectionTitle}>{scenarioUi.dynamicTitle}</h3>
              <p className={styles.subsectionText}>{scenario.dynamic}</p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>{scenarioUi.inTheLabTitle}</h3>
              <p className={styles.subsectionText}>{scenario.example}</p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>{scenarioUi.measuresTitle}</h3>
              <ul className={styles.defenseList}>
                {scenario.measures.map((measure) => (
                  <li key={measure} className={styles.defenseItem}>
                    {measure}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>{scenarioUi.defensesTitle}</h3>
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
                <summary className={styles.assumptionsSummary}>
                  {scenarioUi.assumptionsSummary}
                </summary>
                <ul className={styles.assumptionsList}>
                  {scenario.assumptions.map((a) => (
                    <li key={a.text} className={styles.assumptionsItem}>
                      {a.text}
                      {a.omits && (
                        <span className={styles.assumptionsOmits}>
                          {scenarioUi.omitsPrefix}
                          {a.omits}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                {scenario.playgroundHref && (
                  <a className={styles.assumptionsPlayground} href={scenario.playgroundHref}>
                    Full modelling notes sit beside the sliders in the playground →
                  </a>
                )}
              </details>
            )}

            {scenario.engineNote && <p className={styles.engineNote}>{scenario.engineNote}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
