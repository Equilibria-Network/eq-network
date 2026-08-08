import { useEffect, useState } from 'react';
import { subsets } from '../fixtures';
import { scheduleWindow } from '../schedulePredicate';

const TICKS = 30;

/** The engine's clock, drawn: every environment runs on background ticks, and
    each transform in the pipeline is placed on them by (cadence,
    phase_offset, onset). Rows come from the SAME fixture the batch board
    uses — the schedule column of the pipeline's transform table — so the
    timeline and the schedule table are one object. The quota vote row is
    live: its dials rewrite the ScheduleSpec printed beside it. Definitional
    arithmetic only (golden-pinned); nothing steps state. */
export default function ScheduleTimeline({
  cadence: cadence0,
  phaseOffset: phase0,
  onset: onset0,
}: {
  cadence: number;
  phaseOffset: number;
  onset: number;
}) {
  const [cadence, setCadence] = useState(cadence0);
  const [phaseOffset, setPhaseOffset] = useState(phase0);
  const [onset, setOnset] = useState(onset0);

  // A new scroll step re-baselines the dials; in between they're the reader's.
  useEffect(() => {
    setCadence(cadence0);
    setPhaseOffset(phase0);
    setOnset(onset0);
  }, [cadence0, phase0, onset0]);

  const rows = subsets.transforms.map((t) => {
    const isLive = t.name === 'quota_vote';
    const spec = isLive
      ? { cadence, phase_offset: phaseOffset, onset }
      : (t.schedule ?? { cadence: 1, phase_offset: 0, onset: 0 });
    return {
      name: t.name,
      isLive,
      scheduled: t.schedule !== null || isLive,
      fires: scheduleWindow(TICKS, spec.cadence, spec.phase_offset, spec.onset),
    };
  });

  return (
    <div className="libx-scene libx-timeline">
      <div
        className="libx-timeline-grid"
        role="img"
        aria-label={`Schedule timeline: ${rows.length} pipeline transforms over ${TICKS} ticks; unscheduled transforms fire every tick, the quota vote fires on its dialed window.`}
      >
        <div className="libx-timeline-row libx-timeline-axis">
          <span className="libx-timeline-name">tick</span>
          {Array.from({ length: TICKS }, (_, t) => (
            <span key={t} className="libx-timeline-ticklabel">
              {t % 5 === 0 ? t : ''}
            </span>
          ))}
        </div>
        {rows.map((row) => (
          <div
            key={row.name}
            className={row.isLive ? 'libx-timeline-row libx-timeline-live' : 'libx-timeline-row'}
          >
            <span className="libx-timeline-name">{row.name}</span>
            {row.fires.map((fire, t) => (
              <span
                key={t}
                className={fire ? 'libx-tick libx-tick-on' : 'libx-tick'}
                title={`${row.name} at t=${t}${fire ? ' — fires' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>

      <p className="libx-formula">
        (&quot;quota_vote&quot;, QuotaVoteConfig(), ScheduleSpec(cadence=<b>{cadence}</b>,
        phase_offset=<b>{phaseOffset}</b>, onset=<b>{onset}</b>))
      </p>

      <div className="libx-dials">
        <label>
          cadence <b>{cadence}</b>
          <input
            type="range"
            min={1}
            max={10}
            value={cadence}
            onChange={(event) => setCadence(Number(event.target.value))}
          />
        </label>
        <label>
          phase_offset <b>{phaseOffset}</b>
          <input
            type="range"
            min={0}
            max={9}
            value={phaseOffset}
            onChange={(event) => setPhaseOffset(Number(event.target.value))}
          />
        </label>
        <label>
          onset <b>{onset}</b>
          <input
            type="range"
            min={0}
            max={TICKS - 1}
            value={onset}
            onChange={(event) => setOnset(Number(event.target.value))}
          />
        </label>
      </div>
      <p className="libx-caption">
        The harvest and the sanction run every tick; the vote runs on its own clock. The dials
        rewrite the ScheduleSpec above — the timeline and the schedule table are the same data. An
        election is a cadence; a late-arriving defense is an onset; a one-shot is a cadence longer
        than the run.
      </p>
    </div>
  );
}
