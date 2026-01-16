// src/content/products.ts

export interface ProductsContent {
  hero: {
    title: string;
    leftText: string;
    rightText: string;
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
    title: "Products",
    leftText: "We build open-source infrastructure for collective intelligence.",
    rightText: "Two directions, one thesis: groups can coordinate far better than current tools allow, and getting this right matters more as AI becomes part of how we think together."
  },
  
  exploration: {
    title: "Decentralized Science Tools",
    tagline: "Discovery infrastructure for research networks",
    image: "/img/products/desci2.svg",
    sections: {
      problem: "Recommendation algorithms optimize for engagement, not insight. The bridges between fields—where breakthroughs often live—stay buried. Researchers find what they already know to look for, not what would expand their thinking.",
      building: "A middleware layer for decentralized social protocols (starting with AT Protocol/Bluesky) that filters for exploration rather than engagement. Connect your paper library, get a feed tuned for productive surprise—posts that bridge from your known interests into adjacent territory you haven't mapped yet.",
      unlocks: "Research networks that surface connections faster. Cross-disciplinary synthesis that currently depends on serendipity becomes systematic. The recommendation layer that open social infrastructure deserves.",
      status: "Early architecture. The core insight is validated; the implementation is in active design. Looking for collaborators who want to shape what exploration-oriented recommendation actually looks like."
    }
  },
  
  coordination: {
    title: "Collective Intelligence Library",
    tagline: "Simulation infrastructure for trustworthy collective decision-making",
    image: "/img/products/ci-lib.svg",
    sections: {
      problem: "We don't know which coordination mechanisms actually work when AI agents participate alongside humans. Markets, networks, democratic processes—each has been studied in isolation, but real systems blend them. We need a way to test combinations before communities stake their trust on them.",
      building: "CI Lib—a compositional framework where different coordination mechanisms operate as transformations on shared graphs. Design a system with market dynamics, network trust propagation, and democratic governance running simultaneously. Measure what emerges. Iterate before deployment.",
      unlocks: "A design lab for governance. Liquid democracy with reputation mechanics becomes testable. \"Which combination of mechanisms produces outcomes people can trust?\" becomes an empirical question with actual answers.",
      status: "Core framework implemented and validated. Currently in UX development and visual interface design, with ongoing work on matrix representations. The wind tunnel works; now we're making it usable."
    }
  },
  
  connection: {
    title: "How they connect",
    description: "Discovery improves how ideas flow through networks. The design lab improves how groups act on those ideas. Neither replaces the other—healthy collective intelligence needs both. We're building them in parallel because the research informs both directions, and because waiting to sequence them perfectly is slower than learning by doing."
  }
};
