import { scenarioScenes } from '../../rendering/scenes';
import type { ScenarioSceneCatalog } from '../../rendering/types';
import { combinedAdapter, cultureAdapter, economyAdapter, politicsAdapter } from './adapters';
import { networkRenderer } from './network';

/** The showcase's own view catalog. Deliberately separate from
    scenarioScenes: App.tsx builds /playground's view tabs from that catalog,
    so registering there would silently change the playground's UI. The
    Concentration view is borrowed as-is for the beats a scatter cannot carry
    (crossing one half; the consensus drifting). */
const lorenz = scenarioScenes.politics.find((view) => view.key === 'lorenz')!;

export const showcaseScenes: ScenarioSceneCatalog = {
  combined: [{ key: 'network', label: 'Network', renderer: networkRenderer(combinedAdapter) }],
  economy: [{ key: 'network', label: 'Network', renderer: networkRenderer(economyAdapter) }],
  politics: [
    { key: 'network', label: 'Network', renderer: networkRenderer(politicsAdapter) },
    lorenz,
  ],
  culture: [
    { key: 'network', label: 'Network', renderer: networkRenderer(cultureAdapter) },
    lorenz,
  ],
};
