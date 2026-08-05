import type { PageHeaderContent, PageSeo } from './types/page';

export interface ShowcasePageContent {
  seo: PageSeo;
  header: PageHeaderContent;
}

export const showcasePageContent: ShowcasePageContent = {
  seo: {
    title: 'An Introduction to Gradual Disempowerment — Equilibria Network',
    description:
      'Why stories of the AI transition are hard to see inside, and what running the system shows: agent-based simulations of an economy, a polity, and a culture coupled by money.',
    canonicalPath: '/showcase',
    // Prototype gate (task-0006): stays noindex until owner copy review.
    noindex: true,
  },
  header: {
    eyebrow: 'CI LAB / SHOWCASE',
    title: 'An introduction to gradual disempowerment',
    subtitle:
      'Watch influence drain out of human hands in simulated societies — then try to stop it.',
    summary:
      'Scenario forecasts of the AI transition are hard to see inside, and gradual disempowerment is the hardest case: economy, culture, and politics coupled in feedback loops that stories cannot track. This page runs the system instead. Watch agent-based simulations from the Collective Intelligence Library play out, read the assumptions behind them, then take the dials yourself.',
  },
};
