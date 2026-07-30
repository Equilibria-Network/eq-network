// src/content/team.ts

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  summary: string;
  details: string;
  image: string;
  prototypeImage?: string;
  website?: string;
  socials: Record<string, string>;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'jonas',
    name: 'Jonas Hallgren',
    role: 'Director',
    bio: 'Developing multi-agent coordination systems that remain stable and aligned even under competitive pressures.',
    summary:
      "Jonas directs Equilibria's research architecture and operations. His work focuses on multi-agent coordination and active-inference approaches to AI safety, drawing on experience as a collective-intelligence startup's Chief Scientific Officer and on research-programme design through SERI MATS, the Distillation for Alignment Practicum, and the Alignment Mapping Program.",
    details:
      'Jonas directs our research architecture and operational systems, drawing from four years of dedicated experience in AI safety research with special focus on multi-agent coordination through active inference frameworks. His technical expertise was refined as Chief Scientific Officer at a Collective Intelligence startup where he developed algorithms for AI agent coordination.\n\nHis contributions to AI safety education include curriculum design during his internship at SERI MATS and creating structured research programs like the Distillation for Alignment Practicum and the Alignment Mapping Program. Jonas co-founded AI Safety Sweden (now AI Safety Collab) and helped organize Future Forum, bringing together over 300 participants including industry leaders like Daniella Amodei and Sam Altman.\n\nAt Equilibria Network, Jonas designs research architectures that balance theoretical exploration with practical implementation, creating structured environments where complex coordination challenges can be systematically addressed.',
    image: '/img/about/team/jonas-sketch.png',
    prototypeImage: '/img/about/team/jonas.jpeg',
    socials: {},
  },
  {
    id: 'markov',
    name: 'Markov Grey',
    role: 'Technology and Communication Lead',
    bio: 'Co-founder of Equilibria Network, leading technical operations and communication across AI governance, policy, and public research.',
    summary:
      "Co-founder of Equilibria Network, Markov leads technical operations and communication. He is currently Head of Technical AI Governance at CeSIA, designing harmful-manipulation evaluations for the European Commission's AI Office, and works with Epoch AI to translate research into policy-accessible explainers. Previously, he contributed to the AI Safety Atlas textbook, wrote scripts for Rational Animations, and worked in cybersecurity and software development.",
    details:
      "Markov leads technical operations and communication strategy. He has worked in research and head of communication at the Center for AI Safety in France. He is the first author of one of the first textbooks on AI safety, which is used by hundreds of students and several universities and AI safey programs including Sorbonne, UBC Vancouver, and École normale supérieure. \n\n He has 7+ years of technical work experience as a technical generalist working in cyber security, full-stack software development, smart contract development, and 2+ years of that in AI safety. \n\nHis communication experience includes writing AI safety scripts at Rational Animations, serving as a research distillation fellow at AI Safety Info, and researching AI threat models at AI Safety Camp. \n\nMarkov's current research focuses on combining DAOs with AI safety to proposed new decentralized AI governance models, and creating frameworks that make collective intelligence concepts accessible across different stakeholder groups.",
    image: '/img/about/team/markov-sketch.png',
    prototypeImage: '/img/about/team/markov.jpeg',
    website: 'https://markov.pw/',
    socials: {},
  },
];
