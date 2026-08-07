import { scenarioById } from '../../scenarios/registry';
import PlaygroundLite from '../PlaygroundLite';
import type { ShowcaseChapter } from '../types';

interface Props {
  chapter: ShowcaseChapter;
  /** Overrides the chapter's eyebrow so the scroll page can renumber the
      sequence without forking the canonical chapter. */
  eyebrow?: string;
}

/** The playable ending as one self-contained section: the canonical
    playable chapter's intro, dials, and link cards — the first and only
    element on the scroll page the reader must touch. */
export default function PlayableEnding({ chapter, eyebrow }: Props) {
  if (!chapter.scenario) throw new Error(`playable chapter ${chapter.id} names no scenario`);
  const definition = scenarioById[chapter.scenario];
  return (
    <section
      aria-labelledby={`scroll-${chapter.id}-title`}
      className="showcase-chapter kind-playable"
    >
      <header className="showcase-chapter-head">
        <p className="eyebrow">{eyebrow ?? chapter.eyebrow}</p>
        <h2 id={`scroll-${chapter.id}-title`}>{chapter.title}</h2>
      </header>
      <div className="showcase-intro">
        {chapter.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <PlaygroundLite chapter={chapter} definition={definition} />
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
  );
}
