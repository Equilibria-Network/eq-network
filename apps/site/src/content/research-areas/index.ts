// src/content/research-areas/index.ts
//
// The research-areas page: four areas, each a short scroll story plus a
// shelf of pieces with honest status tags. Promoted 2026-08-20 (owner
// direction): the canonical page lives at /research, replacing the old
// pipeline graph; /research/prototype stays as the unlisted prototype route
// rendering the same component, per the prototype-programme pattern.
import { collectiveAgency } from './collective-agency';
import { dynamics } from './dynamics';
import { governance } from './governance';
import { infrastructure } from './infrastructure';
import type { ResearchAreasPageContent } from './types';

export type {
  AreaFigureLabels,
  AreaId,
  AreaPiece,
  AreaStep,
  AreaStepState,
  LegendEntry,
  LegendGlyph,
  PieceConfidence,
  PieceKind,
  PieceMarkersLegend,
  PieceProvenance,
  PieceStatus,
  ResearchArea,
  ResearchAreasPageContent,
} from './types';

export const researchAreas = [collectiveAgency, dynamics, governance, infrastructure];

export const researchAreasContent: ResearchAreasPageContent = {
  seo: {
    title: 'Research areas — Equilibria Network',
    description:
      'Four research areas, each shown as work in progress: when many agents become one, how fast a collective moves, how institutions keep their variety, and the simulation library where all of it gets tested.',
    canonicalPath: '/research',
  },
  header: {
    eyebrow: 'RESEARCH / AREAS',
    title: 'What we are working on',
    subtitle: 'Four research areas, each shown as work in progress.',
    summary:
      'Equilibria studies how groups of agents, human or artificial, come to act as one, how fast they move, and how the rules around them hold up. Each area below opens with its question, shows the picture we are working from, and lists the pieces so far with an honest status tag. Working papers change. The tags say where each piece stands.',
  },
  ui: {
    indexEyebrow: 'Four areas',
    indexHint:
      'Every piece on this page carries a status tag, most carry a confidence tag, and some carry a provenance tag. The legend below says what each one means. Drafts and in-progress items are named so you can see what is coming; ask if you want an early copy.',
    piecesLabel: 'pieces',
    scrollPrompt: 'Scroll',
    figureStatusLabel: 'Beat',
    shelfEyebrow: 'The pieces so far',
    shelfNote:
      'Titles link to public copies where one exists. Descriptions say what each piece asks and how it goes about it, not what it found. Numbers live in the papers.',
    readLabel: 'Read',
    notPublicLabel: 'Not yet public',
    statusLabels: {
      published: 'Published',
      accepted: 'Accepted',
      'working-paper': 'Working paper',
      draft: 'Draft',
      'in-progress': 'In progress',
      notes: 'Notes',
    },
    confidenceLabels: {
      high: 'High confidence',
      medium: 'Medium confidence',
      low: 'Low confidence',
    },
    provenanceLabels: {
      'ai-drafted': 'AI-drafted',
      'ai-assisted': 'AI-assisted',
    },
    markers: {
      eyebrow: 'How to read the tags',
      intro:
        'Status says where a piece stands in the world. Confidence says how much we ourselves would bet on its central claims today. Provenance says how the text was made, when AI did a real share of the writing. The three are independent: a working paper can be high confidence, and a published post can be low.',
      statusNote:
        'Published and accepted work has been reviewed by someone else. Working papers are public and still changing.',
      confidence: {
        high: 'We believe in the core argument.',
        medium: 'We stand behind the model, and we expect to change it in the future.',
        low: 'An exploratory direction, which may or may not hold up.',
      },
      provenance: {
        'ai-drafted':
          'A language model wrote a large part of the text under our direction. We set the question and the frame and read the result.',
        'ai-assisted': 'AI helped with parts of the writing or the derivations.',
      },
    },
    kindLabels: {
      paper: 'Paper',
      post: 'Post',
      note: 'Note',
      software: 'Software',
    },
    closingLabel: 'Where to go next',
  },
  closing: {
    headline: 'This is a map, not a finish line',
    body: 'Most of what is here is unfinished on purpose. We publish the question and the setup early so people can push on the frame before the results harden. If one of these areas is close to your own work, write to us. The library explainer, the showcase, and the newsletter are the three doors in.',
    links: [
      {
        href: '/library/explanation',
        label: 'Inside the CI Library',
        description: 'The engine explained by its own artifacts',
      },
      {
        href: '/showcase',
        label: 'Showcase: gradual disempowerment',
        description: 'Watch the coupled models run, then take the dials',
      },
      {
        href: 'https://equilibria1.substack.com',
        label: 'Newsletter',
        description: 'Essays and working notes as they land',
      },
      {
        href: '/about',
        label: 'About and contact',
        description: 'Who we are and how to reach us',
      },
    ],
  },
  areas: researchAreas,
};

export const researchAreasPrototypeContent: ResearchAreasPageContent = {
  ...researchAreasContent,
  seo: {
    ...researchAreasContent.seo,
    title: 'Research areas — prototype — Equilibria Network',
    canonicalPath: '/research/prototype',
    noindex: true,
  },
};
