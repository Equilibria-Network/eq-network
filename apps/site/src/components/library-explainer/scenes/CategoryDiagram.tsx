import { manifest, subsetRow, subsets } from '../fixtures';

export type CategoryView = 'endo' | 'factor' | 'interchange' | 'tick';

/** Commutative diagrams over the pipeline fixture. Every label, effect set,
    and factorisation below comes from pipeline-subsets.json — the same
    declarations compile_pipeline consumes; layout is the only thing this
    file adds. The views walk the categorical reading of the engine: arrows
    on one object, effect-refined types, commuting squares as derived
    parallelism, the tick as a composite and the run as its iterate. */

const FULL = [0, 1, 2, 3];

function names() {
  return subsets.transforms.map((t) => t.name);
}

function effectSet(i: number) {
  const t = subsets.transforms[i];
  return new Set([...t.reads, ...t.writes]);
}

/** The first derived batch that runs two transforms in parallel, from the
    full pipeline's row — the commuting pair the interchange square draws. */
function parallelPair(): [number, number] {
  const row = subsetRow(FULL);
  const batch = row.batches.find((b) => b.length >= 2);
  if (!batch) throw new Error('fixture has no parallel batch');
  return [batch[0], batch[1]];
}

/** The tick as compile_pipeline factorised it: ⊗ within a batch, ∘ between
    batches, later batches to the left as composition reads right-to-left. */
function tickFormula() {
  const ns = names();
  return subsetRow(FULL)
    .batches.map((batch) => {
      const term = batch.map((i) => ns[i]).join(' ⊗ ');
      return batch.length > 1 ? `(${term})` : term;
    })
    .reverse()
    .join(' ∘ ');
}

function ArrowDefs({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" className="libx-cat-arrowhead" />
      </marker>
    </defs>
  );
}

function ObjectNode({ x, y }: { x: number; y: number }) {
  return (
    <g className="libx-cat-object">
      <circle cx={x} cy={y} r={16} />
      <text x={x} y={y + 4} textAnchor="middle">
        S
      </text>
    </g>
  );
}

function EndoView() {
  const [a, b] = [subsets.transforms[0].name, subsets.transforms[1].name];
  return (
    <>
      <svg
        viewBox="0 0 640 190"
        role="img"
        aria-label={`${a} and ${b} composing as arrows on the state`}
      >
        <ArrowDefs id="libx-cat-arr-endo" />
        <ObjectNode x={90} y={60} />
        <ObjectNode x={320} y={60} />
        <ObjectNode x={550} y={60} />
        <line
          x1={110}
          y1={60}
          x2={300}
          y2={60}
          className="libx-cat-arrow"
          markerEnd="url(#libx-cat-arr-endo)"
        />
        <line
          x1={340}
          y1={60}
          x2={530}
          y2={60}
          className="libx-cat-arrow"
          markerEnd="url(#libx-cat-arr-endo)"
        />
        <text x={205} y={45} textAnchor="middle" className="libx-cat-label">
          {a}
        </text>
        <text x={435} y={45} textAnchor="middle" className="libx-cat-label">
          {b}
        </text>
        <path
          d="M 100 80 Q 320 175 540 80"
          className="libx-cat-arrow libx-cat-arrow-composite"
          markerEnd="url(#libx-cat-arr-endo)"
        />
        <text
          x={320}
          y={150}
          textAnchor="middle"
          className="libx-cat-label libx-cat-label-composite"
        >
          {b} ∘ {a}
        </text>
      </svg>
      <p className="libx-formula">
        GraphState → GraphState — the type of every transform and of every composite
      </p>
      <p className="libx-caption">
        Two transforms of the governed commons and their composite. Arrows out of and into the same
        object compose, composition is associative, and doing nothing is the identity arrow — the
        entire algebra a pipeline needs.
      </p>
    </>
  );
}

function FactorView() {
  const t = subsets.transforms[0];
  const lineY = (idx: number) => 152 + idx * 15;
  return (
    <>
      <svg
        viewBox="0 0 640 260"
        role="img"
        aria-label={`${t.name} factoring through its declared reads and writes`}
      >
        <ArrowDefs id="libx-cat-arr-factor" />
        <ObjectNode x={60} y={50} />
        <ObjectNode x={580} y={50} />
        <line
          x1={80}
          y1={50}
          x2={560}
          y2={50}
          className="libx-cat-arrow"
          markerEnd="url(#libx-cat-arr-factor)"
        />
        <text x={320} y={35} textAnchor="middle" className="libx-cat-label">
          {t.name}
        </text>
        <line
          x1={72}
          y1={66}
          x2={150}
          y2={122}
          className="libx-cat-arrow"
          markerEnd="url(#libx-cat-arr-factor)"
        />
        <text x={86} y={106} textAnchor="middle" className="libx-cat-label">
          restrict
        </text>
        <rect
          x={155}
          y={128}
          width={170}
          height={112}
          rx={8}
          className="libx-cat-box libx-cat-box-read"
        />
        <text x={240} y={144} textAnchor="middle" className="libx-cat-boxlabel">
          reads
        </text>
        {t.reads.map((field, idx) => (
          <text
            key={field}
            x={240}
            y={lineY(idx) + 12}
            textAnchor="middle"
            className="libx-cat-field"
          >
            {field}
          </text>
        ))}
        <line
          x1={330}
          y1={184}
          x2={355}
          y2={184}
          className="libx-cat-arrow"
          markerEnd="url(#libx-cat-arr-factor)"
        />
        <rect
          x={360}
          y={128}
          width={170}
          height={112}
          rx={8}
          className="libx-cat-box libx-cat-box-write"
        />
        <text x={445} y={144} textAnchor="middle" className="libx-cat-boxlabel">
          writes
        </text>
        {t.writes.map((field, idx) => (
          <text
            key={field}
            x={445}
            y={lineY(idx) + 12}
            textAnchor="middle"
            className="libx-cat-field"
          >
            {field}
          </text>
        ))}
        <line
          x1={535}
          y1={122}
          x2={570}
          y2={68}
          className="libx-cat-arrow"
          markerEnd="url(#libx-cat-arr-factor)"
        />
        <text x={572} y={106} textAnchor="middle" className="libx-cat-label">
          merge
        </text>
      </svg>
      <p className="libx-caption">
        The top arrow and the bottom path are the same function. Only the bottom path is
        informative: which slice of the state the step may see, which it may replace, and identity
        everywhere else. The factorisation, not the code, is what the compiler consumes.
      </p>
    </>
  );
}

function InterchangeView() {
  const [i, j] = parallelPair();
  const [a, b] = [subsets.transforms[i].name, subsets.transforms[j].name];
  const shared = [...effectSet(i)].filter((field) => effectSet(j).has(field));
  return (
    <>
      <svg
        viewBox="0 0 640 270"
        role="img"
        aria-label={`both orders of ${a} and ${b} give the same composite`}
      >
        <ArrowDefs id="libx-cat-arr-square" />
        <ObjectNode x={170} y={50} />
        <ObjectNode x={470} y={50} />
        <ObjectNode x={170} y={220} />
        <ObjectNode x={470} y={220} />
        <line
          x1={190}
          y1={50}
          x2={450}
          y2={50}
          className="libx-cat-arrow"
          markerEnd="url(#libx-cat-arr-square)"
        />
        <text x={320} y={35} textAnchor="middle" className="libx-cat-label">
          {a}
        </text>
        <line
          x1={470}
          y1={70}
          x2={470}
          y2={200}
          className="libx-cat-arrow"
          markerEnd="url(#libx-cat-arr-square)"
        />
        <text x={482} y={139} className="libx-cat-label">
          {b}
        </text>
        <line
          x1={170}
          y1={70}
          x2={170}
          y2={200}
          className="libx-cat-arrow"
          markerEnd="url(#libx-cat-arr-square)"
        />
        <text x={158} y={139} textAnchor="end" className="libx-cat-label">
          {b}
        </text>
        <line
          x1={190}
          y1={220}
          x2={450}
          y2={220}
          className="libx-cat-arrow"
          markerEnd="url(#libx-cat-arr-square)"
        />
        <text x={320} y={243} textAnchor="middle" className="libx-cat-label">
          {a}
        </text>
        <line
          x1={190}
          y1={66}
          x2={450}
          y2={204}
          className="libx-cat-arrow libx-cat-arrow-composite"
          markerEnd="url(#libx-cat-arr-square)"
        />
        <text
          x={335}
          y={125}
          textAnchor="middle"
          className="libx-cat-label libx-cat-label-composite"
        >
          {a} ⊗ {b}
        </text>
      </svg>
      <p className="libx-formula">
        shared fields between {a} and {b}: {shared.length === 0 ? 'none' : shared.join(', ')}
      </p>
      <p className="libx-caption">
        Two arrows whose declared effects share no field give equal composites in either order: the
        square commutes, the ordering question dissolves, and the pair collapses into one parallel
        arrow. Every parallel batch in the compiler section is an instance of this square.
      </p>
    </>
  );
}

function TickView() {
  const ns = names();
  const row = subsetRow(FULL);
  const scheduled = subsets.transforms.find((t) => t.schedule);
  const xs = [50, 230, 410, 590];
  return (
    <>
      <svg
        viewBox="0 0 640 240"
        role="img"
        aria-label="one tick as the composite of the derived batches, iterated over the run"
      >
        <ArrowDefs id="libx-cat-arr-tick" />
        {xs.map((x) => (
          <ObjectNode key={x} x={x} y={60} />
        ))}
        {row.batches.map((batch, b) => (
          <g key={b}>
            <line
              x1={xs[b] + 20}
              y1={60}
              x2={xs[b + 1] - 20}
              y2={60}
              className="libx-cat-arrow"
              markerEnd="url(#libx-cat-arr-tick)"
            />
            <text x={(xs[b] + xs[b + 1]) / 2} y={44} textAnchor="middle" className="libx-cat-label">
              {batch.map((i) => ns[i]).join(' ⊗ ')}
            </text>
          </g>
        ))}
        <path d="M 34 92 L 34 102 L 606 102 L 606 92" className="libx-cat-brace" />
        <text
          x={320}
          y={122}
          textAnchor="middle"
          className="libx-cat-label libx-cat-label-composite"
        >
          tick — one composite arrow
        </text>
        {[80, 230, 380].map((x) => (
          <g key={x}>
            <ObjectNode x={x} y={190} />
            <line
              x1={x + 20}
              y1={190}
              x2={x + 130}
              y2={190}
              className="libx-cat-arrow"
              markerEnd="url(#libx-cat-arr-tick)"
            />
            <text x={x + 75} y={175} textAnchor="middle" className="libx-cat-label">
              tick
            </text>
          </g>
        ))}
        <text x={555} y={195} textAnchor="middle" className="libx-cat-label">
          ⋯ T = {manifest.T}
        </text>
      </svg>
      <p className="libx-formula">tick = {tickFormula()}</p>
      <p className="libx-caption">
        The factorisation the compiler derived: parallel within a batch, sequential between batches.
        A run applies the composite T times
        {scheduled
          ? `; on ticks where ${scheduled.name} does not fire — it runs every ${scheduled.schedule?.cadence} — its factor is the identity arrow, so scheduling changes which factors appear, never the algebra`
          : ''}
        .
      </p>
    </>
  );
}

export default function CategoryDiagram({ view }: { view: CategoryView }) {
  return (
    <div className="libx-scene libx-category">
      {view === 'endo' && <EndoView />}
      {view === 'factor' && <FactorView />}
      {view === 'interchange' && <InterchangeView />}
      {view === 'tick' && <TickView />}
    </div>
  );
}
