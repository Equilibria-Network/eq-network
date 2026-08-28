// src/content/research-areas/types.ts
//
// Typed contract for the "research areas" page: one scroll story per area
// (question -> why -> how it looks -> what is open), followed by a shelf of
// the pieces that belong to that area, each with an honest status tag.
// Page copy and figure labels live here; geometry lives with the figure.
import type { PageHeaderContent, PageSeo } from '../types/page';

export type AreaId = 'collective-agency' | 'dynamics' | 'governance' | 'infrastructure';

/** The four beats every area walks through. The figure keys its scenes on this. */
export type AreaStepState = 'question' | 'why' | 'shape' | 'open';

export interface AreaStep {
  state: AreaStepState;
  /** Short stage label shown above the headline ("The question", ...). */
  stageLabel: string;
  headline: string;
  body: string;
}

export type PieceKind = 'paper' | 'post' | 'note' | 'software';

/**
 * Where a piece stands. Kept deliberately coarse and honest:
 * - published: peer-reviewed or publicly posted in final form
 * - accepted: accepted at a venue, camera-ready pending or done
 * - working-paper: complete draft, public, still changing
 * - draft: written but not yet public
 * - in-progress: being built or written now
 * - notes: exploratory notes only
 */
export type PieceStatus =
  'published' | 'accepted' | 'working-paper' | 'draft' | 'in-progress' | 'notes';

/**
 * Our own credence that the piece's central claims hold up, today. This is
 * separate from status: a working paper can be high confidence, a published
 * post can be low. Absent means we have not rated it yet (early drafts).
 */
export type PieceConfidence = 'high' | 'medium' | 'low';

/**
 * How the text was produced, when AI did a meaningful share of the writing.
 * Absent means written by hand.
 * - ai-drafted: a language model wrote a large part of the text under our
 *   direction; we set the question and the frame and read the result
 * - ai-assisted: AI helped with parts of the writing or the derivations
 */
export type PieceProvenance = 'ai-drafted' | 'ai-assisted';

export interface AreaPiece {
  id: string;
  title: string;
  kind: PieceKind;
  status: PieceStatus;
  confidence?: PieceConfidence;
  provenance?: PieceProvenance;
  year?: number;
  /** One sentence: the question the piece asks. */
  asks: string;
  /** One sentence: what kind of object it is (a model, an argument, a synthesis). Setups, not results. */
  setup: string;
  /** Public link. Absent means the piece is not public yet. */
  href?: string;
  /** Venue or channel, when there is one ("IWAI 2026, oral", "Substack"). */
  venue?: string;
}

export type LegendGlyph =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'capsule'
  | 'dashed-loop'
  | 'solid-loop'
  | 'line'
  | 'dashed-line'
  | 'strong-line'
  | 'arrow'
  | 'dashed-arrow'
  | 'dotted-arrow'
  | 'bar'
  | 'wave'
  | 'attenuator'
  | 'amplifier';

export interface LegendEntry {
  glyph: LegendGlyph;
  label: string;
}

/** Copy the figure draws inside the SVG. Geometry and seeds stay in the component. */
export interface AreaFigureLabels {
  /** Accessible title and description for the SVG. */
  title: string;
  description: string;
  /** Scene caption per state, drawn at the top of the figure. */
  captions: Record<AreaStepState, string>;
  /** Free-form annotation strings the figure places by key. */
  annotations: Record<string, string>;
  legend: LegendEntry[];
}

/** One sentence per tag value, so a reader can tell the axes apart. */
export interface PieceMarkersLegend {
  eyebrow: string;
  intro: string;
  statusNote: string;
  confidence: Record<PieceConfidence, string>;
  provenance: Record<PieceProvenance, string>;
}

export interface ResearchArea {
  id: AreaId;
  /** 1-based, used for the "01 / 04" marks. */
  index: number;
  /** "AREA 01 / COLLECTIVE AGENCY" */
  eyebrow: string;
  name: string;
  /** One line for the index strip at the top of the page. */
  oneLiner: string;
  /** One or two short paragraphs above the scroll story. */
  intro: string[];
  figureLabel: string;
  steps: AreaStep[];
  pieces: AreaPiece[];
  figure: AreaFigureLabels;
}

export interface ResearchAreasClosingLink {
  href: string;
  label: string;
  description: string;
}

export interface ResearchAreasPageContent {
  seo: PageSeo;
  header: PageHeaderContent;
  ui: {
    indexEyebrow: string;
    indexHint: string;
    piecesLabel: string;
    scrollPrompt: string;
    figureStatusLabel: string;
    shelfEyebrow: string;
    /** The honesty line printed above every shelf. */
    shelfNote: string;
    readLabel: string;
    notPublicLabel: string;
    statusLabels: Record<PieceStatus, string>;
    confidenceLabels: Record<PieceConfidence, string>;
    provenanceLabels: Record<PieceProvenance, string>;
    kindLabels: Record<PieceKind, string>;
    /** The legend that explains the three tag axes, printed under the index strip. */
    markers: PieceMarkersLegend;
    closingLabel: string;
  };
  closing: {
    headline: string;
    body: string;
    links: ResearchAreasClosingLink[];
  };
  areas: ResearchArea[];
}
