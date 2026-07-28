// src/content/roadmap/phase-4.ts

import type { RoadmapPhase } from './types';

export const phase4: RoadmapPhase = {
  id: 4,
  name: 'Validation',
  researcher: {
    fullName: 'Elinor Ostrom',
    lastName: 'Ostrom',
    image: '/img/roadmap/ostrom.webp',
    bio: 'Nobel Prize-winning political economist who demonstrated through empirical research how communities successfully govern shared resources without centralized control.',
  },
  details: {
    tagline: 'Validation: Test in multiple domains to build confidence',
    description:
      'Testing mechanisms in one domain proves the concept works. But if you want to claim your simulations are reliable—that they actually predict real-world outcomes—you need evidence across multiple contexts. This phase is about building confidence: do mechanisms that perform well in simulation consistently succeed when actually implemented in real-world situations? After the RL and LLM environments from Phase 3 have identified which mechanisms are robust, the next step expands to handle different types of coordination problems and runs pilot tests in real-world programs to bridge the theory-practice gap. Each new domain tested helps validate (or challenge) the predictive validity of the simulation infrastructure. The scope is to accumulate a dataset showing what mechanisms work under what conditions and identify the boundaries—where do our models work well, where do they fail? If testing reveals our frameworks missed something important, we loop back and refine earlier phases.',
  },
  publications: [],
};
