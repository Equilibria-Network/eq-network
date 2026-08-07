import type { AssumptionBlock } from './types';

/** The stated-plainly card grid, shared by the showcase page and the scroll
    prototype so the markup and copy render identically on both. */
export default function AssumptionCards({ blocks }: { blocks: AssumptionBlock[] }) {
  return (
    <div className="assumption-grid">
      {blocks.map((block, index) => (
        <article className="assumption-block" key={block.id}>
          <header>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{block.title}</h3>
          </header>
          <ol>
            {block.assumptions.map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </ol>
          {block.input && block.output && (
            <dl>
              <div>
                <dt>In</dt>
                <dd>{block.input}</dd>
              </div>
              <div>
                <dt>Out</dt>
                <dd>{block.output}</dd>
              </div>
            </dl>
          )}
          {block.source && <p className="assumption-source">{block.source}</p>}
        </article>
      ))}
    </div>
  );
}
