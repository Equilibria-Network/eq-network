import { systems } from '../fixtures';
import type { SystemNode } from '../types';

/** The system_graph() fixture drawn as a bipartite flow: state fields on the
    left, pipeline transforms on the right, reads flowing right and writes
    flowing back. Nothing is hand-laid-out — nodes and edges come straight
    from the engine's system_graph(build_steps, make_state) for the selected
    condition, so toggling a mechanism (across scroll steps) literally adds or
    removes its node. */

const ROW = 34;
const FIELD_X = 190;
const TRANSFORM_X = 330;
const WIDTH = 560;

function displayName(id: string): { label: string; scheduled: boolean } {
  const match = id.match(/^scheduled\(([^,]+),/);
  return match ? { label: match[1], scheduled: true } : { label: id, scheduled: false };
}

export default function SystemGraphView({ condition }: { condition: string }) {
  const graph = systems.conditions[condition];
  const fields = graph.nodes.filter(
    (n): n is Extract<SystemNode, { kind: 'field' }> => n.kind === 'field'
  );
  const transforms = graph.nodes.filter(
    (n): n is Extract<SystemNode, { kind: 'transform' }> => n.kind === 'transform'
  );

  const fieldY = new Map(fields.map((f, i) => [f.id, (i + 1) * ROW]));
  const transformY = new Map(transforms.map((t, i) => [t.id, (i + 1.6) * ROW]));
  const height = (Math.max(fields.length, transforms.length + 1) + 1.2) * ROW;

  const curve = (x1: number, y1: number, x2: number, y2: number) => {
    const mid = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
  };

  return (
    <div className="libx-scene libx-system">
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label={`Pipeline of ${transforms.length} transforms over ${fields.length} state fields under the ${condition} condition.`}
      >
        {graph.edges.map((edge, i) => {
          const fromField = fieldY.has(edge.from);
          const y1 = fromField ? fieldY.get(edge.from) : transformY.get(edge.from);
          const y2 = fromField ? transformY.get(edge.to) : fieldY.get(edge.to);
          if (y1 === undefined || y2 === undefined) return null;
          return (
            <path
              key={i}
              d={
                fromField
                  ? curve(FIELD_X + 8, y1, TRANSFORM_X - 8, y2)
                  : curve(TRANSFORM_X - 8, y1, FIELD_X + 8, y2)
              }
              className={fromField ? 'libx-edge-read' : 'libx-edge-write'}
            />
          );
        })}
        {fields.map((f) => (
          <g
            key={f.id}
            transform={`translate(${FIELD_X}, ${fieldY.get(f.id)})`}
            className={f.bookkeeping ? 'libx-field libx-field-dim' : 'libx-field'}
          >
            <circle r={4} />
            <text x={-10} dy="0.32em" textAnchor="end">
              {f.id}
            </text>
            <title>
              {f.family} {JSON.stringify(f.shape)}
              {f.bookkeeping ? ' — bookkeeping' : ''}
            </title>
          </g>
        ))}
        {transforms.map((t) => {
          const { label, scheduled } = displayName(t.id);
          return (
            <g
              key={t.id}
              transform={`translate(${TRANSFORM_X}, ${transformY.get(t.id)})`}
              className="libx-transform"
            >
              <rect x={-8} y={-13} width={160} height={26} rx={4} />
              <text x={72} dy="0.32em" textAnchor="middle">
                {scheduled ? `${label} ⏱` : label}
              </text>
              <title>
                {t.id}
                {'\n'}reads: {t.reads.join(', ')}
                {'\n'}writes: {t.writes.join(', ')}
              </title>
            </g>
          );
        })}
      </svg>
      <p className="libx-caption">
        Condition: <b>{condition.replace(/_/g, ' ')}</b> — reads flow right, writes flow back. Hover
        a transform for its declared effects.
      </p>
    </div>
  );
}
