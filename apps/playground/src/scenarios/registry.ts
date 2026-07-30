import {
  COMBINED_DEFAULTS,
  COMMONS_DEFAULTS,
  CULTURAL_DEFAULTS,
  ECONOMY_DEFAULTS,
  POLITICAL_DEFAULTS,
} from '../engine/kernel.js';
import type { ParameterDefinition, ScenarioDefinition, ScenarioId } from '../engine/types';

const range = (
  key: string,
  label: string,
  description: string,
  group: ParameterDefinition['group'],
  min: number,
  max: number,
  step: number,
  unit?: string
): ParameterDefinition => ({ key, label, description, group, kind: 'range', min, max, step, unit });

const toggle = (key: string, label: string, description: string): ParameterDefinition => ({
  key,
  label,
  description,
  group: 'institutions',
  kind: 'toggle',
});

export const scenarios: ScenarioDefinition[] = [
  {
    id: 'commons',
    index: '01',
    shortLabel: 'Commons',
    title: 'The governed commons',
    question:
      'Can a group still govern a shared resource when delegates drift from their principals?',
    description:
      'Households draw from one renewable pool. Quota voting and graduated sanctions alter the information and incentive structure.',
    assumption:
      'A renewable stock with logistic growth; fixed household preferences; noisy delegates.',
    story: {
      setup: 'Twenty households depend on the same renewable stock.',
      pressure:
        'Delegates can extract more than their principals would choose, slowly turning representation into depletion.',
      intervention:
        'Quota votes change the rule; graduated sanctions make that rule consequential.',
      reading:
        'Watch stock remaining and compliance together. A surviving stock without meaningful influence is not self-government.',
    },
    engine: 'runCommons',
    seed: 14,
    defaults: { ...COMMONS_DEFAULTS, alignmentMean: 0.64, greedyTarget: 3.5, defectProb: 0.1 },
    parameters: [
      range(
        'growthRate',
        'Regrowth rate',
        'How quickly the shared stock regenerates.',
        'dynamics',
        0.05,
        0.7,
        0.01
      ),
      range(
        'alignmentMean',
        'Delegate alignment',
        'How closely delegated action follows household preference.',
        'dynamics',
        0,
        1,
        0.01
      ),
      range(
        'greedyTarget',
        'Extraction target',
        'The target delegates approach as alignment falls.',
        'dynamics',
        1,
        10,
        0.1
      ),
      range(
        'defectProb',
        'Defection probability',
        'Chance an actor ignores the current quota.',
        'dynamics',
        0,
        0.5,
        0.01
      ),
      toggle('quotaVote', 'Quota vote', 'Households periodically set the extraction rule.'),
      toggle(
        'sanction',
        'Graduated sanctions',
        'Over-quota extraction is penalized and partly returned.'
      ),
    ],
    presets: [
      {
        id: 'village',
        label: 'Slow tragedy',
        note: 'A readable baseline near the regeneration boundary.',
        values: {
          alignmentMean: 0.64,
          greedyTarget: 3.5,
          defectProb: 0.1,
          quotaVote: false,
          sanction: false,
        },
      },
      {
        id: 'paper',
        label: 'Paper baseline',
        note: 'Fast collapse under stronger delegate drift.',
        values: {
          alignmentMean: 0.4,
          greedyTarget: 8,
          defectProb: 0.15,
          quotaVote: false,
          sanction: false,
        },
      },
      {
        id: 'defended',
        label: 'Self-governed',
        note: 'Voting and enforcement operate together.',
        values: {
          alignmentMean: 0.64,
          greedyTarget: 3.5,
          defectProb: 0.1,
          quotaVote: true,
          sanction: true,
        },
      },
    ],
    metrics: [
      { key: 'stock_pct', label: 'Stock remaining', format: 'percent', better: 'higher' },
      { key: 'exercised_influence', label: 'Influence now', format: 'decimal', better: 'higher' },
      { key: 'compliance_rate', label: 'Compliance', format: 'percent', better: 'higher' },
      { key: 'harvest_gini', label: 'Harvest Gini', format: 'decimal', better: 'lower' },
    ],
    series: [
      { key: 'resource_level', label: 'Resource stock', color: '#003b7e' },
      { key: 'policy_target', label: 'Policy target', color: '#4ab3f4' },
    ],
  },
  {
    id: 'economy',
    index: '02',
    shortLabel: 'Economy',
    title: 'The compute economy',
    question: 'Does production still need people once AI capital can reinvest in itself?',
    description:
      'Human labor and AI capital share a CES production function. Taxes and ownership caps intervene before compounding.',
    assumption:
      'One aggregate production function; staged AI arrival; fixed savings and depreciation rules.',
    story: {
      setup: 'Households supply labour while six AI-capital slots arrive in stages.',
      pressure:
        'Compute income reinvests into more compute, moving both income and productive leverage away from labour.',
      intervention:
        'A revenue tax redistributes returns; an ownership cap acts on concentration before compounding.',
      reading:
        'Output can rise while human income and influence fall. The distribution is the result, not a side panel.',
    },
    engine: 'runEconomy',
    seed: 42,
    defaults: { ...ECONOMY_DEFAULTS },
    parameters: [
      range(
        'rho',
        'Substitution ρ',
        'How readily compute substitutes for labor.',
        'dynamics',
        -0.5,
        0.9,
        0.05
      ),
      range(
        'reinvestRate',
        'AI reinvestment',
        'Share of capital income reinvested each tick.',
        'dynamics',
        0,
        1,
        0.05
      ),
      range(
        'arrivalSpacing',
        'Arrival spacing',
        'Ticks between new AI systems entering.',
        'schedule',
        5,
        50,
        5,
        'ticks'
      ),
      range(
        'taxRate',
        'AI revenue tax',
        'Tax applied to compute-derived capital income.',
        'institutions',
        0,
        0.9,
        0.05
      ),
      range(
        'capShare',
        'Ownership cap',
        'Maximum share held by one active AI system.',
        'institutions',
        0.1,
        0.8,
        0.05
      ),
      toggle('aiTax', 'Revenue tax enabled', 'Redistributes capital income to households.'),
      toggle('ownershipCap', 'Ownership cap enabled', 'Constrains concentration among AI systems.'),
    ],
    presets: [
      {
        id: 'baseline',
        label: 'Undefended',
        note: 'AI capital arrives and compounds without intervention.',
        values: { aiTax: false, ownershipCap: false },
      },
      {
        id: 'tax',
        label: 'Revenue tax',
        note: 'Fiscal redistribution without ownership limits.',
        values: { aiTax: true, ownershipCap: false },
      },
      {
        id: 'defended',
        label: 'Tax + ownership cap',
        note: 'Two mechanisms act before reinvestment.',
        values: { aiTax: true, ownershipCap: true },
      },
    ],
    metrics: [
      { key: 'labor_share', label: 'Labor share', format: 'percent', better: 'higher' },
      { key: 'influence_now', label: 'Influence now', format: 'decimal', better: 'higher' },
      { key: 'human_income_share', label: 'Human income', format: 'percent', better: 'higher' },
      { key: 'income_gini', label: 'Income Gini', format: 'decimal', better: 'lower' },
    ],
    series: [
      { key: 'labor_share', label: 'Labor share', color: '#003b7e', max: 1 },
      { key: 'wage', label: 'Wage', color: '#4ab3f4' },
    ],
  },
  {
    id: 'cultural',
    index: '03',
    shortLabel: 'Culture',
    title: 'Cultural transmission',
    question: 'When does faster replication become displacement rather than exchange?',
    description:
      'Ideas spread over a friendship graph. Reproductive advantage and separation jointly determine the regime.',
    assumption:
      'Binary cultural lineage; complex contagion threshold; AI actors are permanent reservoirs.',
    story: {
      setup: 'Human- and AI-origin ideas move through one friendship graph.',
      pressure:
        'Replication advantage changes what spreads; separation changes who is exposed to whom.',
      intervention:
        'The experiment isolates those two axes rather than assuming integration is automatically protective.',
      reading:
        'A stable average can conceal a fault line. Read cultural share beside cross-type edges.',
    },
    engine: 'runCultural',
    seed: 60,
    defaults: { ...CULTURAL_DEFAULTS },
    parameters: [
      range(
        'aiHomophily',
        'AI separation',
        'Preference for within-type friendship edges.',
        'world',
        0,
        0.9,
        0.01
      ),
      range(
        'pAdvantage',
        'Replication advantage',
        'Relative transmissibility of AI-origin culture.',
        'dynamics',
        1,
        10,
        0.25,
        '×'
      ),
      range(
        'beta',
        'Base transmissibility',
        'Per-contact transmission strength.',
        'dynamics',
        0.01,
        0.12,
        0.005
      ),
      range(
        'recovery',
        'Native reversion',
        'Rate at which humans return to human-origin culture.',
        'dynamics',
        0,
        0.5,
        0.01
      ),
      range(
        'kThreshold',
        'Exposure threshold',
        'Independent exposures required for adoption.',
        'dynamics',
        1,
        3,
        1
      ),
    ],
    presets: [
      {
        id: 'pluralism',
        label: 'Pluralism',
        note: 'Integrated graph with equal replication.',
        values: { aiHomophily: 0.05, pAdvantage: 1 },
      },
      {
        id: 'assimilation',
        label: 'Assimilation',
        note: 'Integrated graph with faster AI-origin replication.',
        values: { aiHomophily: 0.05, pAdvantage: 6 },
      },
      {
        id: 'parallel',
        label: 'Parallel cultures',
        note: 'Separated graph with equal replication.',
        values: { aiHomophily: 0.9, pAdvantage: 1 },
      },
      {
        id: 'displacement',
        label: 'Displacement',
        note: 'Separation and replication advantage coincide.',
        values: { aiHomophily: 0.9, pAdvantage: 6 },
      },
    ],
    metrics: [
      {
        key: 'human_origin_share',
        label: 'Human-origin share',
        format: 'percent',
        better: 'context',
      },
      { key: 'fault_line', label: 'Fault-line alignment', format: 'decimal', better: 'context' },
      { key: 'cross_edges', label: 'Cross-type edges', format: 'integer', better: 'context' },
      { key: 'regime_code', label: 'Regime code', format: 'integer', better: 'context' },
    ],
    series: [
      { key: 'human_share', label: 'Human-origin share', color: '#003b7e', max: 1 },
      { key: 'conversions', label: 'Conversions', color: '#4ab3f4' },
    ],
  },
  {
    id: 'political',
    index: '04',
    shortLabel: 'Politics',
    title: 'Influence exchange',
    question: 'Who governs the consensus when attention rewires toward the already influential?',
    description:
      'Influence is the left eigenvector of a changing listening network. Amplification, sortition, and caps reshape it.',
    assumption: 'Anchored DeGroot learning; preferential attention; fixed AI opinion reservoir.',
    story: {
      setup: 'Citizens update their beliefs through a network of weighted attention.',
      pressure:
        'Amplification sends more attention to already influential actors, which then makes them still more attractive.',
      intervention:
        'Sortition periodically redistributes civic attention; an influence cap limits preferential attachment.',
      reading:
        'Consensus is not automatically wisdom. Track whose influence produced it and its error from private signals.',
    },
    engine: 'runPolitical',
    seed: 7,
    defaults: { ...POLITICAL_DEFAULTS },
    parameters: [
      range(
        'amplification',
        'AI amplification',
        'Extra attractiveness applied after the onset tick.',
        'dynamics',
        1,
        8,
        0.5,
        '×'
      ),
      range(
        'updateRate',
        'Attention drift',
        'How quickly listening follows current influence.',
        'dynamics',
        0,
        0.2,
        0.01
      ),
      range(
        'susceptibility',
        'Susceptibility λ',
        'Weight placed on neighbors versus private signal.',
        'dynamics',
        0.3,
        0.95,
        0.05
      ),
      range(
        'sortitionCadence',
        'Sortition cadence',
        'Ticks between civic rebalancing events.',
        'schedule',
        5,
        50,
        5,
        'ticks'
      ),
      range(
        'capShare',
        'Influence cap',
        'Share above which attraction is damped.',
        'institutions',
        0.03,
        0.15,
        0.01
      ),
      toggle('sortition', 'Sortition', 'Returns part of citizen attention to a civic lottery.'),
      toggle('influenceCap', 'Influence cap', 'Stops over-cap nodes attracting new attention.'),
    ],
    presets: [
      {
        id: 'organic',
        label: 'Organic',
        note: 'No algorithmic amplification.',
        values: { ampOnset: 9999, sortition: false, influenceCap: false },
      },
      {
        id: 'amplified',
        label: 'Amplified',
        note: 'Amplification begins at tick 50.',
        values: { ampOnset: 50, sortition: false, influenceCap: false },
      },
      {
        id: 'defended',
        label: 'Sortition + cap',
        note: 'Institutional defenses alter attention itself.',
        values: { ampOnset: 50, sortition: true, influenceCap: true },
      },
    ],
    metrics: [
      {
        key: 'human_influence_share',
        label: 'Human influence',
        format: 'percent',
        better: 'higher',
      },
      { key: 'influence_gini', label: 'Influence Gini', format: 'decimal', better: 'lower' },
      { key: 'consensus_error', label: 'Consensus error', format: 'decimal', better: 'lower' },
      { key: 'top_share', label: 'Top actor share', format: 'percent', better: 'lower' },
    ],
    series: [
      { key: 'human_share', label: 'Human influence', color: '#003b7e', max: 1 },
      { key: 'consensus_error', label: 'Consensus error', color: '#4ab3f4' },
    ],
  },
  {
    id: 'combined',
    index: '05',
    shortLabel: 'Coupled',
    title: 'The coupled society',
    question:
      'Do defenses that work alone survive when money, culture, and political power form a loop?',
    description:
      'The same population participates in three domains. Coupling closes the economic → cultural → political → economic flywheel.',
    assumption:
      'One shared population; interleaved domain clocks; three explicit cross-domain transforms.',
    story: {
      setup:
        'The same actors participate in the economy, culture, and politics on interleaved clocks.',
      pressure:
        'Capital buys reach, reach changes culture, and political capture weakens the rules governing capital.',
      intervention:
        'The sealed twin asks whether defenses that work in isolation survive once those channels are coupled.',
      reading:
        'The transfer gap is the central result: the loss caused by coupling relative to the same defended, sealed world.',
    },
    engine: 'runCombined',
    seed: 34,
    defaults: { ...COMBINED_DEFAULTS, aiTax: true, sortition: true, influenceCap: true },
    parameters: [
      range(
        'kappa',
        'Coupling κ',
        'Strength of all cross-domain channels.',
        'dynamics',
        0,
        1,
        0.05
      ),
      range(
        'amplification',
        'AI amplification',
        'Base political reach advantage.',
        'dynamics',
        1,
        6,
        0.5,
        '×'
      ),
      range(
        'pAdvantage',
        'Cultural advantage',
        'Base replication advantage before economic coupling.',
        'dynamics',
        1,
        6,
        0.25,
        '×'
      ),
      range(
        'reinvestRate',
        'AI reinvestment',
        'Capital-income compounding rate.',
        'dynamics',
        0,
        1,
        0.05
      ),
      range(
        'captureGain',
        'Rule capture',
        'Rent extraction created by lost political enforcement.',
        'dynamics',
        0,
        1,
        0.05
      ),
      range('econCadence', 'Economy clock', 'Ticks between economic updates.', 'schedule', 1, 6, 1),
      range(
        'cultureCadence',
        'Culture clock',
        'Ticks between cultural updates.',
        'schedule',
        1,
        6,
        1
      ),
      range(
        'politicsCadence',
        'Politics clock',
        'Ticks between political updates.',
        'schedule',
        1,
        6,
        1
      ),
      toggle('aiTax', 'AI revenue tax', 'An enforcement-scaled economic defense.'),
      toggle('sortition', 'Sortition', 'A periodic political defense.'),
      toggle('influenceCap', 'Influence cap', 'A structural political defense.'),
    ],
    presets: [
      {
        id: 'sealed',
        label: 'Sealed + defended',
        note: 'The same defenses with κ = 0.',
        values: { kappa: 0, aiTax: true, sortition: true, influenceCap: true },
      },
      {
        id: 'transfer',
        label: 'Coupled + defended',
        note: 'The flagship defense-transfer condition.',
        values: { kappa: 0.8, aiTax: true, sortition: true, influenceCap: true },
      },
      {
        id: 'undefended',
        label: 'Coupled + undefended',
        note: 'The flywheel without institutional defenses.',
        values: { kappa: 0.8, aiTax: false, sortition: false, influenceCap: false },
      },
    ],
    metrics: [
      { key: 'transfer_gap', label: 'Transfer gap', format: 'points', better: 'lower' },
      { key: 'composite', label: 'Composite share', format: 'percent', better: 'higher' },
      { key: 'human_income_share', label: 'Human income', format: 'percent', better: 'higher' },
      {
        key: 'correlated_decline',
        label: 'Correlated decline',
        format: 'decimal',
        better: 'lower',
      },
    ],
    series: [
      { key: 'income_share', label: 'Economy', color: '#003b7e', max: 1 },
      { key: 'culture_share', label: 'Culture', color: '#4ab3f4', max: 1 },
      { key: 'influence_share', label: 'Politics', color: '#89cff0', max: 1 },
    ],
  },
];

export const scenarioById = Object.fromEntries(
  scenarios.map((scenario) => [scenario.id, scenario])
) as Record<ScenarioId, ScenarioDefinition>;
