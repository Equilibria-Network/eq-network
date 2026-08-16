// src/content/research-areas/dynamics.ts
import type { ResearchArea } from './types';

export const dynamics: ResearchArea = {
  id: 'dynamics',
  index: 2,
  eyebrow: 'AREA 02 / COLLECTIVE DYNAMICS',
  name: 'How fast does a group settle, and when does it ring?',
  oneLiner: 'The speed limits on collective change, read from the shape of the network.',
  intro: [
    'Suppose the boundary is drawn and a group really does act as one. The next questions are about motion. When something changes at one node, how fast does the rest catch up? Does the group settle smoothly, or overshoot and swing back? And when it changes its mind, is that a real shift or just a new average?',
    'Our answer to most of these runs through spectral graph theory. Read a network through its vibration modes, and the gaps between those modes give speed limits. This area collects the papers that build and test that reading.',
  ],
  figureLabel: 'Fig. 02 / speed limits from the spectrum',
  steps: [
    {
      state: 'question',
      stageLabel: 'The question',
      headline: 'A change enters at one node. Then what?',
      body: 'Take a group with a bottleneck: two tight clusters joined by a single link. Push one node and watch. The cluster it sits in reacts fast. The far cluster reacts late. Whether the whole ever agrees, and how long that takes, depends on the shape of the network more than on the nodes.',
    },
    {
      state: 'why',
      stageLabel: 'Why it matters',
      headline: 'The bottleneck sets the speed limit',
      body: 'Every network has a ladder of modes, from slow to fast. The gap between the bottom two rungs is the slowest thing the group can do as a whole. That gap is small when there is a bottleneck. It sets how quickly the collective can respond, and it can be read straight from the network. That makes it a design variable, not just a diagnosis.',
    },
    {
      state: 'shape',
      stageLabel: 'How it looks',
      headline: 'Settling smoothly versus overshooting',
      body: 'The same group can respond to the same push in two ways. It can slide to a new state, or it can overshoot and swing back before it settles. That difference is the second thing we look at. In our models the swing shows up when the group has levels, and the levels correspond to gaps in the spectrum. That is the bridge back to area one: levels are gaps.',
    },
    {
      state: 'open',
      stageLabel: 'What is open',
      headline: 'Is a swing a real change of mind?',
      body: 'The formal part is written. The tests are the open work. We are building a small battery of five-agent experiments that separates three cases: settling, ringing, and a genuine reframing where the group ends up in a state no single member started in. Until those run, the results in the drafts are placeholders, and the drafts say so.',
    },
  ],
  pieces: [
    {
      id: 'paradigm-shifts',
      title: 'Paradigm Shifts: Motivated Inference on Webs of Belief',
      kind: 'paper',
      status: 'accepted',
      year: 2026,
      venue: 'IWAI 2026, proceedings and oral',
      asks: 'Why do communities sometimes defend an old idea and sometimes shift together to a new one?',
      setup:
        'A multi-agent model of belief sharing on a trust graph. It compares agents that hold one world-model with agents that hold two competing ones, on a toy scientific dispute.',
    },
    {
      id: 'spectral-signatures',
      title: 'Spectral Signatures of Gradual Disempowerment',
      kind: 'post',
      status: 'published',
      year: 2026,
      venue: 'Substack',
      asks: 'Can the slow loss of human influence be seen in the spectrum of the network that carries it?',
      setup: 'An essay that applies the spectral reading to the gradual-disempowerment scenario.',
      href: 'https://substack.com/home/post/p-187091496',
    },
    {
      id: 'spectral-collective-ai',
      title: 'A Spectral Model of Collective Active Inference',
      kind: 'paper',
      status: 'working-paper',
      year: 2026,
      asks: 'Can network mathematics explain how individual belief updating adds up to group agreement or disagreement?',
      setup:
        'A formal framework that joins active inference (prediction-driven belief updating) to network dynamics, with worked examples.',
      href: '/pdfs/spectral-collective-ai.pdf',
    },
    {
      id: 'spectral-speed-limits',
      title: 'Spectral speed limits (working title)',
      kind: 'paper',
      status: 'draft',
      year: 2026,
      asks: 'How fast can a group get in sync and act as one, and how does that depend on its size and the shape of its network?',
      setup:
        'A synthesis paper. It joins network spread speed (the graph Laplacian), an oscillator model of synchronization (Kuramoto), and a control-theory layer, with worked examples checked in code.',
    },
    {
      id: 'when-does-the-one-change-its-mind',
      title: 'When Does the One Change Its Mind?',
      kind: 'paper',
      status: 'in-progress',
      year: 2026,
      asks: 'When a collective changes its mind, is that a real shift or a new average?',
      setup:
        'A five-agent test battery designed to tell settling, ringing, and genuine reframing apart. The build is under way; the draft carries placeholder figures until it runs.',
    },
    {
      id: 'graph-coupled-games',
      title: 'Graph-coupled games (working title)',
      kind: 'paper',
      status: 'draft',
      year: 2026,
      asks: 'When can a cluster of connected agents be treated as one player in the game one level up?',
      setup:
        'A working paper proposing a three-part test for collapsing levels, worked through on a toy world of people, companies, and nations. Nothing in it has been run yet.',
    },
    {
      id: 'spectral-memetic-evolution',
      title: 'The Spectral Theory of Memetic Evolution',
      kind: 'paper',
      status: 'working-paper',
      year: 2026,
      asks: 'Why do some ideas spread easily while others split a community?',
      setup:
        'A framework that treats ideas as signals with frequency properties on a network, with example messages.',
      href: '/pdfs/spectral-memetic-evolution.pdf',
    },
  ],
  figure: {
    title: 'Two clusters joined by a bottleneck, the ladder of modes, and two response traces',
    description:
      'Circles are agents and lines are couplings. The bold link is the bottleneck. The ladder on the right shows the network modes as bars, with the gap between the first two shaded. The traces at the bottom show a smooth settling curve and a ringing curve after the same push.',
    captions: {
      question: 'a change enters at one node',
      why: 'the bottleneck sets the speed limit',
      shape: 'settle, or overshoot and swing back',
      open: 'is a swing a real change of mind?',
    },
    annotations: {
      pulse: 'a push lands here',
      questionNote: 'the far cluster hears about it late',
      bottleneck: 'the bottleneck',
      ladderAxis: 'modes, slow to fast',
      modePrefix: 'mode ',
      gap: 'the gap: the slowest\nthing the whole can do',
      traceAxis: 'response',
      timeAxis: 'time',
      smooth: 'settling',
      ringing: 'ringing',
      openNote: 'levels = gaps?\nreal shift, or a new average?',
    },
    legend: [
      { glyph: 'circle', label: 'agent' },
      { glyph: 'line', label: 'coupling' },
      { glyph: 'strong-line', label: 'bottleneck' },
      { glyph: 'bar', label: 'a mode' },
      { glyph: 'wave', label: 'response over time' },
    ],
  },
};
