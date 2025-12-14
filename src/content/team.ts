// src/content/team.ts

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  details: string;
  image: string;
  socials: Record<string, string>;
}

export const teamMembers: TeamMember[] = [
  {
    id: "aaron",
    name: "Aaron Halpern",
    role: "Strategy and Ecosystem Lead",
    bio: "Complexity scientist and systems design enthusiast bridging diverse disciplines to solve collective intelligence challenges. PhD from University College London on the origin of genetic coding with expertise in cultural evolution and practical problem reframing.",
    details: "Aaron is a complexity scientist and systems design enthusiast. After completing his PhD on the origin of genetic coding at University College London, Aaron worked across diverse, fast-moving roles consulting on emerging technology trends and on projects in pre-seed venture capital, leading him to meet the Equilibria Network founding team. His interests span cultural evolution, collective intelligence, metascience, and using the phrase \"I was just listening to a podcast about...\" Aaron is at his best when helping a team reframe problems, finding practical creative solutions, and sharing insights from across disciplines.",
    image: "/img/about/team/aaron-sketch.png",
    socials: {}
  },
  {
    id: "jonas",
    name: "Jonas Hallgren",
    role: "Research and Operations Lead",
    bio: "Developing multi-agent coordination systems that remain stable and aligned even under competitive pressures.",
    details: "Jonas directs our research architecture and operational systems, drawing from four years of dedicated experience in AI safety research with special focus on multi-agent coordination through active inference frameworks. His technical expertise was refined as Chief Scientific Officer at a Collective Intelligence startup where he developed algorithms for AI agent coordination.\n\nHis contributions to AI safety education include curriculum design during his internship at SERI MATS and creating structured research programs like the Distillation for Alignment Practicum and the Alignment Mapping Program. Jonas co-founded AI Safety Sweden (now AI Safety Collab) and helped organize Future Forum, bringing together over 300 participants including industry leaders like Daniella Amodei and Sam Altman.\n\nAt Equilibria Network, Jonas designs research architectures that balance theoretical exploration with practical implementation, creating structured environments where complex coordination challenges can be systematically addressed.",
    image: "/img/about/team/jonas-sketch.png",
    socials: {}
  },
  {
    id: "markov",
    name: "Markov Grey",
    role: "Technology and Communication Lead",
    bio: "Translating complex technical concepts across domains to build resilient coordination systems.",
    details: "Markov leads technical operations and communication strategy. He has worked in research and head of communication at the Center for AI Safety in France. He is the first author of one of the first textbooks on AI safety, which is used by hundreds of students and several universities and AI safey programs including Sorbonne, UBC Vancouver, and École normale supérieure. \n\n He has 7+ years of technical work experience as a technical generalist working in cyber security, full-stack software development, smart contract development, and 2+ years of that in AI safety. \n\nHis communication experience includes writing AI safety scripts at Rational Animations, serving as a research distillation fellow at AI Safety Info, and researching AI threat models at AI Safety Camp. \n\nMarkov's current research focuses on combining DAOs with AI safety to proposed new decentralized AI governance models, and creating frameworks that make collective intelligence concepts accessible across different stakeholder groups.",
    image: "/img/about/team/markov-sketch.png",
    socials: {}
  }
];
