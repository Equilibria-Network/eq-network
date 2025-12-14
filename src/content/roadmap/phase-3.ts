// src/content/roadmap/phase-3.ts

import type { RoadmapPhase } from './types';

export const phase3: RoadmapPhase = {
  id: 3,
  name: "VALIDATION",
  researcher: {
    fullName: "Elinor Ostrom",
    lastName: "Ostrom",
    image: "/img/roadmap/ostrom.svg",
    bio: "Nobel Prize-winning political economist who demonstrated through empirical research how communities successfully govern shared resources without centralized control."
  },
  details: {
    tagline: "Multiple Domains, Building Confidence",
    description: "Testing mechanisms in one domain proves the concept works. But if you want to claim your simulations are reliable - that they actually predict real-world outcomes - you need evidence across multiple contexts. This phase is about building confidence: do mechanisms that perform well in simulation consistently succeed when actually implemented in real-world situations? After we have the base-level infrastructure working and providing value, the next phase expands to handle different types of coordination problems and runs pilot tests in real-world programs to bridge the theory-practice gap. Each new domain tested helps validate (or challenge) the predictive validity of the simulation infrastructure. The scope is to accumulate a dataset showing what mechanisms work under what conditions and identify the boundaries - where do our models work well, where do they fail? If testing reveals our frameworks missed something important, we loop back and refine Phase 1 thinking."
  },
  publications: []
};
