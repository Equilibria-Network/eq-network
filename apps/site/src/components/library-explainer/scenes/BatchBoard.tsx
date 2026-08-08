import { useEffect, useState } from 'react';
import { subsetRow, subsets } from '../fixtures';

/** The compiler scene: toggle transforms in and out of the pipeline and see
    the execution batches the engine derived. Every (edges, batches) pair is a
    row of pipeline-subsets.json, exported from compile_pipeline itself — the
    page holds no ordering logic, it indexes an array by bitmask. */
export default function BatchBoard({ enabled: enabled0 }: { enabled: number[] }) {
  const [enabled, setEnabled] = useState(enabled0);
  useEffect(() => setEnabled(enabled0), [enabled0]);

  const row = subsetRow(enabled);
  const names = subsets.transforms.map((t) => t.name);

  const toggle = (i: number) =>
    setEnabled((current) =>
      current.includes(i) ? current.filter((j) => j !== i) : [...current, i].sort((a, b) => a - b)
    );

  return (
    <div className="libx-scene libx-batchboard">
      <div className="libx-chiprow" role="group" aria-label="Transforms in the pipeline">
        {subsets.transforms.map((t, i) => (
          <button
            key={t.name}
            type="button"
            className={enabled.includes(i) ? 'libx-chip libx-chip-on' : 'libx-chip'}
            aria-pressed={enabled.includes(i)}
            onClick={() => toggle(i)}
          >
            {t.name}
            {t.schedule ? (
              <span className="libx-chip-sched">every {t.schedule.cadence}</span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="libx-batches" aria-label="Derived execution batches">
        {row.batches.length === 0 ? (
          <p className="libx-caption">Nothing enabled — the pipeline is empty.</p>
        ) : (
          row.batches.map((batch, b) => (
            <div key={b} className="libx-batch">
              <span className="libx-batch-label">batch {b}</span>
              {batch.map((i) => (
                <span key={i} className="libx-batch-item">
                  {names[i]}
                </span>
              ))}
            </div>
          ))
        )}
      </div>

      {row.edges.length > 0 && (
        <ul className="libx-hazards" aria-label="Data hazards between enabled transforms">
          {row.edges.map(([i, j, kinds]) => (
            <li key={`${i}-${j}`}>
              <span className="libx-hazard-pair">
                {names[i]} → {names[j]}
              </span>
              {kinds.map((kind) => (
                <span key={kind} className={`libx-hazard libx-hazard-${kind.toLowerCase()}`}>
                  {kind}
                </span>
              ))}
            </li>
          ))}
        </ul>
      )}

      <p className="libx-caption">
        Transforms declare what they read and write; the compiler derives who must wait for whom.
        Two transforms with no shared field run in the same batch — in parallel.
      </p>
    </div>
  );
}
