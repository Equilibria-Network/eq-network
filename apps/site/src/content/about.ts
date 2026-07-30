// src/content/about.ts

import type { PageHeaderContent, PageSeo } from './types/page';

export interface AboutPageDocument {
  seo: PageSeo;
  header: PageHeaderContent;
  orientation: {
    eyebrow: string;
    title: string;
    summary: string;
    association: {
      label: string;
      body: string;
      legalLinkLabel: string;
    };
  };
  participation: {
    eyebrow: string;
    title: string;
    summary: string;
    paths: Array<{
      label: string;
      title: string;
      body: string;
      href: string;
      linkLabel: string;
      external?: boolean;
    }>;
  };
}

export interface AboutContent {
  hero: {
    title: string;
    leftText: string;
    rightText: string;
  };
  philosophy: {
    sectionTitle: string;
    subtitle: string;
    intro: string;
    principles: Array<{
      title: string;
      text: string;
      icon: string;
    }>;
  };
}

// UI copy for the about-page section headers and card hints
export interface AboutUi {
  team: {
    title: string;
    subtitle: string;
    flipHint: string;
    backHint: string;
  };
  advisors: {
    title: string;
    subtitle: string;
    visitHint: string;
  };
  partners: {
    title: string;
    subtitle: string;
    visitLabel: string;
  };
}

// Advisor interface (similar to TeamMember but with affiliation and no details/socials)
export interface Advisor {
  id: string;
  name: string;
  affiliation: string;
  bio: string;
  image: string;
  prototypeImage?: string;
  website?: string;
}

// Partner interface
export interface Partner {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
}

export const aboutPage: AboutPageDocument = {
  seo: {
    title: 'About - Equilibria Network',
    description:
      "Learn about Equilibria Network's mission, team, and approach to collective intelligence research.",
    canonicalPath: '/about',
  },
  header: {
    eyebrow: 'ORGANISATION / ABOUT',
    title: 'About',
    subtitle:
      "We're a collective intelligence research organization working on how groups coordinate and make better decisions.",
    summary:
      'We build new systems - voting mechanisms, organizational structures, coordination tools - while developing the theory to understand them. And we use the same principles in our own research process.',
  },
  orientation: {
    eyebrow: 'ORGANISATION / REGISTERED NONPROFIT',
    title: 'Non Profit',
    summary:
      'Equilibria Network is a registered Swedish nonprofit association that provides the legal structure for the research network and operates this website.',
    association: {
      label: 'PUBLIC RECORD / LEGAL HOME',
      body: 'The association gives the research network a durable public identity and accountable stewardship while leaving the work itself open to cross-disciplinary collaboration.',
      legalLinkLabel: 'See the complete public record',
    },
  },
  participation: {
    eyebrow: 'OPEN INVITATION',
    title: 'There are several ways into the work.',
    summary:
      'Start with the route closest to your own practice: a coordination problem, the research programme, or the working notes we publish as the inquiry develops.',
    paths: [
      {
        label: 'FIELD / PRACTICE',
        title: 'Bring a coordination problem.',
        body: 'If your organisation is testing how groups decide, allocate, govern, or cooperate, tell us what the real constraint looks like.',
        href: 'mailto:contact@eq-network.org',
        linkLabel: 'Start a conversation',
      },
      {
        label: 'PROGRAMME / RESEARCH',
        title: 'Trace the programme.',
        body: 'See the questions, phases, and research dependencies that connect our current work to the systems we want to build.',
        href: '/roadmap',
        linkLabel: 'Read the roadmap',
      },
      {
        label: 'NOTES / UPDATES',
        title: 'Follow the working notes.',
        body: 'Our newsletter shares research ideas and observations while they are still moving, before every edge has been polished away.',
        href: 'https://wizardryweekly.substack.com/',
        linkLabel: 'Visit the newsletter',
        external: true,
      },
    ],
  },
};

export const aboutContent: AboutContent = {
  hero: {
    title: aboutPage.header.title,
    leftText: aboutPage.header.subtitle ?? '',
    rightText: aboutPage.header.summary ?? '',
  },

  philosophy: {
    sectionTitle: 'Philosophy & Culture',
    subtitle: 'The principles and practices that shape how we work',
    intro:
      'Research moves through relationships. The network connects theory, experiments, and live organisational problems. We work across disciplines because coordination failures rarely respect the boundary of a single field.',
    principles: [
      {
        title: 'We partner with existing organizations.',
        text: "The theory develops from what we're seeing in practice.",
        icon: '/img/about/philosophy/partner.webp',
      },
      {
        title: 'We engage in interdisciplinary dialogue.',
        text: "We've structured ourselves as both a focused research team and a broader network to make interdisciplinary collisions more likely, creating more surface area for useful accidents.",
        icon: '/img/about/philosophy/dialogue.webp',
      },
      {
        title: 'We assume someone already solved our problem, just in a different field.',
        text: 'We read across disciplines - game theory, cybernetics, information theory, organizational behavior - looking for patterns that repeat across contexts.',
        icon: '/img/about/philosophy/rubik.webp',
      },
      {
        title: 'We test things on ourselves first.',
        text: 'When we discover something about how groups work better, we implement it in our own processes before suggesting it elsewhere. This has changed how we run meetings, make decisions, and share information.',
        icon: '/img/about/philosophy/test.webp',
      },
      {
        title: 'We take play seriously.',
        text: 'Mammals evolved it as a learning mechanism. Time for exploration alongside execution, permission to pursue unexpected tangents, explicit switching between modes.',
        icon: '/img/about/philosophy/play.webp',
      },
      {
        title: 'Make the implicit explicit.',
        text: 'We make things explicit that usually stay implicit - what good work means here, how we make decisions, what we do when we disagree. Building shared language as we go.',
        icon: '/img/about/philosophy/bulb.webp',
      },
    ],
  },
};

export const aboutUi: AboutUi = {
  team: {
    title: 'Team',
    subtitle: 'The people building Equilibria Network',
    flipHint: 'Click to read more',
    backHint: 'Click to return',
  },
  advisors: {
    title: 'Advisors',
    subtitle: 'Expert guidance from across disciplines',
    visitHint: 'Click to visit profile',
  },
  partners: {
    title: 'Partner Organizations',
    subtitle: 'Collaborating to advance collective intelligence',
    visitLabel: 'Visit website →',
  },
};

// Advisors data
export const advisors: Advisor[] = [
  {
    id: 'aaron-halpern',
    name: 'Aaron Halpern',
    affiliation: 'Intelligence Rising',
    bio: 'Co-founder of Equilibria Network and Chair of the Board. Now Game Design and Research Lead at Intelligence Rising, with a PhD from University College London and a background spanning interdisciplinary research, systems design, and early-stage technical startups.',
    image: '/img/about/advisors/aaron-sketch.png',
    prototypeImage: '/img/about/team/aaron.jpeg',
    website: 'https://www.linkedin.com/in/aaron-halpern-429197195/',
  },
  {
    id: 'david-hyland',
    name: 'David Hyland',
    affiliation: 'Oxford University',
    bio: 'Postdoctoral researcher at Oxford University under Michael Woolridge working on bounded rationality and incentive design in multi-agent systems',
    image: '/img/about/advisors/david-hyland.jpg',
    website: 'https://www.linkedin.com/in/david-h-88a499135/',
  },
  {
    id: 'david-norman',
    name: 'David Norman',
    affiliation: 'Cooperative AI Foundation (CAIF)',
    bio: 'David Norman was the Managing Director of the Cooperative AI Foundation (CAIF) between Nov 2023 and Feb 2026, and is currently a board member for London Initiative for Safe AI (LISA).',
    image: '/img/about/advisors/david-norman.webp',
    website: 'https://www.linkedin.com/in/davidnorman8/',
  },
  {
    id: 'jobst-heitzig',
    name: 'Jobst Heitzig',
    affiliation: 'Potsdam Institute for Climate Impact Research (PIK)',
    bio: 'Senior Scientist and Working Group Leader at PIK, leading the Behavioural Game Theory and Interacting Agents group. Researches climate policy, complex networks, and tipping elements through the lens of game theory and nonlinear dynamics.',
    image: '/img/about/advisors/jobst-heitzig.jpeg',
    website: 'https://www.pik-potsdam.de/members/heitzig',
  },
];

// Partners data
export const partners: Partner[] = [
  {
    id: 'digital-democracy-world',
    name: 'Digital Democracy World',
    description:
      "An organization building Flowback, a platform for digital democracy. They're working on Liquid Futarchy, a new form of collective intelligence, and we're helping them explore how to make it optimal in terms of robustness.",
    logo: '/img/about/partners/digital-democracy-world.svg',
    website: 'https://digitaldemocracy.world',
  },
];
