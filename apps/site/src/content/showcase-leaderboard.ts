import type { LabContent, Scenario } from './lab';

/** The showcase scoreboard (task-0007, owner direction 2026-08-07): the
    /lab leaderboard reshaped for the scroll page. Columns are only the GD
    models the page presents — the three machines and the coupled world, in
    the page's own vocabulary — and rows are defense PORTFOLIOS
    (compositions of mechanisms, the benchmark's actual unit), including
    rival versions, so the board reads as "the best score so far, per
    scenario". All numbers are hand-written illustrations of the intended
    shape; the badge and caption say so. */

export const showcaseLeaderboardScenarios: Pick<Scenario, 'id' | 'shortName'>[] = [
  { id: 'economic', shortName: 'Money' },
  { id: 'cultural', shortName: 'Attention' },
  { id: 'political', shortName: 'Votes' },
  { id: 'combined', shortName: 'Coupled' },
];

export const showcaseLeaderboard: LabContent['leaderboard'] = {
  title: 'The best score per scenario',
  caption:
    'Illustrative data — hand-written to show the intended shape. No real benchmark rows exist for these models yet; they land here as the suite goes live.',
  note: 'Read column by column: each cell is how much collective human influence a portfolio preserves in that scenario, and the column’s best is the score to beat. Portfolios transfer worse into the coupled world than their single-domain scores suggest — that gap is the finding this suite exists to measure — and version two of a portfolio exists because someone disagreed with version one.',
  columns: ['economic', 'cultural', 'political', 'combined'],
  rows: [
    {
      mechanism: 'Undefended baseline',
      scores: { economic: 0.31, cultural: 0.28, political: 0.24, combined: 0.12 },
    },
    {
      mechanism: 'AI-revenue tax, alone',
      scores: { economic: 0.72, combined: 0.38 },
    },
    {
      mechanism: 'Attention cap + civic sortition',
      scores: { cultural: 0.66, combined: 0.41 },
    },
    {
      mechanism: 'Kept ballot + re-delegation churn',
      scores: { political: 0.68, combined: 0.31 },
    },
    {
      mechanism: 'Portfolio v1 — tax + attention cap + kept ballot + self-repair',
      scores: { economic: 0.69, cultural: 0.62, political: 0.64, combined: 0.52 },
    },
    {
      mechanism: 'Portfolio v2 — v1 with lobbying rebalanced toward citizens',
      scores: { economic: 0.7, cultural: 0.63, political: 0.66, combined: 0.58 },
    },
  ],
};
