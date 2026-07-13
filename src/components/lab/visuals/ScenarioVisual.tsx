// src/components/lab/visuals/ScenarioVisual.tsx
// Looping baseline animation for one scenario: the failure unfolds in story
// beats (stable → decline begins → decline advanced → hold), then restarts.
// Perf: the rAF loop only runs during the 600ms beat transitions, and the
// whole loop pauses while the section is off-screen (all five instances mount
// at page load per the site's client:load convention).
import React, { useCallback, useEffect, useRef } from 'react';
import rough from 'roughjs';
import type { Scenario } from '@content/lab';
import type { DrawContext } from './types';
import { easeOutCubic, svgText } from './types';
import { SCENARIO_DRAWERS } from './scenarioLayouts';
import { drawInfluenceCurve } from './curve';

const BEAT_INTERVAL_MS = 1600;
const TWEEN_MS = 1100;

interface ScenarioVisualProps {
  scenario: Scenario;
  className?: string;
}

export default function ScenarioVisual({ scenario, className }: ScenarioVisualProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const tRef = useRef(0);
  const beatRef = useRef(0);
  const rafRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const draw = useCallback(
    (t: number) => {
      const svg = svgRef.current;
      const { width, height } = sizeRef.current;
      if (!svg || width < 10 || height < 10) return;

      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const rc = rough.svg(svg);
      const ctx: DrawContext = {
        rc,
        svg,
        width,
        height,
        t,
        seed: scenario.visual.seed,
        inDesign: scenario.status === 'in-design',
        isSmall: width < 480,
      };
      SCENARIO_DRAWERS[scenario.id](ctx);
      drawInfluenceCurve(ctx, scenario.visual.curve);
      if (ctx.inDesign) {
        // Status stamp — dashes mean "edge", so in-design is said in words.
        svgText(svg, width - 74, 16, 'IN DESIGN', 9, 0.45, '#888888');
      }
    },
    [scenario]
  );

  const tweenTo = useCallback(
    (target: number) => {
      cancelAnimationFrame(rafRef.current);
      const from = tRef.current;
      const start = performance.now();
      const frame = (now: number) => {
        const progress = Math.min(1, (now - start) / TWEEN_MS);
        tRef.current = from + (target - from) * easeOutCubic(progress);
        draw(tRef.current);
        if (progress < 1) rafRef.current = requestAnimationFrame(frame);
      };
      rafRef.current = requestAnimationFrame(frame);
    },
    [draw]
  );

  // Size tracking: redraw at the current story position on resize.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (!box) return;
      sizeRef.current = { width: box.width, height: box.height };
      const svg = svgRef.current;
      if (svg) {
        svg.setAttribute('width', String(box.width));
        svg.setAttribute('height', String(box.height));
      }
      draw(tRef.current);
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [draw]);

  // Story loop, gated on visibility and on prefers-reduced-motion.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      // No loop: show the story's end state as a static picture.
      tRef.current = 1;
      draw(1);
      return;
    }

    const beats = Math.max(2, scenario.visual.beats);
    const startLoop = () => {
      if (timerRef.current) return;
      timerRef.current = setInterval(() => {
        beatRef.current = (beatRef.current + 1) % beats;
        if (beatRef.current === 0) {
          // Hard cut back to the stable state — a loop restart, not a recovery.
          cancelAnimationFrame(rafRef.current);
          tRef.current = 0;
          draw(0);
        } else {
          tweenTo(beatRef.current / (beats - 1));
        }
      }, BEAT_INTERVAL_MS);
    };
    const stopLoop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      cancelAnimationFrame(rafRef.current);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) startLoop();
        else stopLoop();
      },
      { threshold: 0.15 }
    );
    observer.observe(wrapper);
    return () => {
      observer.disconnect();
      stopLoop();
    };
  }, [scenario, draw, tweenTo]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      role="img"
      aria-label={`${scenario.name}: collective influence declining as the baseline scenario unfolds. No mechanism is defending this system.`}
    >
      <svg ref={svgRef} aria-hidden="true" />
    </div>
  );
}
