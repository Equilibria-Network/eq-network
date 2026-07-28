// src/content/roadmap/phase-3.ts

import type { RoadmapPhase } from './types';

export const phase3: RoadmapPhase = {
  id: 3,
  name: 'Generation',
  researcher: {
    fullName: 'Stafford Beer',
    lastName: 'Beer',
    image: '/img/roadmap/beer.svg',
    bio: 'Management cybernetician who pioneered the application of systems thinking to organizational design, creating novel governance structures based on viable system principles.',
  },
  details: {
    tagline: 'Generation: Test mechanisms through simulation in RL and LLM environments',
    description:
      'With candidate mechanisms constructed in Phase 2, this phase builds simulation infrastructure to test them from an incentive perspective. We create reinforcement learning environments where strategic agents attempt to game, exploit, or break each mechanism—probing whether the incentive structures hold up under pressure. We also construct LLM-based environments that simulate social dynamics: agents that argue, persuade, and coordinate in natural language, testing whether mechanisms remain robust when participants behave more like real people than simple optimizers. RL environments help find optimal exploits while LLM environments help surface realistic ones—together they give us a richer picture, though not a complete one. Each mechanism from Phase 2 is run through many scenarios, producing empirical data on failure modes, equilibrium properties, and robustness boundaries that inform what needs to be refined.',
  },
  publications: [],
};
