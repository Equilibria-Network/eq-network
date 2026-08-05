import { useEffect, useState } from 'react';
import type { Trajectory } from '../engine/types';

/** The playhead state machine, mirroring App.tsx's inline loop: a playhead in
    fractional ticks, an optional play-to target, and a ~25 fps redraw cap.
    Deliberate duplication — unifying with App.tsx means refactoring the
    canonical page's state, which task-0006 defers. */
export function usePlayback(trajectory: Trajectory | null) {
  const [playhead, setPlayhead] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [playTarget, setPlayTarget] = useState<number | null>(null);

  useEffect(() => {
    if (!playing || !trajectory) return;
    let request = 0;
    let previous = performance.now();
    let lastDraw = 0;
    const animate = (now: number) => {
      const elapsed = Math.min(0.25, (now - previous) / 1000);
      previous = now;
      if (now - lastDraw >= 40) {
        lastDraw = now;
        setPlayhead((current) => {
          const end = Math.min(playTarget ?? trajectory.meta.T - 1, trajectory.meta.T - 1);
          // 10 ticks/s per speed unit — half of App.tsx's rate. The showcase's
          // packet scenes redraw continuously, so the tick rate is also the
          // motion rate; it stays low deliberately (photosensitivity).
          const next = Math.min(current + elapsed * speed * 10, end);
          if (next >= end) {
            setPlaying(false);
            setPlayTarget(null);
          }
          return next;
        });
      }
      request = window.requestAnimationFrame(animate);
    };
    request = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(request);
  }, [playTarget, playing, speed, trajectory]);

  const tick = Math.min(Math.floor(playhead), Math.max(0, (trajectory?.meta.T ?? 1) - 1));
  const fraction = playhead - tick;

  return {
    tick,
    fraction,
    playing,
    speed,
    setPlayhead,
    setPlaying,
    setSpeed,
    setPlayTarget,
  };
}
