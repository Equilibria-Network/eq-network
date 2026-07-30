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
  if (scenario === 'commons') {
    const preferenceMean =
      trajectory.static.principal_pref.reduce((sum, value) => sum + value, 0) / trajectory.meta.N;
    const quotaBound = trajectory.global.policy_target[T - 1] < Number(trajectory.meta.params.KCap);
    return [
      {
        label: 'RESOURCE STOCK',
        max: 500,
        lines: [
          { values: trajectory.global.resource_level, color: INK },
          {
            values: constant(T, Number(trajectory.meta.params.KCap)),
            color: LABEL,
            dash: true,
            note: 'carrying capacity K',
          },
        ],
      },
      {
        label: 'HARVEST PER HOUSEHOLD',
        lines: [
          { values: trajectory.global.mean_harvest, color: INK, note: 'realized' },
          {
            values: constant(T, preferenceMean),
            color: LABEL,
            dash: true,
            note: 'asked',
          },
          ...(quotaBound
            ? [
                {
                  values: trajectory.global.policy_target,
                  color: MECH_BLUE,
                  note: 'quota',
                },
              ]
            : []),
        ],
      },
    ];
  }
  if (scenario === 'economy') {
    return [
      {
        label: 'OUTPUT',
        lines: [{ values: trajectory.global.output, color: INK, note: 'Y' }],
      },
      {
        label: 'SHARE OF INCOME REACHING PEOPLE',
        max: 1.05,
        lines: [
          { values: trajectory.global.labor_share, color: INK, note: 'labor share' },
          {
            values: constant(T, Number(trajectory.meta.params.alpha)),
            color: LABEL,
            dash: true,
            note: 'α',
          },
        ],
      },
    ];
  }
  if (scenario === 'cultural') {
    return [
      {
        label: 'HUMAN-ORIGIN SHARE (among humans)',
        max: 1.05,
        lines: [
          { values: trajectory.global.human_share, color: INK },
          {
            values: constant(T, 0.5),
            color: LABEL,
            dash: true,
            note: 'midline',
          },
        ],
      },
      {
        label: 'CULTURAL FLOW PER TICK',
        lines: [
          {
            values: trajectory.global.conversions,
            color: ALERT_RED,
            note: 'to AI-origin',
          },
          {
            values: trajectory.global.reversions,
            color: NAVY,
            note: 'reverting',
          },
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
      label: 'THREE VITAL SIGNS (human share per domain)',
      max: 1.05,
      lines: [
        { values: trajectory.global.income_share, color: INK, note: 'economy (income)' },
        { values: trajectory.global.culture_share, color: ALERT_RED, note: 'culture' },
        { values: trajectory.global.influence_share, color: MECH_BLUE, note: 'politics' },
      ],
    },
    {
      label: 'DEFENSE TRANSFER GAP (vs the same-seed sealed twin)',
      max: 0.6,
      lines: [
        { values: trajectory.global.transfer_gap, color: INK, note: 'gap' },
        {
          values: trajectory.global.enforcement,
          color: MECH_ORANGE,
          note: 'tax enforcement',
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
