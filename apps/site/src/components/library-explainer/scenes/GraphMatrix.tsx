import { useMemo, useState } from 'react';
import { graphMatrix } from '../fixtures';

/** The closing arc's shared scene: a REAL engine adjacency (value_contagion's
    friendship layer) drawn twice — as a node-link graph and as the matrix it
    is — plus its Laplacian spectrum, all from the graph-matrix fixture.
    Node identity: fill = human/AI type (blue/red, validated pair); in the
    Fiedler view, fill = Fiedler sign and AI nodes keep a red ring so identity
    is never color-alone. Layout is a circle ordered by index or by Fiedler
    value — deterministic rendering, no physics, no computation beyond
    trigonometry on fixture data. */

const HUMAN = 'var(--diagram-field-css, #246fad)';
const AI = 'var(--diagram-defect, #c4433a)';
const SIGN_POS = 'var(--diagram-cooperate, #177a57)';
const SIGN_NEG = 'var(--diagram-field-css, #246fad)';

const GRAPH_W = 250;
const CELL = 5.4;

function useOrdering(order: 'index' | 'fiedler') {
  return useMemo(() => {
    const { N, spectral } = graphMatrix;
    const ids = Array.from({ length: N }, (_, i) => i);
    if (order === 'fiedler') {
      ids.sort((a, b) => spectral.fiedler[a] - spectral.fiedler[b]);
    }
    return ids; // position -> node id
  }, [order]);
}

function nodePositions(ordering: number[]) {
  const { N } = graphMatrix;
  const cx = GRAPH_W / 2;
  const r = GRAPH_W / 2 - 18;
  const pos = new Array<[number, number]>(N);
  ordering.forEach((id, slot) => {
    const angle = (2 * Math.PI * slot) / N - Math.PI / 2;
    pos[id] = [cx + r * Math.cos(angle), cx + r * Math.sin(angle)];
  });
  return pos;
}

function edges() {
  const { N, adj } = graphMatrix;
  const out: [number, number, number][] = [];
  for (let i = 0; i < N; i += 1) {
    for (let j = i + 1; j < N; j += 1) {
      const w = Math.max(adj[i * N + j], adj[j * N + i]);
      if (w > 0) out.push([i, j, w]);
    }
  }
  return out;
}

function NodeLink({
  ordering,
  colorBy,
  hover,
  setHover,
}: {
  ordering: number[];
  colorBy: 'type' | 'fiedler';
  hover: [number, number] | null;
  setHover: (h: [number, number] | null) => void;
}) {
  const { N, node_types, spectral } = graphMatrix;
  const pos = nodePositions(ordering);
  const allEdges = useMemo(edges, []);
  const active = new Set(hover ? [hover[0], hover[1]] : []);

  return (
    <svg
      viewBox={`0 0 ${GRAPH_W} ${GRAPH_W}`}
      className="libx-gm-graph"
      role="img"
      aria-label={`The ${graphMatrix.layer} graph: ${N} agents, ${allEdges.length} ties, drawn on a circle ordered by ${colorBy === 'fiedler' ? 'Fiedler value' : 'index'}.`}
    >
      {allEdges.map(([i, j, w]) => (
        <line
          key={`${i}-${j}`}
          x1={pos[i][0]}
          y1={pos[i][1]}
          x2={pos[j][0]}
          y2={pos[j][1]}
          className={
            active.has(i) && active.has(j) ? 'libx-gm-edge libx-gm-edge-hot' : 'libx-gm-edge'
          }
          style={{
            opacity: active.size ? (active.has(i) && active.has(j) ? 0.9 : 0.06) : 0.14 + 0.5 * w,
          }}
        />
      ))}
      {pos.map(([px, py], id) => {
        const isAI = node_types[id] > 0;
        const fill =
          colorBy === 'type'
            ? isAI
              ? AI
              : HUMAN
            : spectral.fiedler[id] >= 0
              ? SIGN_POS
              : SIGN_NEG;
        return (
          <circle
            key={id}
            cx={px}
            cy={py}
            r={active.has(id) ? 6.5 : 4.5}
            fill={fill}
            className={
              colorBy === 'fiedler' && isAI ? 'libx-gm-node libx-gm-node-ai' : 'libx-gm-node'
            }
            onMouseEnter={() => setHover([id, id])}
            onMouseLeave={() => setHover(null)}
          >
            <title>
              agent {id} — {isAI ? 'AI' : 'human'}
              {colorBy === 'fiedler' ? `, Fiedler ${spectral.fiedler[id].toFixed(3)}` : ''}
            </title>
          </circle>
        );
      })}
    </svg>
  );
}

function Heatmap({
  ordering,
  hover,
  setHover,
}: {
  ordering: number[];
  hover: [number, number] | null;
  setHover: (h: [number, number] | null) => void;
}) {
  const { N, adj } = graphMatrix;
  const size = N * CELL;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="libx-gm-heatmap"
      role="img"
      aria-label={`The same graph as its ${N} by ${N} adjacency matrix.`}
      onMouseLeave={() => setHover(null)}
    >
      {ordering.map((i, row) =>
        ordering.map((j, col) => {
          const w = adj[i * N + j];
          if (w === 0 && !(hover && hover[0] === i && hover[1] === j)) return null;
          return (
            <rect
              key={`${i}-${j}`}
              x={col * CELL}
              y={row * CELL}
              width={CELL - 0.7}
              height={CELL - 0.7}
              className="libx-gm-cell"
              style={{ opacity: 0.25 + 0.75 * w }}
              onMouseEnter={() => setHover([i, j])}
            >
              <title>
                W[{i}, {j}] = {w}
              </title>
            </rect>
          );
        })
      )}
      {hover && (
        <rect
          x={ordering.indexOf(hover[1]) * CELL - 0.5}
          y={ordering.indexOf(hover[0]) * CELL - 0.5}
          width={CELL}
          height={CELL}
          className="libx-gm-cell-hot"
        />
      )}
    </svg>
  );
}

export function MatrixScene({ order }: { order: 'index' | 'fiedler' }) {
  const ordering = useOrdering(order);
  const [hover, setHover] = useState<[number, number] | null>(null);
  return (
    <div className="libx-scene libx-gm">
      <div className="libx-gm-pair">
        <figure>
          <NodeLink ordering={ordering} colorBy="type" hover={hover} setHover={setHover} />
          <figcaption>the graph</figcaption>
        </figure>
        <figure>
          <Heatmap ordering={ordering} hover={hover} setHover={setHover} />
          <figcaption>
            the same object as a matrix
            {order === 'fiedler' ? ', rows sorted by the Fiedler vector' : ''}
          </figcaption>
        </figure>
      </div>
      <div className="libx-legend" aria-hidden="true">
        <span>
          <span className="libx-tooltip-mark" style={{ background: '#246fad' }} /> human
        </span>
        <span>
          <span className="libx-tooltip-mark" style={{ background: '#c4433a' }} /> AI
        </span>
      </div>
      <p className="libx-caption">
        {graphMatrix.env}&rsquo;s {graphMatrix.layer} layer, N={graphMatrix.N}, seed{' '}
        {graphMatrix.seed0}, engine-exported. Hover a cell: row i is agent i&rsquo;s incoming mail.
      </p>
    </div>
  );
}

export function SpectralScene({ view }: { view: 'eigenvalues' | 'fiedler' }) {
  const ordering = useOrdering('fiedler');
  const [hover, setHover] = useState<[number, number] | null>(null);
  const { spectral, N } = graphMatrix;
  const maxEig = spectral.eigenvalues[N - 1];

  return (
    <div className="libx-scene libx-gm">
      {view === 'eigenvalues' ? (
        <>
          <svg
            viewBox="0 0 560 130"
            role="img"
            aria-label={`The Laplacian eigenvalue distribution: ${N} values from 0 to ${maxEig}, with the spectral gap ${spectral.spectral_gap} highlighted.`}
          >
            <line className="libx-axis" x1={20} x2={540} y1={95} y2={95} />
            {spectral.eigenvalues.map((v, k) => (
              <line
                key={k}
                x1={20 + (v / maxEig) * 520}
                x2={20 + (v / maxEig) * 520}
                y1={k === 1 ? 30 : 55}
                y2={95}
                className={k === 1 ? 'libx-gm-eig libx-gm-eig-gap' : 'libx-gm-eig'}
              >
                <title>
                  λ{k + 1} = {v}
                </title>
              </line>
            ))}
            <text className="libx-axis-label" x={20} y={112}>
              0
            </text>
            <text className="libx-axis-label" x={540} y={112} textAnchor="end">
              {maxEig.toFixed(1)}
            </text>
            <text
              className="libx-gm-gaplabel"
              x={20 + (spectral.spectral_gap / maxEig) * 520}
              y={22}
            >
              λ₂ = {spectral.spectral_gap} — the spectral gap
            </text>
          </svg>
          <p className="libx-caption">
            Every bar is one eigenvalue of L = D − W for the friendship graph above. λ₁ = 0 always;
            the gap to λ₂ sets how fast local perturbations become global patterns under diffusion —
            the larger the gap, the faster this graph turns local noise into shared state.
          </p>
        </>
      ) : (
        <>
          <div className="libx-gm-pair">
            <figure>
              <NodeLink ordering={ordering} colorBy="fiedler" hover={hover} setHover={setHover} />
              <figcaption>nodes colored by Fiedler sign — the primary fault line</figcaption>
            </figure>
            <div className="libx-gm-stats">
              <p>
                <span className="libx-formula">spectral gap</span>
                <b>{spectral.spectral_gap}</b>
              </p>
              <p>
                <span className="libx-formula">fault line ↔ human/AI boundary</span>
                <b>{spectral.fiedler_alignment}</b>
                <span className="libx-se"> (|φ|, 0 = unrelated, 1 = identical)</span>
              </p>
            </div>
          </div>
          <div className="libx-legend" aria-hidden="true">
            <span>
              <span className="libx-tooltip-mark" style={{ background: '#177a57' }} /> Fiedler +
            </span>
            <span>
              <span className="libx-tooltip-mark" style={{ background: '#246fad' }} /> Fiedler −
            </span>
            <span>
              <span className="libx-tooltip-mark libx-tooltip-ring" /> AI agent
            </span>
          </div>
          <p className="libx-caption">
            The Fiedler vector cuts the graph at its weakest links. On this graph, at its default
            mixing, the cut does not follow the human/AI boundary — the alignment score above is the
            detector that would catch it if it started to.
          </p>
        </>
      )}
    </div>
  );
}
