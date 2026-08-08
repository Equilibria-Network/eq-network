import type { VisualEssayDocument, VisualEssayRendererProps } from '@components/visual-essay/types';
import VisualEssay from '@components/visual-essay/VisualEssay';
import CodePanel from './CodePanel';
import { manifest } from './fixtures';
import { futureViewsProse, librarySegments } from './script';
import type { LibraryProse, LibrarySegmentSpec } from './types';
import Visual from './Visual';
import './library-explainer.css';

/** The CI Library explainer as stacked VisualEssay segments (the promoted
    /showcase pattern): scroll selects the step, the step pins an artifact
    stage. Site-local on purpose — this page imports nothing from the
    playground workspace package, so no in-browser dynamics can creep in;
    every figure is a rendering of an engine-exported fixture. The contracts
    test enforces this by scanning these sources. */

function toDocument(segment: LibrarySegmentSpec): VisualEssayDocument<string> {
  return {
    eyebrow: segment.eyebrow,
    reference: 'library / how the engine thinks',
    title: segment.title,
    dek: '',
    scrollPrompt: 'Scroll',
    figureLabel: `${segment.title} — engine artifact`,
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

function SegmentBlock({ segment }: { segment: LibrarySegmentSpec }) {
  const document = toDocument(segment);
  const stepOf = new Map(segment.steps.map((step) => [step.id, step]));
  const SegmentVisual = (props: VisualEssayRendererProps<string>) => {
    const step = stepOf.get(props.activeState);
    if (!step) return null;
    return (
      <>
        <Visual stage={step.stage} />
        <CodePanel snippetId={step.snippetId} />
      </>
    );
  };
  return (
    <section className="libx-segment" id={segment.id}>
      <header className="libx-segment-head">
        <p className="libx-eyebrow">{segment.eyebrow}</p>
        <h2>{segment.title}</h2>
      </header>
      {segment.intro.length > 0 && (
        <div className="libx-segment-intro">
          {segment.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {segment.sketch && (
            <figure className="libx-sketch">
              <img src={segment.sketch.img} alt={segment.sketch.alt} loading="lazy" />
              <figcaption>
                Design sketch from the Lab — the interface in development; the engine underneath
                runs today.
              </figcaption>
            </figure>
          )}
        </div>
      )}
      <VisualEssay
        anchorPrefix={segment.id}
        document={document}
        showHeader={false}
        Visual={SegmentVisual}
      />
    </section>
  );
}

function ProseInterlude({ prose }: { prose: LibraryProse }) {
  return (
    <section className="libx-segment libx-prose" id={prose.id}>
      <header className="libx-segment-head">
        <p className="libx-eyebrow">{prose.eyebrow}</p>
        <h2>{prose.title}</h2>
      </header>
      <div className="libx-prose-blocks">
        {prose.blocks.map((block) => (
          <div key={block.heading} className="libx-prose-block">
            <h3>{block.heading}</h3>
            <p>{block.body}</p>
          </div>
        ))}
      </div>
      {prose.coda && <p className="libx-segment-intro libx-prose-coda">{prose.coda}</p>}
    </section>
  );
}

export default function LibraryExplainer() {
  return (
    <div className="libx">
      {librarySegments.map((segment) => (
        <div key={segment.id}>
          <SegmentBlock segment={segment} />
          {segment.id === 'spectral' && <ProseInterlude prose={futureViewsProse} />}
        </div>
      ))}
      <section className="libx-segment libx-closing" id="whitepaper">
        <header className="libx-segment-head">
          <p className="libx-eyebrow">Going deeper</p>
          <h2>The whitepaper</h2>
        </header>
        <div className="libx-segment-intro">
          <p>
            Everything this page showed — the one equation, the single state, declared effects, the
            derived order, the categorical algebra, the matrix view and its spectrum — is developed
            in full in the whitepaper,{' '}
            <em>
              The Collective Intelligence Library: Composable Mechanism Simulation and Measurement
              on Graphs
            </em>
            , an alpha-release working paper. It carries the assumptions behind each model and the
            measurement discipline the engine ships with.
          </p>
          <p>
            <a className="libx-whitepaper-link" href="/pdfs/cilib-whitepaper.pdf">
              Read the whitepaper — PDF
            </a>
          </p>
        </div>
      </section>
      <footer className="libx-provenance">
        <p>
          Every figure on this page renders artifacts exported by the engine —
          collective-intelligence-library {manifest.engine.version} @ {manifest.engine.git_rev},
          fixture set {manifest.created}. Nothing is simulated in the browser.
        </p>
      </footer>
    </div>
  );
}
