// src/content/roadmap/phase-1.ts

import type { RoadmapPhase } from './types';

export const phase1: RoadmapPhase = {
  id: 1,
  name: "Foundation",
  researcher: {
    fullName: "David Hume",
    lastName: "Hume",
    image: "/img/roadmap/hume.svg",
    bio: "Scottish Enlightenment philosopher who pioneered empirical approaches to understanding human nature, causation, and the foundations of knowledge."
  },
  details: {
    tagline: "Foundation: Understand Multi-Scale Coordination",
    description: "The first phase focuses on exploration: What exactly are these multi-scale collective intelligence problems? How should we even think about them? What frameworks from different fields (economics, political science, complexity science) might help? We focus on exploratory research to find the right frames and map the problem space.\n\nThis foundational phase explores three interconnected research areas. Mathematical Language develops the formal framework for reasoning about coordination systems—treating markets, networks, and democracies as operations on the same underlying structure. Taxonomy of Agents classifies what types of agents exist and how agency emerges at different scales. Problem Prioritization maps the landscape of coordination failures and identifies which problems are most urgent as AI systems become more capable. Together, these areas provide the conceptual foundation needed to rigorously study collective intelligence."
  },
  researchAreas: [
    {
      id: "mathematical-language",
      name: "Mathematical Language for Coordination",
      description: "A formal framework for representing markets, networks, and democracies as operations on the same underlying structure. We seek a unified language where coordination mechanisms can be composed and analyzed systematically.",
      publications: [
        {
          id: "graphs-universal",
          title: "Graphs as Universal Language",
          status: "draft",
          medium: "Research Paper",
          description: "The core insight—all coordination mechanisms can be understood as message-passing on graphs. Markets pass price signals, networks pass information, democracies pass preferences. Same substrate, different transformation rules.",
          image: null,
          primaryLink: null
        },
        {
          id: "spectral-theory",
          title: "A Spectral Theory of Collective Intelligence",
          status: "active",
          medium: "Research Paper",
          description: "Mathematical tools for analyzing collective dynamics through eigenvalue structure. The key concept is \"resonance\"—when agents' beliefs align along principal eigenmodes, collective intelligence emerges.",
          image: null,
          primaryLink: null
        },
        {
          id: "category-theory",
          title: "Category Theory Connections",
          status: "concept",
          medium: "Research Paper",
          description: "Exploring whether coordination mechanisms can be formalized as functors with clear composition rules.",
          image: null,
          primaryLink: null
        }
      ]
    },
    {
      id: "taxonomy-agents",
      name: "Taxonomy of Agents",
      description: "A classification system for understanding what properties of agents matter for collective intelligence and how agency emerges at different scales—from individuals to institutions.",
      publications: [
        {
          id: "system-level-safety",
          title: "System Level Safety Evaluations",
          status: "published",
          medium: "Blog Post",
          description: "Argues AI safety needs to expand from individual-system to multi-agent system evaluation.",
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
          status: "published",
          medium: "Blog Post",
          description: "Classification scheme for agent types based on their relationship to prediction and action, drawing on active inference.",
          image: null,
          primaryLink: "https://equilibria1.substack.com/p/the-evolution-of-agency-a-research",
          links: {
            lesswrong: "https://www.lesswrong.com/posts/vqfT5QCWa66gsfziB/a-phylogeny-of-agents",
            substack: "https://equilibria1.substack.com/p/the-evolution-of-agency-a-research"
          }
        }
      ]
    },
    {
      id: "problem-prioritization",
      name: "Problem Prioritization",
      description: "A map of coordination failures and their urgency as AI systems become more capable. Which problems are most critical to solve before transformative AI arrives?",
      publications: []
    }
  ]
};
