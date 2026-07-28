// src/components/lab/Lab.tsx
import styles from './Lab.module.css';
import { labContent } from '@content/lab';
import LabHero from './LabHero';
import ReadingKey from './ReadingKey';
import ScenarioSection from './ScenarioSection';
import PipelineSection from './PipelineSection';
import Leaderboard from './Leaderboard';
import LabClosing from './LabClosing';

export default function Lab() {
  return (
    <div className={styles.page}>
      <LabHero hero={labContent.hero} />

      <section id="scenarios" className={styles.intro}>
        <div className={styles.introContainer}>
          <h2 className={styles.introTitle}>{labContent.scenariosIntro.title}</h2>
          <p className={styles.introBody}>{labContent.scenariosIntro.body}</p>
        </div>
      </section>

      <ReadingKey />

      {labContent.scenarios.map((scenario) => (
        <ScenarioSection key={scenario.id} scenario={scenario} />
      ))}

      <PipelineSection pipeline={labContent.pipeline} />

      <Leaderboard leaderboard={labContent.leaderboard} scenarios={labContent.scenarios} />

      <div className={styles.closingContainer}>
        <LabClosing closing={labContent.closing} />
      </div>
    </div>
  );
}
