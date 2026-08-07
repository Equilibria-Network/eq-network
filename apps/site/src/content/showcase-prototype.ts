import { showcasePageContent, type ShowcasePageContent } from './showcase';

/** The scroll-story prototype of /showcase (task-0007 P1). Same typed
    header content as the canonical page per the prototype rule; only the
    SEO identity differs, and the route stays noindex until promotion. */
export const showcaseScrollPrototypeContent: ShowcasePageContent = {
  seo: {
    ...showcasePageContent.seo,
    title: 'An Introduction to Gradual Disempowerment — scroll prototype — Equilibria Network',
    canonicalPath: '/showcase/prototype',
    noindex: true,
  },
  header: showcasePageContent.header,
};
