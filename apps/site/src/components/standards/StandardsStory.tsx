// The simulation-standards page in the research page's shape: a chapter head,
// a VisualEssay whose figure changes with the beat, then the requirements
// as a numbered list, the validation levels, and a closing with links. Copy comes from
// content/standards; geometry lives with the figure; page chrome and the pen
// are shared with the research-areas story.
import type { VisualEssayDocument, VisualEssayRendererProps } from '@components/visual-essay/types';
import VisualEssay from '@components/visual-essay/VisualEssay';
import { standardsContent, type StandardsStepState } from '@content/standards';
import ra from '@components/research-areas/research-areas.module.css';
import StandardsFigure from './StandardsFigure';
import styles from './standards.module.css';

const content = standardsContent;

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function toDocument(): VisualEssayDocument<StandardsStepState> {
  const essay = content.essay;
  return {
    eyebrow: essay.eyebrow,
    reference: essay.reference,
    title: essay.title,
    dek: '',
    scrollPrompt: content.ui.scrollPrompt,
    figureLabel: essay.figureLabel,
    statusLabel: content.ui.figureStatusLabel,
    steps: essay.steps.map((step, index) => ({
      id: index + 1,
      state: step.state,
      section: step.stageLabel,
      sectionLabel: step.stageLabel,
      stageLabel: step.stageLabel,
      headline: step.headline,
      body: step.body,
    })),
  };
}

function Visual(props: VisualEssayRendererProps<StandardsStepState>) {
  return <StandardsFigure state={props.activeState} labels={content.figure} />;
}

function ChapterHead() {
  return (
    <header className={`${ra.column} ${ra.chapterHead}`}>
      <div className={ra.rule}>
        <span>{content.essay.eyebrow}</span>
      </div>
      <div className={ra.chapterGrid}>
        <h2>{content.essay.title}</h2>
        <div className={ra.chapterIntro}>
          {content.essay.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </header>
  );
}

function Requirements() {
  const s = content.requirements;
  return (
    <section className={`${ra.column} ${styles.section}`} id="requirements" aria-label={s.headline}>
      <div className={ra.rule}>
        <span>{s.eyebrow}</span>
      </div>
      <div className={styles.sectionGrid}>
        <div className={styles.intro}>
          <h2>{s.headline}</h2>
          {s.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div>
          <ol className={styles.items}>
            {s.items.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
          <p className={styles.note}>{s.note}</p>
        </div>
      </div>
    </section>
  );
}

function Levels() {
  const l = content.levels;
  return (
    <section className={`${ra.column} ${styles.section}`} id="levels" aria-label={l.headline}>
      <div className={ra.rule}>
        <span>{l.eyebrow}</span>
      </div>
      <div className={styles.sectionGrid}>
        <div className={styles.intro}>
          <h2>{l.headline}</h2>
          <p>{l.intro}</p>
        </div>
        <div>
          <ol className={styles.levels}>
            {l.items.map((level) => (
              <li key={level.code}>
                <span className={styles.levelCode}>{level.code}</span>
                <h3 className={styles.levelName}>{level.name}</h3>
                <p>{level.body}</p>
              </li>
            ))}
          </ol>
          <p className={styles.note}>{l.note}</p>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  const c = content.closing;
  return (
    <section className={`${ra.column} ${ra.closing}`}>
      <div className={ra.rule}>
        <span>{c.label}</span>
      </div>
      <div className={ra.closingGrid}>
        <div>
          <h2>{c.headline}</h2>
          <p>{c.body}</p>
        </div>
        <div className={ra.linkGrid}>
          {c.links.map((link, index) => {
            const external = link.href.startsWith('http');
            return (
              <a href={link.href} key={link.href} rel={external ? 'noopener' : undefined}>
                <span>{pad(index + 1)}</span>
                <strong>{link.label}</strong>
                <small>{link.description}</small>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function StandardsStory() {
  const document = toDocument();
  return (
    <div className={ra.root}>
      {/* The shared hatch pattern the figure's hatched marks reference. */}
      <svg className={ra.defs} aria-hidden="true" focusable="false">
        <defs>
          <pattern
            id="ra-hatch"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <path className={ra.hatchLine} d="M0 0V6" />
          </pattern>
        </defs>
      </svg>
      <ChapterHead />
      <VisualEssay anchorPrefix="story" document={document} showHeader={false} Visual={Visual} />
      <Requirements />
      <Levels />
      <Closing />
    </div>
  );
}
