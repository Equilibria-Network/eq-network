import { useLayoutEffect, useMemo, useRef } from 'react';
import type { ScenarioId, Trajectory } from '../engine/types';
import {
  ALERT_RED,
  clip,
  INK,
  LABEL,
  MECH_BLUE,
  MECH_ORANGE,
  NAVY,
  Sketch,
  svgElement,
} from '../rendering/sketch';

interface ChartLine {
  values: Float64Array;
  color: string;
  dash?: boolean;
  note?: string;
}

interface ChartDefinition {
  label: string;
  max?: number;
  lines: ChartLine[];
}

interface ChartGeometry {
  top: number;
  bottom: number;
  x: (tick: number) => number;
}

function constant(length: number, value: number): Float64Array {
  return new Float64Array(length).fill(value);
}

function definitions(scenario: ScenarioId, trajectory: Trajectory): ChartDefinition[] {
  const T = trajectory.meta.T;
  if (scenario === 'economy') {
    return [
      {
        // the crossing is the model: capital compounds only above the line
        label: 'CAPABILITY AGAINST THE SURVIVAL THRESHOLD',
        lines: [
          { values: trajectory.global.capability, color: INK, note: 'e' },
          {
            values: trajectory.global.survival_threshold,
            color: LABEL,
            dash: true,
            note: 'e*',
          },
        ],
      },
      {
        label: 'HUMAN SHARE OF VALUE ADDED',
        max: 1.05,
        lines: [
          { values: trajectory.global.human_sector_share, color: INK, note: 'human share' },
          {
            values: trajectory.global.ai_wealth_share,
            color: LABEL,
            dash: true,
            note: 'AI-held wealth',
          },
        ],
      },
    ];
  }
  if (scenario === 'polity') {
    return [
      {
        label: 'THE PEOPLE’S SHARE OF THE VOTE',
        max: 1.05,
        lines: [
          { values: trajectory.global.human_power_share, color: INK },
          { values: trajectory.global.top_share, color: ALERT_RED, note: 'biggest single holder' },
        ],
      },
      {
        label: 'THE ENACTED TAX RATE (the citizens’ best rate is 0.4)',
        max: 1.05,
        lines: [
          { values: trajectory.global.enacted_rate, color: INK, note: 'enacted' },
          { values: trajectory.global.regime, color: MECH_ORANGE, note: 'rules in force' },
        ],
      },
    ];
  }
  if (scenario === 'political') {
    return [
      {
        label: 'HUMAN SHARE OF INFLUENCE',
        max: 1.05,
        lines: [
          { values: trajectory.global.human_share, color: INK },
          {
            values: constant(T, trajectory.meta.scalars.fair_human_share),
            color: LABEL,
            dash: true,
            note: 'fair share',
          },
        ],
      },
      {
        label: 'CONSENSUS ERROR (truth = 0, AI bias = 2)',
        max: 2.1,
        lines: [
          {
            values: trajectory.global.consensus_error,
            color: ALERT_RED,
            note: 'drift toward the reservoir',
          },
        ],
      },
    ];
  }
  return [
    {
      label: 'THE PEOPLE’S SHARE OF MONEY, ATTENTION AND VOTES',
      max: 1.05,
      lines: [
        { values: trajectory.global.human_income_share, color: INK, note: 'money' },
        { values: trajectory.global.human_attention_share, color: ALERT_RED, note: 'attention' },
        { values: trajectory.global.human_power_share, color: MECH_BLUE, note: 'votes' },
      ],
    },
    {
      label: 'WHAT THE CONNECTIONS COST (against the same world with them switched off)',
      // both lines are shares in [0, 1] — enforcement rests near 0.68 at the
      // defaults, so the old 0.6 ceiling clipped it flat against the top
      max: 1.05,
      lines: [
        { values: trajectory.global.transfer_gap, color: INK, note: 'gap' },
        {
          values: trajectory.global.enforcement,
          color: MECH_ORANGE,
          note: 'tax actually collected',
        },
      ],
    },
  ];
}

export default function ScenarioCharts({
  scenario,
  tick,
  trajectory,
}: {
  scenario: ScenarioId;
  tick: number;
  trajectory: Trajectory;
}) {
  const staticRef = useRef<SVGGElement>(null);
  const dynamicRef = useRef<SVGGElement>(null);
  const geometryRef = useRef<ChartGeometry[]>([]);
  const charts = useMemo(() => definitions(scenario, trajectory), [scenario, trajectory]);
  const chartHeight = 82;
  const height = charts.length * chartHeight + 8;

  useLayoutEffect(() => {
    const group = staticRef.current;
    if (!group) return;
    group.replaceChildren();
    const width = 880;
    const padding = { left: 46, right: 14, top: 16, bottom: 4 };
    geometryRef.current = charts.map((chart, chartIndex) => {
      const top = chartIndex * chartHeight + padding.top;
      const bottom = top + chartHeight - padding.top - padding.bottom;
      const x0 = padding.left;
      const x1 = width - padding.right;
      const x = (time: number) => x0 + (time / Math.max(1, trajectory.meta.T - 1)) * (x1 - x0);
      const maximum =
        chart.max ?? Math.max(...chart.lines.map((line) => Math.max(...line.values)), 1e-9) * 1.12;
      const y = (value: number) => bottom - clip(value / maximum, 0, 1) * (bottom - top);
      for (let gridTick = 100; gridTick < trajectory.meta.T; gridTick += 100) {
        Sketch.plainLine(group, x(gridTick), top, x(gridTick), bottom, '#e4e0d7', 1, '4,5');
      }
      Sketch.plainLine(group, x0, (top + bottom) / 2, x1, (top + bottom) / 2, '#e4e0d7', 1, '4,5');
      Sketch.plainLine(group, x0, bottom, x1, bottom, '#c9c4ba');
      Sketch.plainLine(group, x0, top, x0, bottom, '#c9c4ba');
      Sketch.text(group, x0 - 4, top + 4, String(Math.round(maximum)), {
        size: 10,
        color: LABEL,
        anchor: 'end',
      });
      Sketch.text(group, x0 - 4, bottom, '0', {
        size: 10,
        color: LABEL,
        anchor: 'end',
      });
      Sketch.text(group, x0, top - 6, chart.label, {
        size: 10,
        color: LABEL,
        spacing: 1,
      });
      chart.lines.forEach((line, lineIndex) => {
        const step = Math.max(1, Math.floor(trajectory.meta.T / 140));
        const points: Array<[number, number]> = [];
        for (let time = 0; time < trajectory.meta.T; time += step) {
          points.push([x(time), y(line.values[time])]);
        }
        Sketch.path(group, points, {
          seed: chartIndex * 13 + lineIndex * 5 + 3,
          stroke: line.color,
          width: line.dash ? 1.1 : 1.5,
          roughness: line.dash ? 0.4 : 0.5,
          dash: line.dash ? '5,4' : '',
          opacity: line.dash ? 0.8 : 1,
        });
        if (line.note) {
          Sketch.text(group, x1 - 4, y(line.values[trajectory.meta.T - 1]) - 5, line.note, {
            size: 11.5,
            color: line.color,
            hand: true,
            anchor: 'end',
            opacity: 0.85,
          });
        }
      });
      return { top, bottom, x };
    });
    Sketch.text(group, width - padding.right, height - 2, `0 → ${trajectory.meta.T} ticks`, {
      size: 10,
      color: LABEL,
      anchor: 'end',
    });
  }, [charts, height, trajectory]);

  useLayoutEffect(() => {
    const group = dynamicRef.current;
    if (!group) return;
    group.replaceChildren();
    geometryRef.current.forEach((geometry) => {
      const x = geometry.x(tick);
      Sketch.plainLine(group, x, geometry.top - 2, x, geometry.bottom, NAVY, 1.2);
      svgElement(
        'path',
        {
          d: `M${x - 3.5} ${geometry.top - 6} L${x + 3.5} ${geometry.top - 6} L${x} ${
            geometry.top - 1
          } Z`,
          fill: NAVY,
        },
        group
      );
    });
  }, [tick]);

  return (
    <div className="scenario-charts">
      <svg
        aria-label="Time-series charts for the current run"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        viewBox={`0 0 880 ${height}`}
      >
        <g ref={staticRef} />
        <g ref={dynamicRef} />
      </svg>
    </div>
  );
}
