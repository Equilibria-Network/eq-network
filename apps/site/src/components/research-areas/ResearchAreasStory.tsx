// The research-areas page as stacked scroll stories, in the showcase's
// shape: an index strip, then per area a chapter head, a VisualEssay whose
// figure changes with the beat, and a shelf of the area's pieces with status
// tags. Copy and figure labels come from content/research-areas; geometry
// lives with the figures.
import type { VisualEssayDocument, VisualEssayRendererProps } from '@components/visual-essay/types';
import VisualEssay from '@components/visual-essay/VisualEssay';
import { researchAreasContent } from '@content/research-areas';
import type {
  AreaPiece,
  AreaStepState,
  PieceStatus,
  ResearchArea,
} from '@content/research-areas/types';
import AreaFigure from './AreaFigure';
import styles from './research-areas.module.css';

const content = researchAreasContent;

const STATUS_CLASS: Record<PieceStatus, string> = {
  published: styles.statusPublished,
  accepted: styles.statusAccepted,
  'working-paper': styles.statusWorking,
  draft: styles.statusDraft,
  'in-progress': styles.statusProgress,
  notes: styles.statusNotes,
};

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function toDocument(area: ResearchArea): VisualEssayDocument<AreaStepState> {
  return {
    eyebrow: area.eyebrow,
    reference: `research / area ${pad(area.index)}`,
    title: area.name,
    dek: '',
    scrollPrompt: content.ui.scrollPrompt,
    figureLabel: area.figureLabel,
    statusLabel: content.ui.figureStatusLabel,
    steps: area.steps.map((step, index) => ({
      id: index + 1,
      state: step.state,
      section: area.id,
      sectionLabel: area.eyebrow,
      stageLabel: step.stageLabel,
      headline: step.headline,
      body: step.body,
    })),
  };
}

function IndexStrip() {
  return (
    <nav className={`${styles.column} ${styles.index}`} aria-label={content.ui.indexEyebrow}>
      <div className={styles.rule}>
        <span>{content.ui.indexEyebrow}</span>
      </div>
      <div className={styles.indexGrid}>
        {content.areas.map((area) => (
          <a className={styles.indexCard} href={`#${area.id}`} key={area.id}>
            <span>
              {pad(area.index)} / {pad(content.areas.length)}
            </span>
            <strong>{area.name}</strong>
            <p>{area.oneLiner}</p>
            <small>
              {area.pieces.length} {content.ui.piecesLabel}
            </small>
          </a>
        ))}
      </div>
      <p className={styles.indexHint}>{content.ui.indexHint}</p>
    </nav>
  );
}

function PieceCard({ piece }: { piece: AreaPiece }) {
  const status = content.ui.statusLabels[piece.status];
  const kind = content.ui.kindLabels[piece.kind];
  const external = piece.href?.startsWith('http');
  return (
    <article className={styles.piece}>
      <div className={styles.pieceMeta}>
        <span className={`${styles.status} ${STATUS_CLASS[piece.status]}`}>{status}</span>
        <span>{kind}</span>
        {piece.year && <span>{piece.year}</span>}
        {piece.venue && <span>{piece.venue}</span>}
      </div>
      <h3>
        {piece.href ? (
          <a href={piece.href} rel={external ? 'noopener' : undefined}>
            {piece.title}
          </a>
        ) : (
          piece.title
        )}
      </h3>
      <p className={styles.pieceBody}>
        <em>{piece.asks}</em> {piece.setup}
      </p>
      <div className={styles.pieceFoot}>
        {piece.href ? (
          <a href={piece.href} rel={external ? 'noopener' : undefined}>
            {content.ui.readLabel} →
          </a>
        ) : (
          <span>{content.ui.notPublicLabel}</span>
        )}
      </div>
    </article>
  );
}

function AreaBlock({ area }: { area: ResearchArea }) {
  const document = toDocument(area);
  const Visual = (props: VisualEssayRendererProps<AreaStepState>) => (
    <AreaFigure area={area} state={props.activeState} />
  );
  return (
    <section className={styles.area} id={area.id}>
      <header className={`${styles.column} ${styles.chapterHead}`}>
        <div className={styles.rule}>
          <span>{area.eyebrow}</span>
        </div>
        <div className={styles.chapterGrid}>
          <h2>{area.name}</h2>
          <div className={styles.chapterIntro}>
            {area.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </header>
      <VisualEssay anchorPrefix={area.id} document={document} showHeader={false} Visual={Visual} />
      <section
        className={`${styles.column} ${styles.shelf}`}
        aria-label={`${area.name}: ${content.ui.shelfEyebrow}`}
      >
        <div className={styles.rule}>
          <span>
            {content.ui.shelfEyebrow} · {area.pieces.length} {content.ui.piecesLabel}
          </span>
        </div>
        <p className={styles.shelfNote}>{content.ui.shelfNote}</p>
        <div className={styles.shelfGrid}>
          {area.pieces.map((piece) => (
            <PieceCard key={piece.id} piece={piece} />
          ))}
        </div>
      </section>
    </section>
  );
}

function Closing() {
  return (
    <section className={`${styles.column} ${styles.closing}`}>
      <div className={styles.rule}>
        <span>{content.ui.closingLabel}</span>
      </div>
      <div className={styles.closingGrid}>
        <div>
          <h2>{content.closing.headline}</h2>
          <p>{content.closing.body}</p>
        </div>
        <div className={styles.linkGrid}>
          {content.closing.links.map((link, index) => (
            <a href={link.href} key={link.href}>
              <span>{pad(index + 1)}</span>
              <strong>{link.label}</strong>
              <small>{link.description}</small>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ResearchAreasStory() {
  return (
    <div className={styles.root}>
      {/* One shared hatch pattern for every figure on the page. */}
      <svg className={styles.defs} aria-hidden="true" focusable="false">
        <defs>
          <pattern
            id="ra-hatch"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <path className={styles.hatchLine} d="M0 0V6" />
          </pattern>
        </defs>
      </svg>
      <IndexStrip />
      {content.areas.map((area) => (
        <AreaBlock key={area.id} area={area} />
      ))}
      <Closing />
    </div>
  );
}
