/** The scheduled() availability window, rendered — NOT model dynamics.
    Mirrors the engine definition at src/cilib/core/schedule.py::scheduled:

        fires(t) = (t >= onset) && ((t - phase_offset) % cadence == 0)

    Parameter names match the engine (cadence, phase_offset, onset). A golden
    fixture (schedule-golden.json, Phase 2) pins this mirror to the engine;
    until then the contracts test checks the closed form. DOM-free on purpose
    so node --test can import it. */
export function scheduleFires(
  t: number,
  cadence: number,
  phaseOffset: number,
  onset: number
): boolean {
  return t >= onset && mod(t - phaseOffset, cadence) === 0;
}

/** Python's % (the engine's semantics) — JS % differs on negatives. */
function mod(a: number, n: number): number {
  return ((a % n) + n) % n;
}

export function scheduleWindow(
  ticks: number,
  cadence: number,
  phaseOffset: number,
  onset: number
): boolean[] {
  return Array.from({ length: ticks }, (_, t) => scheduleFires(t, cadence, phaseOffset, onset));
}
