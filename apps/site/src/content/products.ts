// src/content/products.ts

export interface ProductsContent {
  hero: {
    title: string;
    leftText: string;
    rightText: string;
  };
  /** Shared subsection titles, rendered by both product sections. */
  sectionTitles: {
    problem: string;
    building: string;
    unlocks: string;
    status: string;
  };
  exploration: {
    title: string;
    tagline: string;
    image: string;
    sections: {
      problem: string;
      building: string;
      unlocks: string;
      status: string;
    };
  };
  coordination: {
    title: string;
    tagline: string;
    image: string;
    sections: {
      problem: string;
      building: string;
      unlocks: string;
      status: string;
    };
  };
  connection: {
    title: string;
    description: string;
  };
}

export const productsContent: ProductsContent = {
  hero: {
    title: 'Products',
    leftText: 'Open-source tools for studying and improving how groups coordinate.',
    rightText:
      'Two projects, one foundation: coordination mechanisms can be simulated, tested, and designed—not just deployed and hoped for.',
  },

  sectionTitles: {
    problem: 'The problem:',
    building: "What we're building:",
    unlocks: 'What it unlocks:',
    status: 'Where we are:',
  },

  exploration: {
    title: 'DeSci Bridging Lab',
    tagline: 'Design your own research discovery environment',
    image: '/img/products/desci2.svg',
    sections: {
      problem:
        "Your research feed is optimized for engagement, not discovery. The connections between fields—where breakthroughs often come from—don't surface reliably. You're left hoping for serendipity.",
      building:
        'A design lab where researchers control their own information environment. Connect your paper library, see your position in the research network, and tune your feed for cross-field bridging rather than engagement. Built on open protocols (AT Protocol/Bluesky), inspectable and forkable.',
      unlocks:
        'Researchers who actively design how they encounter ideas, rather than outsourcing discovery to black-box algorithms. Communities that can experiment with different curation mechanisms and measure what actually surfaces valuable connections.',
      status:
        'Early development. Core framework exists; interface design is active. Looking for researchers who want to co-design this by using it.',
    },
  },

  coordination: {
    title: 'Democratic Resilience Lab',
    tagline: 'Stress-test governance systems before deployment',
    image: '/img/products/ci-lib.svg',
    sections: {
      problem:
        "Most governance systems get tested in production—on real communities with real stakes. We have no way to ask 'what happens when this voting system faces coordinated manipulation?' before it matters.",
      building:
        'CI Lib—a simulation framework where coordination mechanisms (markets, networks, democratic processes) operate as composable graph transformations. Design a governance structure, design an adversary, watch what breaks. Iterate before deployment.',
      unlocks:
        "A wind tunnel for institutions. 'Is this deliberation platform robust to bot attacks?' becomes a question you can actually answer. Mechanism designers can test theoretical proposals against realistic conditions.",
      status:
        'Core framework implemented and validated on small-scale simulations. Visual interface in development. Active collaboration with governance researchers.',
    },
  },

  connection: {
    title: 'How they connect',
    description:
      'Both projects use the same underlying framework: coordination mechanisms as graph transformations. The DeSci lab applies this to information flow in research networks. The Resilience lab applies it to decision-making in governance systems. Different applications, shared infrastructure.',
  },
};
