import { stateShapes } from '../fixtures';

const BOOKKEEPING = new Set(['rng_key', 'step']);

/** One immutable state: the governed commons' actual GraphState schema,
    family by family, from the state-shapes fixture. */
export default function StateLayers({
  highlight,
}: {
  highlight?: 'node_attrs' | 'adj_matrices' | 'global_attrs';
}) {
  const { N, fields } = stateShapes;
  const dim = (family: string) => (highlight && highlight !== family ? ' libx-layer-dim' : '');

  const chips = (family: 'node_attrs' | 'global_attrs') =>
    Object.entries(fields[family]).map(([name, desc]) => (
      <span
        key={name}
        className={BOOKKEEPING.has(name) ? 'libx-effect libx-field-dim' : 'libx-effect'}
        title={`${desc.dtype}[${desc.shape.join(', ')}]`}
      >
        {name}
      </span>
    ));

  return (
    <div className="libx-scene libx-layers">
      <div className={`libx-layer${dim('node_attrs')}`}>
        <p className="libx-effects-label">node_attrs — per-agent arrays ({N} households)</p>
        <div className="libx-layer-chips">{chips('node_attrs')}</div>
      </div>
      <div className={`libx-layer${dim('adj_matrices')}`}>
        <p className="libx-effects-label">adj_matrices — named relation layers</p>
        <div className="libx-layer-chips">
          <span className="libx-caption">
            empty here — this commons couples through one shared stock. In the network substrates
            every domain is its own named layer (trust, delegation, market access) over the same
            population.
          </span>
        </div>
      </div>
      <div className={`libx-layer${dim('global_attrs')}`}>
        <p className="libx-effects-label">global_attrs — world-level values</p>
        <div className="libx-layer-chips">{chips('global_attrs')}</div>
      </div>
      <p className="libx-caption">
        The whole population lives in one immutable record; a step returns a new one. Hover a field
        for its shape and dtype — read straight from the engine&rsquo;s initial state.
      </p>
    </div>
  );
}
