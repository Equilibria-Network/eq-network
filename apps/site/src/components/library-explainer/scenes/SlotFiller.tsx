import { useEffect, useState } from 'react';

/** One equation, many traditions (whitepaper §2.1, Table 3): each research
    tradition is a choice of (relation W, message ψ, combine ⊕, update γ).
    Static cited content — the table travels from the paper, not the engine. */
const TRADITIONS: {
  id: string;
  label: string;
  relation: string;
  message: string;
  combine: string;
  update: string;
}[] = [
  {
    id: 'degroot',
    label: 'Opinion pooling',
    relation: 'trust (row-stochastic)',
    message: 'Wᵢⱼ · xⱼ',
    combine: 'sum',
    update: 'identity (a contraction)',
  },
  {
    id: 'voting',
    label: 'Voting',
    relation: 'enfranchisement (all-to-one)',
    message: 'the ballot of j',
    combine: 'median / majority / Borda',
    update: 'broadcast the outcome',
  },
  {
    id: 'market',
    label: 'Market clearing',
    relation: 'market access',
    message: 'bid or offer',
    combine: 'sum (excess demand)',
    update: 'price update, allocation',
  },
  {
    id: 'io',
    label: 'Production networks',
    relation: 'technical coefficients A',
    message: 'Aᵢⱼ · xⱼ',
    combine: 'sum',
    update: 'fixed point (I−A)⁻¹d',
  },
  {
    id: 'contagion',
    label: 'Contagion',
    relation: 'contact',
    message: '1[ j adopted ]',
    combine: 'count',
    update: 'threshold or Bernoulli draw',
  },
  {
    id: 'gnn',
    label: 'Graph neural networks',
    relation: 'learned or given',
    message: 'MLP(xᵢ, xⱼ, eᵢⱼ)',
    combine: 'sum / mean / max',
    update: 'MLP',
  },
];

export default function SlotFiller({ tradition: tradition0 }: { tradition: string }) {
  const [selected, setSelected] = useState(tradition0);
  useEffect(() => setSelected(tradition0), [tradition0]);
  const active = TRADITIONS.find((t) => t.id === selected) ?? TRADITIONS[0];

  return (
    <div className="libx-scene libx-slots">
      <p className="libx-formula libx-equation" aria-hidden="true">
        xᵢ{'ᵗ⁺¹'} = <span className="libx-slot libx-slot-update">γ</span>( xᵢ{'ᵗ'},{' '}
        <span className="libx-slot libx-slot-combine">⨁</span>
        <sub>j∈N(i)</sub> <span className="libx-slot libx-slot-message">ψ</span>(xᵢ{'ᵗ'}, xⱼ
        {'ᵗ'}, Wᵢⱼ) )
      </p>
      <svg
        className="libx-mp-picture"
        viewBox="0 0 560 190"
        role="img"
        aria-label={`Schematic of one message-passing step: three neighbours send ${active.message} along the ${active.relation} relation; the arrivals combine by ${active.combine}; the receiving node updates by ${active.update}.`}
      >
        {/* The equation, drawn: three neighbours -> messages (psi) -> combine
            (oplus) at node i -> update (gamma) -> node i at t+1. Schematic
            positions; the slot colors match the equation and the table. */}
        {[
          [60, 35],
          [45, 95],
          [70, 155],
        ].map(([nodeX, nodeY], j) => (
          <g key={j}>
            <line x1={nodeX + 14} y1={nodeY} x2={236} y2={95} className="libx-mp-edge" />
            <circle cx={nodeX} cy={nodeY} r={14} className="libx-mp-node" />
            <text x={nodeX} y={nodeY} dy="0.32em" textAnchor="middle" className="libx-mp-nodelabel">
              j{j + 1}
            </text>
            <g transform={`translate(${(nodeX + 236) / 2 - 12}, ${(nodeY + 95) / 2 - 10})`}>
              <rect width={26} height={18} rx={4} className="libx-mp-message" />
              <text x={13} y={9} dy="0.32em" textAnchor="middle" className="libx-mp-symbol">
                ψ
              </text>
            </g>
          </g>
        ))}
        <circle cx={250} cy={95} r={19} className="libx-mp-combine" />
        <text x={250} y={95} dy="0.32em" textAnchor="middle" className="libx-mp-symbol">
          ⨁
        </text>
        <circle cx={310} cy={95} r={17} className="libx-mp-node libx-mp-receiver" />
        <text x={310} y={95} dy="0.32em" textAnchor="middle" className="libx-mp-nodelabel">
          i
        </text>
        <path
          d="M 336 95 C 372 95, 388 95, 424 95"
          className="libx-mp-update"
          markerEnd="url(#libx-mp-arrow)"
        />
        <rect x={356} y={72} width={26} height={18} rx={4} className="libx-mp-gamma" />
        <text x={369} y={81} dy="0.32em" textAnchor="middle" className="libx-mp-symbol">
          γ
        </text>
        <circle cx={448} cy={95} r={17} className="libx-mp-node libx-mp-receiver" />
        <text x={448} y={95} dy="0.32em" textAnchor="middle" className="libx-mp-nodelabel">
          i′
        </text>
        <text x={448} y={132} textAnchor="middle" className="libx-mp-caption">
          t+1
        </text>
        <text x={140} y={20} className="libx-mp-caption">
          {active.relation}
        </text>
        <defs>
          <marker
            id="libx-mp-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" className="libx-mp-arrowhead" />
          </marker>
        </defs>
      </svg>
      <div className="libx-chiprow" role="group" aria-label="Pick a research tradition">
        {TRADITIONS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={t.id === selected ? 'libx-chip libx-chip-on' : 'libx-chip'}
            aria-pressed={t.id === selected}
            onClick={() => setSelected(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <dl className="libx-slot-table">
        <div>
          <dt>relation W</dt>
          <dd>{active.relation}</dd>
        </div>
        <div className="libx-slot-message-row">
          <dt>ψ — what flows</dt>
          <dd>{active.message}</dd>
        </div>
        <div className="libx-slot-combine-row">
          <dt>⨁ — how arrivals combine</dt>
          <dd>{active.combine}</dd>
        </div>
        <div className="libx-slot-update-row">
          <dt>γ — what the receiver does</dt>
          <dd>{active.update}</dd>
        </div>
      </dl>
      <p className="libx-caption">
        Seven literatures, one equation (whitepaper Table 3 — six shown here). The traditions differ
        only in how they fill the three slots and which relation they read. The picture is a
        schematic of one step; pick a tradition and the fills change.
      </p>
    </div>
  );
}
