import '@fontsource/space-grotesk/latin-400.css';
import '@fontsource/space-grotesk/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/kalam/latin-400.css';
import '@fontsource/kalam/latin-700.css';
import './styles.css';
import './showcase/showcase.css';
import './showcase/scroll/scroll.css';

/** The scroll-prototype entry (task-0007 P1). The site composes these with
    its own VisualEssay — the essay shell is view chrome and stays
    site-side; everything that touches the simulation stays here. */
export { scrollFlow } from './showcase/scroll/script';
export { default as ScrollStage } from './showcase/scroll/ScrollStage';
export { default as PlayableEnding } from './showcase/scroll/PlayableEnding';
export { default as AssumptionCards } from './showcase/AssumptionCards';
export { prewarmScrollTrajectories } from './showcase/scroll/trajectoryCache';
export type {
  ScrollItem,
  ScrollSegment,
  ScrollStep,
  ScrollAssumptions,
  ScrollProse,
  ScrollPlayable,
  StageSpec,
} from './showcase/scroll/types';
