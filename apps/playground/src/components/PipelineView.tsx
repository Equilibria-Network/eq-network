import type { Trajectory } from '../engine/types';

export default function PipelineView({ trajectory }: { trajectory: Trajectory }) {
  const nodes = trajectory.system?.nodes.filter((node) => !node.bookkeeping) ?? [];
  const fields = nodes.filter((node) => node.kind === 'field');
  const transforms = nodes.filter((node) => node.kind === 'transform');

  return (
    <div className="pipeline-view">
      <div className="pipeline-column">
        <p className="pipeline-label">State fields · {fields.length}</p>
        <div className="pipeline-list">
          {fields.map((field) => (
            <div className="pipeline-node pipeline-field" key={field.id}>
              <span>{field.id.replaceAll('_', ' ')}</span>
              <small>{field.family?.replace('_attrs', '') ?? 'state'}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="pipeline-arrow" aria-hidden="true">
        →
      </div>
      <div className="pipeline-column">
        <p className="pipeline-label">Transforms · {transforms.length}</p>
        <div className="pipeline-list">
          {transforms.map((transform) => (
            <div className="pipeline-node pipeline-transform" key={transform.id}>
              <span>{transform.id.replaceAll('_', ' ')}</span>
              <small>
                {transform.reads?.length ?? 0} in · {transform.writes?.length ?? 0} out
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
