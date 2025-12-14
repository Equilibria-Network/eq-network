// src/content/roadmap/index.ts

import { phase1 } from './phase-1';
import { phase2 } from './phase-2';
import { phase3 } from './phase-3';
import { phase4 } from './phase-4';
import { phase5 } from './phase-5';

export { roadmapOverview } from './overview';
export { phase1 } from './phase-1';
export { phase2 } from './phase-2';
export { phase3 } from './phase-3';
export { phase4 } from './phase-4';
export { phase5 } from './phase-5';
export type { RoadmapPhase, Publication, PublicationLinks, Researcher, PhaseDetails } from './types';

export const roadmapPhases = [
  phase1,
  phase2,
  phase3,
  phase4,
  phase5
];
