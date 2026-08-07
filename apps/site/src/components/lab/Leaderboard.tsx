// src/components/lab/Leaderboard.tsx
import styles from './Leaderboard.module.css';
import { labContent, type LabContent, type Scenario, type ScenarioId } from '@content/lab';

const { leaderboard: leaderboardUi } = labContent.ui;

interface LeaderboardProps {
  leaderboard: LabContent['leaderboard'];
  /** Only id and shortName are read, so reusers (the showcase scoreboard)
      can pass a light column-name list instead of full lab scenarios. */
  scenarios: Pick<Scenario, 'id' | 'shortName'>[];
  /** Overrides the first-column header; defaults to the lab's "Mechanism".
      The showcase passes "Portfolio" — its rows are compositions. */
  firstColumnHeader?: string;
}

export default function Leaderboard({
  leaderboard,
  scenarios,
  firstColumnHeader,
}: LeaderboardProps) {
  const shortNames = new Map<ScenarioId, string>(
    scenarios.map((scenario) => [scenario.id, scenario.shortName])
  );

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{leaderboard.title}</h2>
        <p className={styles.caption}>
          <span className={styles.illustrativeBadge}>{leaderboardUi.illustrativeBadge}</span>
          {leaderboard.caption}
        </p>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.mechanismHeader}>
                  {firstColumnHeader ?? leaderboardUi.mechanismHeader}
                </th>
                {leaderboard.columns.map((columnId) => (
                  <th
                    key={columnId}
                    className={columnId === 'combined' ? styles.combinedHeader : undefined}
                  >
                    {shortNames.get(columnId) ?? columnId}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaderboard.rows.map((row) => (
                <tr key={row.mechanism}>
                  <td className={styles.mechanismCell}>{row.mechanism}</td>
                  {leaderboard.columns.map((columnId) => {
                    const score = row.scores[columnId];
                    return (
                      <td
                        key={columnId}
                        className={columnId === 'combined' ? styles.combinedCell : undefined}
                      >
                        {score !== undefined ? score.toFixed(2) : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className={styles.note}>{leaderboard.note}</p>
      </div>
    </section>
  );
}
