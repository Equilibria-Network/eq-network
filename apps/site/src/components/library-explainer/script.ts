import type { LibraryProse, LibrarySegmentSpec } from './types';

/** The explainer's flow: narrative steps + the artifact stage each one pins.
    House style: every section opens with the problem it solves, then the
    library's answer. Copy discipline (engine CLAUDE.md): trajectory claims
    describe THIS run (seed and T are printed under the chart); measured
    claims cite the fixture that carries n, se, and caveat class; cross-run
    claims are ordering only. Data-only module — importable under
    node --test. */

export const librarySegments: LibrarySegmentSpec[] = [
  {
    id: 'object',
    eyebrow: 'One object',
    title: 'A market, a network, and a democracy are the same kind of object',
    intro: [
      'The problem: markets, information networks, and democratic institutions are studied by different fields, in formalisms that do not compose — so nobody can run them against each other. The Collective Intelligence Library starts from the observation that as graphs they are one kind of object: message passing over a relation, differing only in what flows and how nodes update.',
      'Everything on this page is built from artifacts the engine exported — every diagram and every curve below is something the engine actually derived.',
    ],
    steps: [
      {
        id: 'equation',
        stageLabel: 'The equation',
        headline: 'Nearly every dynamic process has one shape',
        stage: { kind: 'slots', tradition: 'degroot' },
        body: 'Each unit forms a message per neighbour, arriving messages combine by an order-independent operation, and the unit updates — that is the whole picture. Opinion pooling, voting, market clearing, production networks, contagion, graph neural networks: each tradition is one way of filling the three colored slots. Pick one and watch the same picture refill.',
      },
      {
        id: 'state',
        stageLabel: 'One state',
        headline: 'All of it lives in one immutable state',
        stage: { kind: 'state-layers' },
        snippetId: 'graphstate_def',
        body: 'Committing to one representation needs one state type: a population, typed nodes, named per-agent arrays, named relation layers, world-level values. A domain is a layer of this one object, not a module — which is why coupling an economy to a polity is an ordinary step, never new machinery. These are the actual fields of the governed commons you will follow down this page.',
      },
    ],
  },
  {
    id: 'step',
    eyebrow: 'One step',
    title: 'Rules change the state — and say what they touch',
    intro: [
      'The problem: if anyone can write a rule that changes the world, how does anyone else know what it affects? The library’s answer is that an institution is a pure function from state to state that declares the fields it reads and writes. The declaration is the entire interface — no base class, no registration protocol, nothing else to know.',
    ],
    steps: [
      {
        id: 'transform',
        stageLabel: 'The declaration',
        headline: 'An institution is a function with declared effects',
        stage: { kind: 'transform-card', transforms: ['harvest', 'regrow'] },
        snippetId: 'harvest_transform',
        body: 'Two steps of the governed commons: households harvest through delegates, and the stock regrows. The read/write chips are the declarations the engine consumes — open the code panel to see them on the real transform.',
      },
      {
        id: 'schedule',
        stageLabel: 'Timing as data',
        headline: 'Institutions do not share a clock',
        stage: { kind: 'schedule', cadence: 5, phaseOffset: 0, onset: 0 },
        snippetId: 'scheduled_def',
        body: 'The problem: markets clear continuously, elections are periodic, regulations switch on at a date — one loop cannot hard-code all of that. So the engine runs every environment on background ticks, and each transform is placed on them by three numbers: how often (cadence), where in the cycle (phase_offset), and from when (onset). The timeline shows the real pipeline’s rows; drag the vote’s dials and watch its ScheduleSpec — the schedule is data you can sweep, not code you rewrite.',
      },
    ],
  },
  {
    id: 'compiler',
    eyebrow: 'The compiler',
    title: 'What order should things run in?',
    intro: [
      'The problem: you add a vote, a stranger adds sanctions, and both touch the same world — who runs first, and does either break the other? Most frameworks answer socially: read both codebases and hope. Here nobody writes the order down. Because every transform declares what it reads and writes, the order is computed from the type definitions — resource ordering over the declared effects — so every environment gets one consistent within-tick schedule, derived, not authored.',
    ],
    steps: [
      {
        id: 'order-derived',
        stageLabel: 'Two steps',
        headline: 'Shared fields become ordering',
        stage: { kind: 'batches', enabled: [0, 1] },
        body: 'Harvest and regrowth both touch the resource stock, so the compiler runs them in sequence. The dependency is read off the declarations — read-after-write, write-after-write — never written by hand.',
      },
      {
        id: 'vote-parallel',
        stageLabel: 'Add a vote',
        headline: 'A new institution slots in without touching the others',
        stage: { kind: 'batches', enabled: [0, 1, 2] },
        body: 'A quota vote reads the households’ votes and writes next round’s harvest target. It shares no field with regrowth, so the two run in the same batch, in parallel. Adding an institution never means editing another one.',
      },
      {
        id: 'sanction-serial',
        stageLabel: 'Add sanctions',
        headline: 'The compiler serializes what actually conflicts',
        stage: { kind: 'batches', enabled: [0, 1, 2, 3] },
        snippetId: 'pipeline_hazards',
        body: 'Graduated sanctions read the target the vote wrote, so they wait for the vote’s batch. Toggle any subset of the four transforms above — every ordering you can produce was derived by the engine’s compiler and shipped as a lookup table.',
      },
      {
        id: 'system-baseline',
        stageLabel: 'The system view',
        headline: 'The same declarations draw the system',
        stage: { kind: 'system', condition: 'baseline' },
        body: 'Reads and writes also make every pipeline a communication graph nobody hand-drew: state fields on the left, transforms on the right, reads flowing right and writes flowing back. This is the undefended commons.',
      },
      {
        id: 'system-defended',
        stageLabel: 'Toggle a mechanism',
        headline: 'Switching on governance adds its nodes',
        stage: { kind: 'system', condition: 'graduated_sanctions' },
        snippetId: 'condition_attach',
        body: 'Under the defended condition the vote and sanction transforms appear, wired to exactly the fields their declarations name. Attaching them is data, not surgery — a benchmark condition is a list of (mechanism, config, schedule) triples, as the code panel shows.',
      },
    ],
  },
  {
    id: 'category',
    eyebrow: 'One arrow',
    title: 'Putting institutions together is function composition',
    intro: [
      'The problem: every framework promises that its pieces compose, and in most of them composition is a social fact — things work together because their authors were careful. The library takes the answer applied category theory suggests: make every institution the same kind of arrow, from state to state, and combining institutions stops being a hope and becomes an operation with laws.',
      'The point of the laws is leverage — complexity from simplicity. Because composites are arrows again, simple steps build arbitrarily large worlds, and the twentieth institution is added exactly the way the second was: the integration work does not grow with the size of the build. The diagrams below are drawn from the same exported declarations the compiler consumes, and each one states one checkable fact about how the engine combines functions.',
    ],
    steps: [
      {
        id: 'arrows',
        stageLabel: 'One type',
        headline: 'Every institution is an arrow from state to state',
        stage: { kind: 'category', view: 'endo' },
        snippetId: 'harvest_transform',
        body: 'One object, the state; arrows, the transforms — each a pure function from GraphState to GraphState. Arrows out of and into the same object compose, and the composite has the same type again, so a pipeline of any length is just another arrow. This closure is why the engine treats a single harvest rule and a whole governed economy uniformly: both are one arrow.',
      },
      {
        id: 'effect-types',
        stageLabel: 'Refined types',
        headline: 'Declared effects refine the type of each arrow',
        stage: { kind: 'category', view: 'factor' },
        snippetId: 'harvest_transform',
        body: 'State to state alone says too little — any step could depend on anything, and nothing about a composite could ever be derived. The reads and writes declarations sharpen the type: harvest factors through the slice of the state it may see and the slice it may replace, acting as the identity everywhere else. The factorisation, not the function body, is the interface the compiler works with.',
      },
      {
        id: 'commuting-square',
        stageLabel: 'Commutation',
        headline: 'Disjoint effects make the square commute',
        stage: { kind: 'category', view: 'interchange' },
        snippetId: 'pipeline_hazards',
        body: 'Two arrows whose declared effects share no field give the same composite in either order. The square commutes, the ordering question dissolves, and the pair collapses into one parallel arrow — regrowth and the quota vote are that pair in this pipeline. Every parallel batch the compiler section showed is an instance of this square, proved from the declarations rather than asserted by an author.',
      },
      {
        id: 'tick-iterate',
        stageLabel: 'Time',
        headline: 'One tick is a composite; a run is its iterate',
        stage: { kind: 'category', view: 'tick' },
        snippetId: 'scheduled_def',
        body: 'Reassemble the batches and one tick of the world is a single composite arrow — sanctions after the parallel pair after harvest, exactly as the compiler factorised it. A run applies that arrow T times, and a scheduled transform substitutes the identity on ticks where it does not fire, so timing changes which factors appear without touching the algebra. Sweeping seeds is vmap lifting the same arrow to a batch of states while preserving composition — the categorical reading of why sweeps need no new code.',
      },
    ],
  },
  {
    id: 'matrix',
    eyebrow: 'One matrix',
    title: 'Any graph is a matrix',
    intro: [
      'The problem: pictures of graphs do not compute. To run and to measure these worlds at scale, the engine stores every relation the same way — a matrix over the population. The graph below is real: the friendship layer of the library’s cultural-contagion model, exported with its spectrum.',
    ],
    steps: [
      {
        id: 'same-object',
        stageLabel: 'Two views',
        headline: 'The node-link picture and the matrix are the same object',
        stage: { kind: 'matrix', order: 'index' },
        body: 'Every relation layer is an N-by-N array: entry (i, j) is the tie from j to i. Hover the matrix and watch the graph — row i is agent i’s incoming mail. There is no second data structure; the picture on the left is a drawing of the array on the right.',
      },
      {
        id: 'one-multiply',
        stageLabel: 'One multiply',
        headline: 'One step of the world is one matrix multiply',
        stage: { kind: 'matrix', order: 'index' },
        body: 'This is what the representation buys. Aggregating every agent’s neighbours — the ⨁ of the opening equation — is W times x, one line of linear algebra for any attribute shape. Row-normalise W and the step averages, so opinions pool toward consensus; leave it raw and the step accumulates, so resources compound; the diagonal is memory. Institutional dynamics become properties of matrices.',
      },
      {
        id: 'sorted',
        stageLabel: 'Sorted',
        headline: 'Sort the rows by one eigenvector and structure appears',
        stage: { kind: 'matrix', order: 'fiedler' },
        body: 'Same matrix, rows and columns reordered by the Laplacian’s second eigenvector. Ties pull toward the diagonal and the graph’s hidden community structure becomes visible blocks. That eigenvector is doing real work — which is the door to the last section.',
      },
    ],
  },
  {
    id: 'spectral',
    eyebrow: 'Reading structure',
    title: 'Measuring the system without running it',
    intro: [
      'The problem: at forty agents you can look at a picture; at forty thousand you cannot. Spectral graph theory is the mathematics that still reads a system after it has grown too large to draw — and because relations are matrices, its toolkit applies directly. It pays twice: readouts of structure before any outcome unfolds, and a supply of new metrics, since every spectral quantity is a candidate instrument for collective structure. The ones below were computed by the engine for the graph you just saw.',
    ],
    steps: [
      {
        id: 'spectrum',
        stageLabel: 'The spectrum',
        headline: 'The Laplacian spectrum is the system’s X-ray',
        stage: { kind: 'spectral', view: 'eigenvalues' },
        body: 'The eigenvalues of L = D − W summarise how the graph carries signals. The gap between the first two sets how fast local perturbations become global patterns: a large gap means the collective homogenises quickly, a small one means communities hold out. One number, no simulation required.',
      },
      {
        id: 'faultline',
        stageLabel: 'The fault line',
        headline: 'The Fiedler vector finds the fault line',
        stage: { kind: 'spectral', view: 'fiedler' },
        body: 'The second eigenvector cuts the graph at its weakest links — the system’s primary fault line. The library’s capture detector asks whether that fault line aligns with the human/AI boundary. On this graph, at its default mixing, it does not — and that score is exactly what would move first if it started to. Spectral gap, fault-line alignment, mediation shares: these are the readouts the observability layer will put behind live dashboards next.',
      },
    ],
  },
];

/** Full-width closing prose: the live views the spectral toolkit opens,
    written out rather than sketched. Status is honest per the whitepaper:
    the fault-line alignment runs today; the rest of the family is designed. */
export const futureViewsProse: LibraryProse = {
  id: 'future-views',
  eyebrow: 'Where this goes',
  title: 'The views this opens',
  coda: 'One of these — the fault-line score — runs in the engine today and produced the number above. The others are designed metrics of the same family, waiting on the observability layer that will stream them from live runs.',
  blocks: [
    {
      heading: 'A fault-line monitor',
      body: 'The Fiedler split of the influence graph, recomputed as the world runs, with one line tracking its alignment to the human/AI boundary. Flat near zero means the graph’s divisions are not the species divide; a climb is capture forming — visible in the structure long before any outcome shows it.',
    },
    {
      heading: 'A speed-of-consensus dial',
      body: 'The spectral gap computed separately over the human-only and AI-only subgraphs, shown as a ratio. Whichever side homogenises faster sets the attractor the whole system drifts toward — a single dial for who is winning the coordination race.',
    },
    {
      heading: 'A bridge map',
      body: 'Betweenness concentrated at the nodes that sit between the types — who mediates the flow between human and AI communities. Drawn as the graph above with the brokers enlarged: when a handful of nodes carry most cross-boundary paths, influence over the interface has concentrated there.',
    },
    {
      heading: 'An influence ticker',
      body: 'A causal influence reading on a schedule inside a live simulation: shift what every member asks for, replay the world under identical randomness, and plot whether outcomes still move. A healthy line holds level; gradual disempowerment is that line sagging while every outcome metric still looks fine.',
    },
  ],
};
