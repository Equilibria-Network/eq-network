// src/content/research-areas/index.ts
//
// The research-areas page: four areas, each a short scroll story plus a
// shelf of pieces with honest status tags. Prototype route only
// (/research/prototype, noindex) until the owner promotes it; the canonical
// /research page is unchanged.
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
  PieceKind,
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
    canonicalPath: '/research/prototype',
    // Prototype gate (task-0009 programme): noindex until owner review.
    noindex: true,
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
      'Every piece on this page carries a status tag. Published and accepted work has been reviewed by someone else. Working papers are public and still changing. Drafts and in-progress items are named so you can see what is coming; ask if you want an early copy.',
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
