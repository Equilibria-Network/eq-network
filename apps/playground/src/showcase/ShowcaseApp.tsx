import { scenarioById } from '../scenarios/registry';
import AssumptionCards from './AssumptionCards';
import ChapterStage from './ChapterStage';
import PlaygroundLite from './PlaygroundLite';
import { showcaseChapters } from './script';
import type { ShowcaseChapter } from './types';

function ChapterBody({ chapter }: { chapter: ShowcaseChapter }) {
  if (chapter.kind === 'model' && chapter.scenario) {
    return <ChapterStage chapter={chapter} definition={scenarioById[chapter.scenario]} />;
  }
  if (chapter.kind === 'playable' && chapter.scenario) {
    return <PlaygroundLite chapter={chapter} definition={scenarioById[chapter.scenario]} />;
  }
  if (chapter.blocks) {
    return <AssumptionCards blocks={chapter.blocks} />;
  }
  return null;
}

/** The guided showcase: an introduction to gradual disempowerment as one
    linear flow of chapters — prose, live model stages, plainly stated
    assumptions, and a playable coupled world at the end. */
export default function ShowcaseApp() {
  return (
    <div className="playground-shell showcase-shell">
      <div className="showcase-column">
        {showcaseChapters.map((chapter) => (
          <section
            aria-labelledby={`showcase-${chapter.id}-title`}
            className={`showcase-chapter kind-${chapter.kind}`}
            key={chapter.id}
          >
            <header className="showcase-chapter-head">
              <p className="eyebrow">{chapter.eyebrow}</p>
              <h2 id={`showcase-${chapter.id}-title`}>{chapter.title}</h2>
            </header>
            <div className="showcase-intro">
              {chapter.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ChapterBody chapter={chapter} />
            {chapter.links && (
              <nav aria-label="Where to go next" className="showcase-links">
                {chapter.links.map((link) => (
                  <a className="showcase-link-card" href={link.href} key={link.href}>
                    <strong>{link.label}</strong>
                    <span>{link.description}</span>
                  </a>
                ))}
              </nav>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
