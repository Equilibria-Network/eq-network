import { subsets } from '../fixtures';

/** A transform as the engine sees it: a name, declared reads, declared
    writes, and (optionally) a schedule. Card content comes from the subsets
    fixture's transform metadata — the same declarations compile_pipeline
    consumes. The "see the code" panel attaches here once the snippets
    fixture lands (Phase 2); until then nothing is fabricated. */
export default function TransformCard({ transforms }: { transforms: string[] }) {
  const cards = subsets.transforms.filter((t) => transforms.includes(t.name));
  return (
    <div className="libx-scene libx-cards">
      {cards.map((t) => (
        <div key={t.name} className="libx-card">
          <p className="libx-card-name">
            @transform
            <b>{t.name}</b>
            {t.schedule ? (
              <span className="libx-chip-sched">scheduled — cadence {t.schedule.cadence}</span>
            ) : null}
          </p>
          <div className="libx-card-effects">
            <div>
              <span className="libx-effects-label">reads</span>
              {t.reads.map((field) => (
                <span key={field} className="libx-effect libx-effect-read">
                  {field}
                </span>
              ))}
            </div>
            <div>
              <span className="libx-effects-label">writes</span>
              {t.writes.map((field) => (
                <span key={field} className="libx-effect libx-effect-write">
                  {field}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
      <p className="libx-caption">
        The declaration is the whole interface: no mechanism references, calls, or knows another —
        they meet in the state, through these names.
      </p>
    </div>
  );
}
