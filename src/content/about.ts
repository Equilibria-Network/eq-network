// src/content/about.ts

export interface AboutContent {
  hero: {
    title: string;
    leftText: string;
    rightText: string;
  };
  philosophy: {
    sectionTitle: string;
    subtitle: string;
    principles: Array<{
      title: string;
      text: string;
      icon: string;
    }>;
  };
}

// Advisor interface (similar to TeamMember but with affiliation and no details/socials)
export interface Advisor {
  id: string;
  name: string;
  affiliation: string;
  bio: string;
  image: string;
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

export const aboutContent: AboutContent = {
  hero: {
    title: "About",
    leftText: "We're a collective intelligence research organization working on how groups coordinate and make better decisions.",
    rightText: "We build new systems - voting mechanisms, organizational structures, coordination tools - while developing the theory to understand them. And we use the same principles in our own research process."
  },
  
  philosophy: {
    sectionTitle: "Philosophy & Culture",
    subtitle: "The principles and practices that shape how we work",
    principles: [
      {
        title: "We partner with existing organizations.",
        text: "The theory develops from what we're seeing in practice.",
        icon: "/img/about/philosophy/partner.svg"
      },
      {
        title: "We engage in interdisciplinary dialogue.",
        text: "We've structured ourselves as both a focused research team and a broader network to make interdisciplinary collisions more likely, creating more surface area for useful accidents.",
        icon: "/img/about/philosophy/dialogue.svg"
      },
      {
        title: "We assume someone already solved our problem, just in a different field.",
        text: "We read across disciplines - game theory, cybernetics, information theory, organizational behavior - looking for patterns that repeat across contexts.",
        icon: "/img/about/philosophy/rubik.svg"
      },
      {
        title: "We test things on ourselves first.",
        text: "When we discover something about how groups work better, we implement it in our own processes before suggesting it elsewhere. This has changed how we run meetings, make decisions, and share information.",
        icon: "/img/about/philosophy/test.svg"
      },
      {
        title: "We take play seriously.",
        text: "Mammals evolved it as a learning mechanism. Time for exploration alongside execution, permission to pursue unexpected tangents, explicit switching between modes.",
        icon: "/img/about/philosophy/play.svg"
      },
      {
        title: "Make the implicit explicit.",
        text: "We make things explicit that usually stay implicit - what good work means here, how we make decisions, what we do when we disagree. Building shared language as we go.",
        icon: "/img/about/philosophy/bulb.svg"
      }
    ]
  }
};

// Advisors data
export const advisors: Advisor[] = [
  {
    id: "david-hyland",
    name: "David Hyland",
    affiliation: "Oxford University",
    bio: "Postdoctoral researcher at Oxford University under Michael Woolridge working on bounded rationality and incentive design in multi-agent systems",
    image: "/img/about/advisors/david-hyland.jfif",
    website: "https://www.linkedin.com/in/david-h-88a499135/"
  },
  {
    id: "david-norman",
    name: "David Norman",
    affiliation: "Cooperative AI Foundation (CAIF)",
    bio: "David Norman is the Managing Director of the Cooperative AI Foundation (CAIF), which supports research to improve the cooperative intelligence of advanced AI systems for the benefit of all.",
    image: "/img/about/advisors/david-norman.webp",
    website: "https://www.linkedin.com/in/davidnorman8/"
  }
];

// Partners data
export const partners: Partner[] = [
  {
    id: "digital-democracy-world",
    name: "Digital Democracy World",
    description: "An organization building Flowback, a platform for digital democracy. They're working on Liquid Futarchy, a new form of collective intelligence, and we're helping them explore how to make it optimal in terms of robustness.",
    logo: "/img/about/partners/digital-democracy-world.svg",
    website: "https://digitaldemocracy.world"
  }
];
