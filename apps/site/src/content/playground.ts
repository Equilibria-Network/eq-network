import type { PageHeaderContent, PageSeo } from './types/page';

export interface PlaygroundPageContent {
  seo: PageSeo;
  header: PageHeaderContent;
}

export const playgroundPageContent: PlaygroundPageContent = {
  seo: {
    title: 'Collective Intelligence Playground — Equilibria Network',
    description:
      'Stress-test coordination mechanisms in five interactive, browser-based agent models.',
    canonicalPath: '/playground',
  },
  header: {
    eyebrow: 'CI LAB / INTERACTIVE MODEL',
    title: 'Collective intelligence playground',
    subtitle:
      'A laboratory to play with and stress-test coordination systems in agent-based models.',
    summary:
      'Usually coordination systems are tested in the real world, on real communities with real stakes. Our CI playground is a simulation framework in which markets, networks, and democratic processes operate as composable graph transformations, so mechanism designers can introduce adversaries, watch coordination fail, and iterate on system-level defenses before deployment. You can go through some scenarios below, play with the model, and edit the parameters to see different dynamics play out.',
  },
};
