// src/content/research.ts
// Data model for the research pipeline page.

export interface Publication {
  title: string;
  status: 'published' | 'active' | 'draft' | 'concept';
  primaryLink: string | null;
}

export interface SubArea {
  id: string;
  name: string;
  shortDescription: string;   // 1-minute tier
  description: string;         // 5-minute tier
  status: 'active' | 'early' | 'planned' | 'future';
  publications?: Publication[];
}

export interface Phase {
  id: number;
  name: string;
  color: string;
  tagline: string;             // one-liner for 10-second tier
  status: 'active' | 'early' | 'planned' | 'future';
  gate: string;                // what "done" looks like
  subAreas: SubArea[];
}

export interface ResearchContent {
  title: string;
  subtitle: string;
  phases: Phase[];
}

export const researchContent: ResearchContent = {
  title: 'Research',
  subtitle: 'Our pipeline from foundational questions to real-world validation — an empirical approach to institutional design.',

  phases: [
    // ─── Phase 1: Foundation ─────────────────────────────────────
    {
      id: 1,
      name: 'Foundation',
      color: '#3498db',
      tagline: 'What should we measure, and in what domains?',
      status: 'active',
      gate: 'We know what to measure, what domains to focus on, and have a formal language for reasoning about mechanisms.',
      subAreas: [
        {
          id: 'math-language',
          name: 'Mathematical Language for Coordination',
          shortDescription: 'Formal framework treating coordination mechanisms as graph transforms with composition rules.',
          description: 'A unified formal language where markets, networks, and democracies are operations on the same underlying structure — typed graphs with well-defined transformation rules. Mechanisms compose: you can combine a market with a network and reason about the result. This is the substrate everything else builds on.',
          status: 'active',
          publications: [
            { title: 'Graphs as Universal Language', status: 'draft', primaryLink: null },
            { title: 'A Spectral Theory of Collective Intelligence', status: 'active', primaryLink: null },
            { title: 'Category Theory Connections', status: 'concept', primaryLink: null },
          ],
        },
        {
          id: 'agent-taxonomy',
          name: 'Taxonomy of Agents',
          shortDescription: 'Classifying agent types and how agency emerges at different scales.',
          description: 'What properties of agents matter for collective intelligence? How does agency emerge at different scales — from individual learning agents to institutions? We need this classification to know which agent models are appropriate for which simulation contexts, and to ensure our foundations apply to future autonomous systems, not just current AI.',
          status: 'active',
          publications: [
            { title: 'System Level Safety Evaluations', status: 'published', primaryLink: 'https://equilibria1.substack.com/p/system-level-safety-evaluations' },
            { title: 'A Phylogeny of Agents', status: 'published', primaryLink: 'https://equilibria1.substack.com/p/the-evolution-of-agency-a-research' },
          ],
        },
        {
          id: 'problem-domains',
          name: 'Problem & Domain Specification',
          shortDescription: 'Which coordination problems matter most as AI capability grows?',
          description: 'Scoping the priority domains: commons governance, information networks, multi-agent debate, democratic systems, resource allocation. Which problems are most urgent to solve before transformative AI? Which are tractable enough to make progress on? The domains we choose here determine where Construction efforts are directed.',
          status: 'active',
        },
        {
          id: 'metric-framework',
          name: 'Metric Framework',
          shortDescription: 'Two-layer structure: outcomes we want and processes we think lead there.',
          description: 'Institutional performance decomposes into two layers. Outcomes are what good institutions produce: welfare, equity, sustainability. Processes are the observable dynamics we hypothesise lead to those outcomes: epistemic quality, robustness under adversarial pressure, incentive alignment, information flow quality. The relationship between these layers is itself an empirical question — discovering which processes reliably predict which outcomes is the core scientific programme.',
          status: 'active',
        },
      ],
    },

    // ─── Phase 2: Construction ───────────────────────────────────
    {
      id: 2,
      name: 'Construction',
      color: '#2ecc71',
      tagline: 'Build composable mechanisms and compelling demonstrations.',
      status: 'early',
      gate: 'Candidate mechanisms exist as composable transforms, with demonstrations showing why composition matters.',
      subAreas: [
        {
          id: 'ci-lib',
          name: 'Simulation Framework (CI-Lib)',
          shortDescription: 'JAX-native framework making mechanism simulation composable, controlled, and scalable.',
          description: 'Built on four primitives: GraphState (immutable typed state holding all simulation data), Transform (pure functions on state — composable, parallelisable, verifiable), Schedule (temporal orchestration where the cadence of mechanisms is itself an experimental variable), and Composition operators (sequential, parallel, conditional combination of transforms). This architecture makes it cheap to ask "what happens when we swap this sub-process?" — the core question of empirical institutional design.',
          status: 'early',
          publications: [
            { title: 'CI-Lib: Composable Mechanism Simulation via Functional Graph Transforms', status: 'draft', primaryLink: null },
          ],
        },
        {
          id: 'mechanism-library',
          name: 'Mechanism Library',
          shortDescription: 'Concrete implementations: markets, networks, democratic processes as composable transforms.',
          description: 'Institutional mechanisms decomposed into reusable sub-process transforms. Markets (centralised auctions dispersing global price signals), networks (sparse local graphs for information sharing), democratic processes (periodic collective voting on penalties or policies). Each is a self-contained Transform that composes with any other — the interesting questions are about combinations, not individual mechanisms.',
          status: 'early',
        },
        {
          id: 'showcase-environments',
          name: 'Showcase Environments',
          shortDescription: 'Demonstration environments where mechanism composition produces non-obvious dynamics.',
          description: 'Environments that make the framework tangible and demonstrate why composition matters. The fishing commons experiment composes market + network + democracy mechanisms on a shared resource, in factorial design. The schedule — which mechanisms fire at which cadences — is itself a first-class experimental variable. Different temporal configurations produce qualitatively different resilience profiles.',
          status: 'early',
        },
      ],
    },

    // ─── Phase 3: Simulation ─────────────────────────────────────
    {
      id: 3,
      name: 'Simulation',
      color: '#e67e22',
      tagline: 'Stress-test mechanisms under adversarial pressure.',
      status: 'planned',
      gate: 'Mechanisms tested across adversarial conditions, resilience profiles mapped, domain experts have reviewed results.',
      subAreas: [
        {
          id: 'rl-testing',
          name: 'RL Adversarial Testing',
          shortDescription: 'Adaptive agents that find optimal exploits for each mechanism composition.',
          description: 'Reinforcement learning agents (multiplicative weights bandits, varying adversarial fractions) that probe mechanism compositions for vulnerabilities. Each composition is tested across a sweep of adversarial pressures, producing resilience profiles: at what fraction of bad actors does each mechanism combination break? Where are the critical thresholds?',
          status: 'planned',
        },
        {
          id: 'llm-simulation',
          name: 'LLM Social Simulation',
          shortDescription: 'Language-model agents that test robustness under realistic social dynamics.',
          description: 'LLM-based agents that argue, persuade, form coalitions, and coordinate in natural language. Tests whether mechanisms remain robust when participants behave like real people — strategically, socially, with theory of mind — rather than simple optimizers. RL finds theoretical worst cases; LLM simulation finds realistic ones.',
          status: 'planned',
        },
        {
          id: 'experimental-methodology',
          name: 'Experimental Methodology',
          shortDescription: 'Factorial designs, bifurcation analysis, theory as hypothesis generator.',
          description: 'Systematic experimental methodology: factorial designs crossing mechanism composition × schedule configuration × adversarial pressure. Results presented as bifurcation diagrams showing where mechanisms transition between qualitatively different regimes. Social choice theorems generate hypotheses about individual mechanisms; simulations test those hypotheses under composition.',
          status: 'planned',
        },
      ],
    },

    // ─── Phase 4: Validation ─────────────────────────────────────
    {
      id: 4,
      name: 'Applications',
      color: '#e74c3c',
      tagline: 'Where this goes — products, tools, and partnerships.',
      status: 'planned',
      gate: 'Real-world evidence that simulation predictions correlate with actual outcomes, across multiple domains.',
      subAreas: [
        {
          id: 'ci-lib-product',
          name: 'CI-Lib (Open Source)',
          shortDescription: 'The collective intelligence simulation library as a public tool for researchers.',
          description: 'CI-Lib released as an open-source library that any researcher can use to compose and test coordination mechanisms. The framework becomes infrastructure for the field — not just our internal tool.',
          status: 'planned',
        },
        {
          id: 'desci-lab',
          name: 'DeSci Bridging Lab',
          shortDescription: 'Studying information flow and discovery in research networks.',
          description: 'A product applying verified mechanisms to research communities. Researchers control their own information environment, see their position in the research network, and tune their feed for cross-field bridging. Built on open protocols.',
          status: 'planned',
        },
        {
          id: 'democratic-lab',
          name: 'Democratic Resilience Lab',
          shortDescription: 'Stress-testing governance systems before deployment.',
          description: 'A simulation framework where coordination mechanisms operate as composable graph transformations. Design a governance structure, design an adversary, watch what breaks. A wind tunnel for institutions.',
          status: 'planned',
        },
        {
          id: 'partner-implementations',
          name: 'Partner Implementations',
          shortDescription: 'Testing with existing organisations and governance platforms.',
          description: 'Partnering with organisations already building governance infrastructure to test variations of their existing systems based on verified mechanisms. This provides ecological validity and real-world data.',
          status: 'planned',
        },
      ],
    },

    // ─── Phase 5: Equilibrium ────────────────────────────────────
    {
      id: 5,
      name: 'Equilibrium',
      color: '#9b59b6',
      tagline: 'The discipline becomes self-sustaining.',
      status: 'future',
      gate: 'New researchers extend the work in directions the founding team never imagined. The ideas spread because they work.',
      subAreas: [],
    },
  ],
};
