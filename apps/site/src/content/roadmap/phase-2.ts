// src/content/roadmap/phase-2.ts

import type { RoadmapPhase } from './types';

export const phase2: RoadmapPhase = {
  id: 2,
  name: 'Construction',
  researcher: {
    fullName: 'Norbert Wiener',
    lastName: 'Wiener',
    image: '/img/roadmap/wiener.svg',
    bio: 'Mathematician and philosopher who founded cybernetics, establishing frameworks for understanding communication and control in complex systems.',
  },
  details: {
    tagline: 'Construction: Build new coordination mechanisms from cybernetic principles.',
    description:
      "With the cybernetic foundations established in Phase 1, this phase focuses on generating novel coordination mechanisms that improve on existing designs. Using the mathematical language and agent taxonomies developed earlier, we systematically construct new mechanisms—voting systems, resource allocation protocols, information aggregation methods—grounded in the formal frameworks of feedback, control, and communication that cybernetics provides. Wiener's insight that intelligent behavior emerges from circular causal processes guides the design: every mechanism we build must have clear feedback loops, measurable performance criteria, and well-understood failure modes. The goal is to produce a portfolio of candidate mechanisms that are theoretically grounded and ready for rigorous testing.",
  },
  publications: [],
};
