import type { ArtifactStage } from './types';
import BatchBoard from './scenes/BatchBoard';
import CategoryDiagram from './scenes/CategoryDiagram';
import { MatrixScene, SpectralScene } from './scenes/GraphMatrix';
import ScheduleTimeline from './scenes/ScheduleTimeline';
import SlotFiller from './scenes/SlotFiller';
import StateLayers from './scenes/StateLayers';
import SystemGraphView from './scenes/SystemGraphView';
import TransformCard from './scenes/TransformCard';

/** Stage dispatcher: the active scroll step's stage spec picks the scene.
    Every scene is a rendering of fixture data or definitional arithmetic —
    the exhaustive switch is the page's whole "engine". */
export default function Visual({ stage }: { stage: ArtifactStage }) {
  switch (stage.kind) {
    case 'slots':
      return <SlotFiller tradition={stage.tradition} />;
    case 'state-layers':
      return <StateLayers highlight={stage.highlight} />;
    case 'transform-card':
      return <TransformCard transforms={stage.transforms} />;
    case 'schedule':
      return (
        <ScheduleTimeline
          cadence={stage.cadence}
          phaseOffset={stage.phaseOffset}
          onset={stage.onset}
        />
      );
    case 'batches':
      return <BatchBoard enabled={stage.enabled} />;
    case 'system':
      return <SystemGraphView condition={stage.condition} />;
    case 'category':
      return <CategoryDiagram view={stage.view} />;
    case 'matrix':
      return <MatrixScene order={stage.order} />;
    case 'spectral':
      return <SpectralScene view={stage.view} />;
  }
}
