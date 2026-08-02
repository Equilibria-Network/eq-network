import { useEffect, useRef } from 'react';
import type { ScenarioId, Trajectory } from '../engine/types';

interface Props {
  scenario: ScenarioId;
  trajectory: Trajectory;
  tick: number;
}

const NAVY = '#003b7e';
const BLUE = '#4ab3f4';
const PALE = '#dceef9';
const INK = '#15293d';

function fitCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const context = canvas.getContext('2d');
  context?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return context;
}

function valueAt(values: Float64Array | undefined, tick: number, node: number, n: number): number {
  if (!values) return 0;
  if (values.length >= (tick + 1) * n) return values[tick * n + node] ?? 0;
  return values[node] ?? 0;
}

function drawGrid(context: CanvasRenderingContext2D, width: number, height: number): void {
  context.fillStyle = '#fbfdff';
  context.fillRect(0, 0, width, height);
  context.strokeStyle = 'rgba(0, 59, 126, 0.075)';
  context.lineWidth = 1;
  for (let x = 24.5; x < width; x += 24) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let y = 24.5; y < height; y += 24) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
}

function drawNode(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  fill: string,
  active = true
): void {
  context.globalAlpha = active ? 1 : 0.25;
  context.fillStyle = fill;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = '#fff';
  context.lineWidth = 1.5;
  context.stroke();
  context.globalAlpha = 1;
}

function drawEconomy(
  context: CanvasRenderingContext2D,
  trajectory: Trajectory,
  tick: number,
  width: number,
  height: number
): void {
  const n = trajectory.meta.N;
  const humanCount = Number(trajectory.meta.params.nHouseholds) || 20;
  const baseY = height - 42;
  const gap = (width - 56) / n;
  const capitals = trajectory.node.capital;
  let maxCapital = 1;
  for (let i = 0; i < n; i += 1) {
    maxCapital = Math.max(maxCapital, valueAt(capitals, tick, i, n));
  }

  for (let i = 0; i < n; i += 1) {
    const isAi = i >= humanCount;
    const capital = valueAt(capitals, tick, i, n);
    const labor = valueAt(trajectory.node.labor_supply, tick, i, n);
    const barHeight = isAi
      ? Math.max(5, (Math.log1p(capital) / Math.log1p(maxCapital)) * (height - 105))
      : Math.max(5, Math.min(1, labor / 2) * (height - 145));
    context.fillStyle = isAi ? BLUE : NAVY;
    context.fillRect(28 + i * gap, baseY - barHeight, Math.max(3, gap - 2), barHeight);
  }

  context.fillStyle = INK;
  context.font = '11px "IBM Plex Mono", monospace';
  context.textAlign = 'left';
  context.fillText('HUMAN LABOUR', 28, height - 18);
  context.textAlign = 'right';
  context.fillText('AI CAPITAL', width - 28, height - 18);
}

/** Both surviving network scenarios — WP2's culture (listening) and WP3's
    politics (delegation) — carry a row-stochastic matrix under `adj.listening`
    plus a per-node influence, so the flag that used to switch this between a
    listening graph and the deleted contagion model's friendship graph is gone. */
function drawNetwork(
  context: CanvasRenderingContext2D,
  trajectory: Trajectory,
  tick: number,
  width: number,
  height: number
): void {
  const n = trajectory.meta.N;
  const cols = Math.ceil(Math.sqrt(n * (width / height)));
  const rows = Math.ceil(n / cols);
  const points = Array.from({ length: n }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const jitterX = Math.sin((i + 1) * 12.9898) * 8;
    const jitterY = Math.cos((i + 1) * 7.233) * 7;
    return {
      x: 42 + (col / Math.max(1, cols - 1)) * (width - 84) + jitterX,
      y: 40 + (row / Math.max(1, rows - 1)) * (height - 80) + jitterY,
    };
  });
  const adjacency = trajectory.adj?.listening;
  if (adjacency) {
    context.strokeStyle = 'rgba(0, 59, 126, 0.12)';
    context.lineWidth = 0.7;
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const edge = adjacency[i * n + j] ?? adjacency[j * n + i] ?? 0;
        if (edge <= 0.08) continue;
        context.beginPath();
        context.moveTo(points[i].x, points[i].y);
        context.lineTo(points[j].x, points[j].y);
        context.stroke();
      }
    }
  }
  for (let i = 0; i < n; i += 1) {
    const isAi = (trajectory.static.is_ai?.[i] ?? 0) > 0.5;
    const influence = valueAt(trajectory.node.influence, tick, i, n);
    const radius = 4 + Math.min(13, influence * n * 2.2);
    drawNode(context, points[i].x, points[i].y, radius, isAi ? BLUE : NAVY);
  }
}

function drawCombined(
  context: CanvasRenderingContext2D,
  trajectory: Trajectory,
  tick: number,
  width: number,
  height: number
): void {
  const domains = [
    ['MONEY', trajectory.global.human_income_share[tick] ?? 0],
    ['ATTENTION', trajectory.global.human_attention_share[tick] ?? 0],
    ['VOTES', trajectory.global.human_power_share[tick] ?? 0],
  ] as const;
  const centerY = height * 0.52;
  const centers = domains.map((_, i) => ({ x: width * (0.2 + i * 0.3), y: centerY }));

  context.strokeStyle = BLUE;
  context.lineWidth = 2;
  context.setLineDash([6, 5]);
  for (let i = 0; i < centers.length; i += 1) {
    const next = centers[(i + 1) % centers.length];
    context.beginPath();
    context.moveTo(centers[i].x, centers[i].y);
    context.lineTo(next.x, next.y);
    context.stroke();
  }
  context.setLineDash([]);

  domains.forEach(([label, share], index) => {
    const { x, y } = centers[index];
    const radius = 32 + Math.max(0, Math.min(1, share)) * 42;
    context.fillStyle = index === 1 ? PALE : index === 2 ? '#eef4f8' : '#e5f4fc';
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = index === 1 ? BLUE : NAVY;
    context.lineWidth = 2;
    context.stroke();
    context.fillStyle = NAVY;
    context.textAlign = 'center';
    context.font = '500 24px "Space Grotesk", sans-serif';
    context.fillText(`${Math.round(share * 100)}%`, x, y + 3);
    context.font = '11px "IBM Plex Mono", monospace';
    context.fillText(label, x, y + 23);
  });
}

export default function SimulationCanvas({ scenario, trajectory, tick }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = () => {
      const context = fitCanvas(canvas);
      if (!context) return;
      const { width, height } = canvas.getBoundingClientRect();
      drawGrid(context, width, height);
      if (scenario === 'economy') drawEconomy(context, trajectory, tick, width, height);
      if (scenario === 'culture' || scenario === 'politics')
        drawNetwork(context, trajectory, tick, width, height);
      if (scenario === 'combined') drawCombined(context, trajectory, tick, width, height);
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [scenario, tick, trajectory]);

  return (
    <canvas
      className="simulation-canvas"
      ref={canvasRef}
      role="img"
      aria-label={`${scenario} simulation at tick ${tick}`}
    />
  );
}
