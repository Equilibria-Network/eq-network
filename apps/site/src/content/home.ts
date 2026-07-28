// src/content/home.ts

export interface HomeContent {
  hero: {
    tagline: string;
    description: string;
    highlights: string[];
  };
  audience: {
    title: string;
    exampleLabel: string;
    audiences: Array<{
      id: string;
      title: string;
      image: string;
      claim: string;
      example: string;
    }>;
  };
  publications: {
    sectionTitle: string;
    sectionDescription: string;
    publications: Array<{
      id: string;
      title: string;
      type: string;
      image: string | null;
      primaryLink: string;
    }>;
  };
}

export const homeContent: HomeContent = {
  hero: {
    tagline: 'Designing New Forms Of Collective Intelligence',
    description:
      "Small changes in how groups coordinate create dramatically different outcomes. We're exploring the vast design space of possible coordination mechanisms.",
    highlights: ['simulations', 'mathematical foundations'],
  },

  audience: {
    title: 'Who This Matters To',
    exampleLabel: 'Example',
    audiences: [
      {
        id: 'policymakers',
        title: 'Policymakers',
        image: '/img/home/audience/policymaker.svg',
        claim:
          'We can help you see and quantify the potential impact of your governance proposals on wide populations before implementation',
        example:
          "Semiconductor supply chain policies often create hidden vulnerabilities when critical nodes concentrate in adversarial regions. We're building models to reveal which interventions actually increase resilience versus which just look good on paper.",
      },
      {
        id: 'researchers',
        title: 'AI Safety Researchers',
        image: '/img/home/audience/researcher.svg',
        claim: 'We can help you evaluate emergent risks and the safety of multi-agent AI systems',
        example:
          "We're building mathematical frameworks to predict where multi-agent AI systems break down and identify the control levers needed to prevent those breakdowns. Our approach combines phase transition analysis - mapping the critical points where collective AI behavior shifts from beneficial to harmful - with top-down control theory that reveals which interventions can steer these systems toward pro-social outcomes before problems emerge.",
      },
      {
        id: 'labs',
        title: 'AI Labs',
        image: '/img/home/audience/ai_lab.webp',
        claim: 'Predict emergent behaviors before expensive deployment',
        example:
          'AI systems from many organizations will need to coordinate someday. Should they trade information like a market, vote like democracies, or try some other type of coordination mechanism? We are designing simulations to tell you which approach will work best before you spend millions building systems that end up with coordination failures.',
      },
    ],
  },

  publications: {
    sectionTitle: 'Research',
    sectionDescription: 'Our thinking on collective intelligence',
    publications: [
      {
        id: 'system-level-safety',
        title: 'System Level Safety Evaluations',
        type: 'blog post',
        image: '/img/home/publications/system.webp',
        primaryLink:
          'https://www.lesswrong.com/posts/AJo2HFT8TdY2B3wNJ/system-level-safety-evaluations',
      },
      {
        id: 'phylogeny-agents',
        title: 'A Phylogeny of Agents',
        type: 'blog post',
        image: '/img/home/publications/philogeny.webp',
        primaryLink: 'https://www.lesswrong.com/posts/vqfT5QCWa66gsfziB/a-phylogeny-of-agents',
      },
      {
        id: 'spectral-signatures',
        title: 'Spectral Signatures of Gradual Disempowerment',
        type: 'blog post',
        image: '/img/home/publications/spectral.png',
        primaryLink: 'https://substack.com/home/post/p-187091496',
      },
      {
        id: 'atoms-knowledge',
        title: "The Atoms of Knowledge Aren't Universal",
        type: 'blog post',
        image: '/img/home/publications/atoms.svg',
        primaryLink: 'https://equilibria1.substack.com/p/bridges-not-primitives',
      },
    ],
  },
};
