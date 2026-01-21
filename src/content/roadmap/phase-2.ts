// src/content/roadmap/phase-2.ts

import type { RoadmapPhase } from './types';

export const phase2: RoadmapPhase = {
  id: 2,
  name: "CONSTRUCTION",
  researcher: {
    fullName: "Norbert Wiener",
    lastName: "Wiener",
    image: "/img/roadmap/wiener.svg",
    bio: "Mathematician and philosopher who founded cybernetics, establishing frameworks for understanding communication and control in complex systems."
  },
  details: {
    tagline: "Building for One Use Case, Testing Immediately",
    description: "Once we have solid frameworks to think about collective intelligence problems, we need a way to test them. If someone designs a safety measure, like a new voting system or defense mechanism against misinformation, we need to build infrastructure to stress-test it. Does it hold up when bad actors coordinate against it? What breaks first? We need a laboratory to actually test the dynamics. This phase involves building simulation infrastructure that acts as a proving ground for system-level safety measures. This lets us test proposed defensive processes through thousands of scenarios with agents trying to game it, manipulate it, or break it. The goal is to build infrastructure that provides immediate practical value, helping test ideas rigorously before anyone tries implementing them for real."
  },
  subareasOverview: "This construction phase translates theory into practice by building simulation infrastructure. Simulation Architecture creates the core platform for modeling multi-agent coordination systems. Adversarial Testing Framework develops tools for stress-testing mechanisms against manipulation and gaming. Validation Use Case applies these tools to a concrete problem, ensuring the infrastructure actually works before broader deployment. Together, these create a laboratory for testing collective intelligence designs.",
  publications: [],
  subareas: [
    {
      id: 'simulation-architecture',
      number: '2.1',
      title: 'Simulation Architecture',
      summary: 'Core infrastructure for running agent-based simulations of coordination mechanisms at scale.',
      status: 'active',
      goal: `Build a flexible, performant simulation platform that can model the coordination mechanisms from Phase 1's mathematical framework. The platform needs to handle thousands of agents, support different coordination rules (markets, networks, voting), and provide clear observability into system dynamics.

We'll know it's working when someone can specify a coordination mechanism, populate it with agents, run scenarios, and extract meaningful metrics about how the system behaves under different conditions.`,
      why: `The mathematical frameworks from Phase 1 give us language to describe coordination systems, but we need to actually run them to understand emergent behavior. Real-world testing is expensive and slow. Simulation lets us explore thousands of scenarios, test edge cases, and understand failure modes before anyone implements these systems in the real world.

As AI agents become more prevalent in coordination systems, the ability to simulate their interactions becomes critical infrastructure.`,
      work: [
        {
          title: 'Agent Framework Design',
          status: 'active',
          description: 'Defining how agents are represented, how they make decisions, and how they interact with coordination mechanisms.',
          link: null
        },
        {
          title: 'Coordination Mechanism API',
          status: 'draft',
          description: 'Standard interface for implementing different coordination rules (market dynamics, network effects, voting systems).',
          link: null
        },
        {
          title: 'Performance Benchmarking',
          status: 'concept',
          description: 'Testing scalability—how many agents, how complex can mechanisms be, what bottlenecks exist.',
          link: null
        }
      ],
      missing: [
        'Integration with Phase 1 mathematical language',
        'Observability tools for understanding emergent dynamics',
        'Standard library of agent types and coordination mechanisms',
        'Documentation and examples for users'
      ],
      collaboration: [
        'Software engineering: Building performant simulation engine',
        'Validation: Testing against known results from game theory/economics',
        'UX design: Making simulation results interpretable',
        'Domain expertise: Modeling realistic agent behavior'
      ]
    },
    {
      id: 'adversarial-testing',
      number: '2.2',
      title: 'Adversarial Testing Framework',
      summary: 'Tools for stress-testing coordination mechanisms against manipulation, gaming, and coordinated attacks.',
      status: 'concept',
      goal: `Create a framework for systematically testing how coordination mechanisms fail under adversarial pressure. Given a mechanism design, the framework should be able to spawn adversarial agents that try to manipulate, game, or break it. This includes testing against colluding agents, misinformation campaigns, strategic voting, and market manipulation.

Success means someone can submit a mechanism design and get back a report: "Here are 10 ways your system breaks, here's how bad actors coordinated to exploit it, here's what fails first."`,
      why: `Most mechanism designs assume honest or at least non-coordinating participants. Reality includes adversaries who actively coordinate to exploit systems. Without adversarial testing, we deploy mechanisms that look good on paper but fail catastrophically when real incentives kick in.

With AI-powered agents, adversarial attacks become more sophisticated. We need infrastructure to test defenses before deployment, not after failure.`,
      work: [
        {
          title: 'Attack Pattern Library',
          status: 'concept',
          description: 'Catalog of known adversarial strategies: collusion, sybil attacks, misinformation, strategic manipulation.',
          link: null
        },
        {
          title: 'Red Team Agent Development',
          status: 'not-started',
          description: 'Building AI agents specifically designed to find and exploit weaknesses in coordination mechanisms.',
          link: null
        },
        {
          title: 'Robustness Metrics',
          status: 'not-started',
          description: 'Quantifying how resilient a mechanism is—what percentage of adversaries needed to break it, how much damage they can cause.',
          link: null
        }
      ],
      missing: [
        'Comprehensive taxonomy of attacks',
        'Automated red-teaming tools',
        'Integration with simulation architecture',
        'Real-world validation of attack models'
      ],
      collaboration: [
        'Security research: Understanding attack vectors',
        'Game theory: Modeling adversarial equilibria',
        'AI safety: Developing realistic adversarial agents',
        'Mechanism design: Creating robust defensive patterns'
      ]
    },
    {
      id: 'validation-use-case',
      number: '2.3',
      title: 'Validation Use Case',
      summary: 'Apply simulation and testing infrastructure to a concrete coordination problem to validate the approach.',
      status: 'concept',
      goal: `Choose a specific, tractable coordination problem and use it to validate the entire infrastructure. This isn't about solving the problem perfectly—it's about proving the simulation and testing tools actually work. The use case should be realistic enough to matter but bounded enough to complete.

Success means we can demonstrate: "Here's a real coordination challenge, here's how we modeled it, here's what we learned, and here's how the infrastructure helped."`,
      why: `Building infrastructure without immediate application risks creating tools nobody needs. A validation use case forces us to confront real requirements, identifies gaps in our tools, and provides concrete evidence that this approach works.

It also creates an existence proof for stakeholders: this isn't just theory, here's a working example.`,
      work: [
        {
          title: 'Use Case Selection',
          status: 'concept',
          description: 'Identifying which coordination problem to tackle first. Candidates might include: content moderation systems, resource allocation in networks, or decision-making in DAOs.',
          link: null
        },
        {
          title: 'Mechanism Modeling',
          status: 'not-started',
          description: 'Translating the chosen use case into the simulation framework, defining agents, rules, and success metrics.',
          link: null
        },
        {
          title: 'Results Analysis',
          status: 'not-started',
          description: 'Running simulations, analyzing outcomes, identifying insights, and documenting what we learned about both the problem and the tools.',
          link: null
        }
      ],
      missing: [
        'Stakeholder engagement for real-world problem selection',
        'Validation that simulation results match theoretical predictions',
        'Clear success criteria for the use case',
        'Publication strategy for sharing results'
      ],
      collaboration: [
        'Domain experts: Understanding the real coordination problem',
        'Practitioners: Validating that models reflect reality',
        'Research communication: Making results accessible',
        'Feedback integration: Using lessons to improve infrastructure'
      ]
    }
  ]
};
