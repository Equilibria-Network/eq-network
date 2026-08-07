import { useEffect } from 'react';
import Leaderboard from '@components/lab/Leaderboard';
import type { VisualEssayDocument, VisualEssayRendererProps } from '@components/visual-essay/types';
import VisualEssay from '@components/visual-essay/VisualEssay';
import { showcaseLeaderboard, showcaseLeaderboardScenarios } from '@content/showcase-leaderboard';
import {
  AssumptionCards,
  PlayableEnding,
  prewarmScrollTrajectories,
  ScrollStage,
  scrollFlow,
  type ScrollSegment,
} from '@eq-network/playground/showcase-scroll';

/** The showcase as a scroll story (task-0007, promoted to the canonical
    /showcase on owner direction 2026-08-07; /showcase/prototype mounts the
    same component): the compressed arc as stacked VisualEssay segments —
    scroll selects the state, the simulation stages itself, and the reader
    touches nothing until the playable ending. The essay shell is the
    site's; every simulation-facing piece comes from the playground
    package. */

function toDocument(segment: ScrollSegment): VisualEssayDocument<string> {
  return {
    eyebrow: segment.eyebrow,
    reference: 'showcase / gradual disempowerment',
    title: segment.title,
    dek: '',
    scrollPrompt: 'Scroll',
    figureLabel: `${segment.title} — live simulation`,
    statusLabel: 'State',
    steps: segment.steps.map((step, index) => ({
      id: index + 1,
      state: step.id,
      section: segment.id,
      sectionLabel: segment.eyebrow,
      stageLabel: step.stageLabel,
      headline: step.headline,
      body: step.body,
    })),
  };
}

function SegmentBlock({ segment }: { segment: ScrollSegment }) {
  const document = toDocument(segment);
  const Visual = (props: VisualEssayRendererProps<string>) => (
    <ScrollStage segment={segment} state={props.activeState} />
  );
  return (
    <section className="scroll-segment" id={segment.id}>
      <header className="showcase-chapter-head scroll-segment-head">
        <p className="eyebrow">{segment.eyebrow}</p>
        <h2>{segment.title}</h2>
      </header>
      {segment.intro.length > 0 && (
        <div className="showcase-intro scroll-segment-intro">
          {segment.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
      <VisualEssay
        anchorPrefix={segment.id}
        document={document}
        showHeader={false}
        Visual={Visual}
      />
    </section>
  );
}

export default function ShowcaseScroll() {
  useEffect(() => {
    // Warm every staged trajectory off the critical path so scrolling never
    // waits on a run; per-run and total cost land in the console (P1's
    // measurement requirement).
    const idle: (callback: () => void) => number =
      typeof window.requestIdleCallback === 'function'
        ? (callback) => window.requestIdleCallback(callback)
        : (callback) => window.setTimeout(callback, 400);
    idle(() => {
      void prewarmScrollTrajectories();
    });
  }, []);

  return (
    <div className="playground-shell showcase-shell showcase-scroll">
      {scrollFlow.map((item) => {
        if (item.kind === 'segment') {
          return <SegmentBlock key={item.id} segment={item} />;
        }
        if (item.kind === 'assumptions') {
          return (
            <section className="showcase-column scroll-interlude" key={item.id}>
              <p className="eyebrow">{item.eyebrow}</p>
              <AssumptionCards blocks={item.blocks} />
            </section>
          );
        }
        if (item.kind === 'leaderboard') {
          // The /lab leaderboard component with the showcase's own board:
          // only this page's scenarios, rows as defense portfolios.
          return (
            <section className="showcase-column scroll-interlude" id={item.id} key={item.id}>
              <p className="eyebrow">{item.eyebrow}</p>
              <div className="showcase-intro">
                {item.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <Leaderboard
                firstColumnHeader="Portfolio"
                leaderboard={showcaseLeaderboard}
                scenarios={showcaseLeaderboardScenarios}
              />
            </section>
          );
        }
        if (item.kind === 'prose') {
          return (
            <section
              aria-labelledby={`scroll-${item.id}-title`}
              className="showcase-column scroll-interlude"
              key={item.id}
            >
              <header className="showcase-chapter-head">
                <p className="eyebrow">{item.eyebrow}</p>
                <h2 id={`scroll-${item.id}-title`}>{item.title}</h2>
              </header>
              <div className="showcase-intro scroll-prose">
                {item.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {item.links && (
                <nav aria-label="Where to go next" className="showcase-links">
                  {item.links.map((link) => (
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
        return (
          <div className="showcase-column scroll-interlude" key={item.id}>
            <PlayableEnding chapter={item.chapter} eyebrow={item.eyebrow} />
          </div>
        );
      })}
    </div>
  );
}
