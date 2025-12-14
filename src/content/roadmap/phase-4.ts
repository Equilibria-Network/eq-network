// src/content/roadmap/phase-4.ts

import type { RoadmapPhase } from './types';

export const phase4: RoadmapPhase = {
  id: 4,
  name: "GENERATION",
  researcher: {
    fullName: "Stafford Beer",
    lastName: "Beer",
    image: "/img/roadmap/beer.svg",
    bio: "Management cybernetician who pioneered the application of systems thinking to organizational design, creating novel governance structures based on viable system principles."
  },
  details: {
    tagline: "From Testing to Creating",
    description: "This phase involves shifting from evaluation service to generative design. Instead of just testing mechanisms researchers propose, we start creating novel coordination mechanisms informed by accumulated evidence. Testing other people's proposals is valuable, but the real breakthrough comes when you can systematically generate new mechanisms that nobody's thought of yet. This requires two things built in earlier phases: enough empirical data to know what actually works, and simulation that's scaled up to model complex system dynamics with millions or billions of interacting nodes. At that scale, you can test how information propagates through large populations, how defenses hold up against coordinated attacks across entire systems."
  },
  publications: []
};
