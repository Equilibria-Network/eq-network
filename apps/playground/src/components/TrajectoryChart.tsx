import { useEffect, useRef } from 'react';
import type { SeriesDefinition, Trajectory } from '../engine/types';

interface Props {
  trajectory: Trajectory;
  series: SeriesDefinition[];
  tick: number;
}

export default function TrajectoryChart({ trajectory, series, tick }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      const context = canvas.getContext('2d');
      if (!context) return;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const width = rect.width;
      const height = rect.height;
      const inset = { left: 34, right: 12, top: 12, bottom: 24 };
      const plotWidth = width - inset.left - inset.right;
      const plotHeight = height - inset.top - inset.bottom;

      context.clearRect(0, 0, width, height);
      context.strokeStyle = 'rgba(0, 59, 126, 0.13)';
      context.lineWidth = 1;
      for (let line = 0; line <= 4; line += 1) {
        const y = inset.top + (line / 4) * plotHeight;
        context.beginPath();
        context.moveTo(inset.left, y + 0.5);
        context.lineTo(width - inset.right, y + 0.5);
        context.stroke();
      }

      const arrays = series
        .map((definition) => ({ definition, values: trajectory.global[definition.key] }))
        .filter((entry) => entry.values);
      const upper = Math.max(
        1e-9,
        ...arrays.map(({ definition, values }) => definition.max ?? Math.max(...values))
      );
      arrays.forEach(({ definition, values }) => {
        context.strokeStyle = definition.color;
        context.lineWidth = 2;
        context.beginPath();
        for (let index = 0; index < values.length; index += 1) {
          const x = inset.left + (index / Math.max(1, values.length - 1)) * plotWidth;
          const y = inset.top + plotHeight - (Math.max(0, values[index]) / upper) * plotHeight;
          if (index === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      });

      const playheadX = inset.left + (tick / Math.max(1, trajectory.meta.T - 1)) * plotWidth;
      context.strokeStyle = '#15293d';
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(playheadX + 0.5, inset.top);
      context.lineTo(playheadX + 0.5, inset.top + plotHeight);
      context.stroke();

      context.fillStyle = '#607384';
      context.font = '10px "IBM Plex Mono", monospace';
      context.textAlign = 'left';
      context.fillText('0', inset.left, height - 7);
      context.textAlign = 'right';
      context.fillText(`${trajectory.meta.T - 1}`, width - inset.right, height - 7);
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [series, tick, trajectory]);

  return (
    <div className="trajectory-chart">
      <canvas ref={canvasRef} aria-label={`Trajectory chart through tick ${tick}`} role="img" />
      <div className="chart-legend" aria-hidden="true">
        {series.map((item) => (
          <span key={item.key}>
            <i style={{ background: item.color }} /> {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
