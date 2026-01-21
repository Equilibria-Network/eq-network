// src/content/roadmap/phase-1.ts

import type { RoadmapPhase } from './types';

export const phase1: RoadmapPhase = {
  id: 1,
  name: "FOUNDATION",
  researcher: {
    fullName: "David Hume",
    lastName: "Hume",
    image: "/img/roadmap/hume.svg",
    bio: "Scottish Enlightenment philosopher who pioneered empirical approaches to understanding human nature, causation, and the foundations of knowledge."
  },
  details: {
    tagline: "Understanding Multi-Scale Coordination",
    description: "The first phase focuses on exploration: What exactly are these multi-scale collective intelligence problems? How should we even think about them? What frameworks from different fields (economics, political science, complexity science) might help? We focus on exploratory research to find the right frames and map the problem space."
  },
  subareasOverview: "This foundational phase explores three interconnected research areas. Mathematical Language develops the formal framework for reasoning about coordination systems—treating markets, networks, and democracies as operations on the same underlying structure. Taxonomy of Agents classifies what types of agents exist and how agency emerges at different scales. Problem Prioritization maps the landscape of coordination failures and identifies which problems are most urgent as AI systems become more capable. Together, these areas provide the conceptual foundation needed to rigorously study collective intelligence.",
  publications: [
    {
      id: "system-level-safety",
      title: "System Level Safety Evaluations",
      type: "blog post",
      image: null,
      primaryLink: "https://equilibria1.substack.com/p/system-level-safety-evaluations",
      links: {
        substack: "https://equilibria1.substack.com/p/system-level-safety-evaluations",
        lesswrong: "https://www.lesswrong.com/posts/AJo2HFT8TdY2B3wNJ/system-level-safety-evaluations"
      }
    },
    {
      id: "phylogeny-agents",
      title: "A Phylogeny of Agents",
      type: "blog post",
      image: null,
      primaryLink: "https://equilibria1.substack.com/p/the-evolution-of-agency-a-research",
      links: {
        lesswrong: "https://www.lesswrong.com/posts/vqfT5QCWa66gsfziB/a-phylogeny-of-agents",
        substack: "https://equilibria1.substack.com/p/the-evolution-of-agency-a-research"
      }
    }
  ],
  subareas: [
    {
      id: 'mathematical-language',
      number: '1.1',
      title: 'Mathematical Language for Coordination',
      summary: 'A formal framework for representing markets, networks, and democracies as operations on the same underlying structure.',
      status: 'active',
      goal: `We want a formal framework that can represent markets, networks, and democracies as operations on the same underlying structure. This isn't about forcing everything into one mold—it's about finding the right abstraction level where you can see what coordination mechanisms have in common and how they differ.

We'll know we're done when someone can take a real coordination mechanism, express it in the framework, compose it with another mechanism, and ask mathematically-grounded questions about how the combined system behaves.`,
      why: `Right now, studying markets requires economics, networks require graph theory, voting requires social choice theory. These fields developed independently with different formalisms. But real coordination systems blend all of these—a company uses markets for resources, networks for information, and democratic processes for decisions.

Without a unified language, we can't systematically study how these mechanisms interact. As AI systems become participants in human coordination, this gap becomes dangerous.`,
      work: [
        {
          title: 'Graphs as Universal Language',
          status: 'draft',
          description: 'The core insight—all coordination mechanisms can be understood as message-passing on graphs. Markets pass price signals, networks pass information, democracies pass preferences. Same substrate, different transformation rules.',
          link: null // TODO: Add link
        },
        {
          title: 'A Spectral Theory of Collective Intelligence',
          status: 'active',
          description: 'Mathematical tools for analyzing collective dynamics through eigenvalue structure. The key concept is "resonance"—when agents\' beliefs align along principal eigenmodes, collective intelligence emerges.',
          link: null // TODO: Add link
        },
        {
          title: 'Category Theory Connections',
          status: 'concept',
          description: 'Exploring whether coordination mechanisms can be formalized as functors with clear composition rules.',
          link: null // TODO: Add link
        }
      ],
      missing: [
        'Consolidated framework document unifying the pieces',
        'Validation that the framework captures mechanisms we care about',
        'Library of worked examples showing the framework in action'
      ],
      collaboration: [
        'Mathematical validation: Testing the framework against real mechanisms',
        'Case studies: Applying spectral analysis to real coordination systems',
        'Category theory development: Formalizing composition rules',
        'Exposition: Communicating these ideas to different audiences'
      ]
    },
    {
      id: 'taxonomy-agents',
      number: '1.2',
      title: 'Taxonomy of Agents',
      summary: 'A classification system for what properties of agents matter for collective intelligence and how agents at different scales relate.',
      status: 'in-review',
      goal: `A classification system that tells us what properties of agents matter for collective intelligence, how agents at different scales relate, and how to detect when individual agents form collective agents.

We'll know we're done when, given a multi-agent system, we can classify the agents, identify where agency emerges at different scales, and predict which coordination properties will be affected.`,
      why: `Most AI safety research treats "agents" as primitive—you have an agent, it has goals, you align it. But in collective intelligence, agency is fluid. A corporation is made of people who are each agents, but the corporation itself acts as an agent. Understanding how agency nests and emerges is prerequisite to understanding how AI changes collective intelligence.`,
      work: [
        {
          title: 'A Phylogeny of Agents',
          status: 'published',
          description: 'Classification scheme for agent types based on their relationship to prediction and action, drawing on active inference.',
          link: 'https://equilibria1.substack.com/p/the-evolution-of-agency-a-research'
        },
        {
          title: 'Taxonomy of Agents',
          status: 'in-review',
          description: 'More detailed classification system with clear criteria for categorizing agents by their cognitive and behavioral properties.',
          link: null // TODO: Add link when available
        }
      ],
      missing: [
        'Markov blanket / boundary detection methods',
        'Computational algorithms for detecting emergent agency',
        'Integration with the mathematical language (1.1)'
      ],
      collaboration: [
        'Formal agent classification refinement',
        'Boundary detection algorithms',
        'Empirical validation against real systems',
        'Connections to active inference foundations'
      ]
    },
    {
      id: 'problem-prioritization',
      number: '1.3',
      title: 'Problem Prioritization',
      summary: 'A map of what problems CI Safety is trying to solve, why they matter for AI transition, and how they\'re prioritized.',
      status: 'draft',
      goal: `A clear map of problems, their urgency, and their tractability, so collaborators can understand what exists and where their skills fit.

We'll know we're done when a new collaborator can look at this and understand what problems exist, why they're urgent, which are ready for work, and where they fit.`,
      why: `"Collective intelligence" is broad enough to include everything from ant colonies to stock markets. We need to focus on problems where AI capability growth is changing dynamics, failures would be catastrophic, and solutions need development before problems fully manifest.`,
      work: [
        {
          title: 'System Level Safety Evaluations',
          status: 'published',
          description: 'Argues AI safety needs to expand from individual-system to multi-agent system evaluation.',
          link: 'https://equilibria1.substack.com/p/system-level-safety-evaluations'
        },
        {
          title: '30 Open Problems in CI Safety',
          status: 'draft',
          description: 'Working list of specific research problems, organized by type and difficulty.',
          link: null // TODO: Add link when available
        }
      ],
      missing: [
        'Prioritization framework (importance × tractability × timing)',
        'Explicit connection to AI transition scenarios',
        'Skill-matched entry points for different collaborators'
      ],
      collaboration: [
        'Scenario development for AI transition',
        'Prioritization methodology',
        'Problem refinement from vague to precise',
        'Domain expertise from economics, political science, etc.'
      ]
    }
  ]
};
