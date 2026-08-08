import type { PageHeaderContent, PageSeo } from './types/page';

/** The CI Library explainer. Promoted 2026-08-08 (owner direction): the
    canonical page lives at /library/explanation and sits in the nav under
    "CI Library"; /library/prototype stays as the unlisted prototype route
    rendering the same component, per the prototype-programme pattern the
    showcase followed. This file is the shared copy source for both. */
export interface LibraryPageContent {
  seo: PageSeo;
  header: PageHeaderContent;
}

const header: PageHeaderContent = {
  eyebrow: 'CI Library',
  title: 'Inside the Collective Intelligence Library',
  subtitle: 'The engine behind the simulations, explained by its own artifacts.',
  summary:
    'A market, a network, and a democracy as the same kind of object: named fields over one population, changed by pure functions with declared effects. Scroll to see the engine derive its own execution order, draw its own system graphs, and compose its institutions the way category theory says functions compose.',
};

const description =
  'How the Collective Intelligence Library thinks: one state, pure transforms with declared effects, timing as data, a compiler that derives execution order, and the categorical algebra that makes institutions compose.';

export const libraryExplanationContent: LibraryPageContent = {
  seo: {
    title: 'Inside the Collective Intelligence Library — Equilibria Network',
    description,
    canonicalPath: '/library/explanation',
  },
  header,
};

export const libraryPrototypeContent: LibraryPageContent = {
  seo: {
    title: 'Inside the Collective Intelligence Library — prototype — Equilibria Network',
    description,
    canonicalPath: '/library/prototype',
    noindex: true,
  },
  header,
};
