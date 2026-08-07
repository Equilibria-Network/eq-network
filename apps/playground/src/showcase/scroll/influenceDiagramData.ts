/** The combined model's influence diagram at reader altitude: the model's
    variables and every coupling between them, aggregated from the engine's
    declared reads and writes (kernel.js LEDGER_SYSTEM, itself pasted from
    system_graph()). Layout is authored in the component; the CONTENT here
    is checked by test/scroll-contracts.test.js — every node names the
    engine fields it aggregates, every edge names the transforms it
    summarizes plus the fields it reads from its source and writes into its
    target, and every dial names a registry parameter. A figure that cannot
    pass that check does not ship (task-0007). */

export type DiagramNodeKind = 'ledger' | 'state';
export type DiagramEdgeKind = 'flow' | 'modulation';

export interface DiagramNode {
  id: string;
  label: string;
  /** ledger = conserved quantity (drawn as a circle); state = ordinary
      state variable (drawn as a rounded box). */
  kind: DiagramNodeKind;
  /** Engine fields this reader-altitude variable aggregates. */
  fields: string[];
}

export interface DiagramEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  /** flow = conserved value moves (solid); modulation = a rate or a
      structure moves, nothing is conserved (dashed). */
  kind: DiagramEdgeKind;
  /** Cross-system coupling — one of the channels the presets seal, drawn
      emphasized. Redundantly encoded by stroke weight and the dial note. */
  channel?: boolean;
  /** Registry parameter key that scales this coupling (a dial in the
      playable ending). */
  dial?: string;
  selfLoop?: boolean;
  /** The engine transforms this edge summarizes. */
  transforms: string[];
  /** Fields of the source node some named transform reads. */
  reads: string[];
  /** Fields of the target node some named transform writes. */
  writes: string[];
}

export interface InfluenceDiagram {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export const combinedInfluenceDiagram: InfluenceDiagram = {
  nodes: [
    {
      id: 'capital',
      label: 'AI capital & capability',
      kind: 'state',
      fields: ['capital', 'efficiency', 'arrival_tick'],
    },
    {
      id: 'income',
      label: 'Income',
      kind: 'state',
      fields: ['last_income', 'last_reward', 'net_transfer'],
    },
    {
      id: 'wealth',
      label: 'Wealth',
      kind: 'ledger',
      fields: ['wealth', 'consume_spend', 'invest_spend', 'broadcast_spend', 'lobby_spend'],
    },
    {
      id: 'attention',
      label: 'Attention',
      kind: 'ledger',
      fields: ['listening', 'listen_influence', 'attract_boost'],
    },
    {
      id: 'ballots',
      label: 'Ballots',
      kind: 'ledger',
      fields: ['delegation', 'influence', 'position'],
    },
    {
      id: 'enforcement',
      label: 'Enforcement',
      kind: 'state',
      fields: ['enforcement', 'redelegation_friction'],
    },
  ],
  edges: [
    {
      id: 'production',
      from: 'capital',
      to: 'income',
      label: 'production',
      kind: 'flow',
      transforms: ['produce'],
      reads: ['capital', 'efficiency'],
      writes: ['last_income'],
    },
    {
      id: 'income-lands',
      from: 'income',
      to: 'wealth',
      label: 'after-tax income',
      kind: 'flow',
      transforms: ['allocate'],
      reads: ['last_income'],
      writes: ['wealth'],
    },
    {
      id: 'reinvest',
      from: 'wealth',
      to: 'capital',
      label: 'reinvestment',
      kind: 'flow',
      transforms: ['allocate', 'build_capital'],
      reads: ['wealth', 'invest_spend'],
      writes: ['capital'],
    },
    {
      id: 'compound',
      from: 'capital',
      to: 'capital',
      label: 'capability compounds',
      kind: 'modulation',
      selfLoop: true,
      transforms: ['grow'],
      reads: ['capital'],
      writes: ['efficiency'],
    },
    {
      id: 'advertise',
      from: 'wealth',
      to: 'attention',
      label: 'advertising buys reach',
      kind: 'flow',
      channel: true,
      dial: 'reachPerSpend',
      transforms: ['allocate', 'broadcast_reach', 'rewire_listening'],
      reads: ['broadcast_spend'],
      writes: ['listening'],
    },
    {
      id: 'prominence',
      from: 'attention',
      to: 'attention',
      label: 'prominence attracts prominence',
      kind: 'modulation',
      selfLoop: true,
      transforms: ['listen_influence_update', 'rewire_listening'],
      reads: ['listening'],
      writes: ['listen_influence'],
    },
    {
      id: 'attract',
      from: 'attention',
      to: 'ballots',
      label: 'audience attracts delegation',
      kind: 'modulation',
      channel: true,
      dial: 'attentionToBallots',
      transforms: ['rewire_delegation'],
      reads: ['listen_influence'],
      writes: ['delegation'],
    },
    {
      id: 'lobby',
      from: 'wealth',
      to: 'enforcement',
      label: 'lobbying',
      kind: 'modulation',
      channel: true,
      dial: 'regimeRate',
      transforms: ['allocate', 'update_regime'],
      reads: ['lobby_spend'],
      writes: ['enforcement'],
    },
    {
      id: 'tax-target',
      from: 'ballots',
      to: 'income',
      label: 'power-weighted median sets the tax target',
      kind: 'modulation',
      transforms: ['tally_power', 'power_weighted_vote', 'tax_and_redistribute'],
      reads: ['influence', 'position'],
      writes: ['last_income'],
    },
    {
      id: 'tax-binds',
      from: 'enforcement',
      to: 'income',
      label: 'taxation binds',
      kind: 'modulation',
      transforms: ['tax_and_redistribute'],
      reads: ['enforcement'],
      writes: ['last_income', 'net_transfer'],
    },
  ],
};
