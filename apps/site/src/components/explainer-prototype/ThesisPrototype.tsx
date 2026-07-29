import { explainerContent } from '@content/explainer';
import VisualEssay from '@components/visual-essay/VisualEssay';
import type { VisualEssayDocument } from '@components/visual-essay/types';
import ThesisWorldModel from './ThesisWorldModel';

export type ThesisState =
  'society' | 'defection' | 'equilibria' | 'uncertainty' | 'knowledge' | 'silos' | 'bridge';

const STATES: ThesisState[] = [
  'society',
  'defection',
  'equilibria',
  'uncertainty',
  'knowledge',
  'silos',
  'bridge',
];

const p = explainerContent.prototype;

const thesisDocument: VisualEssayDocument<ThesisState> = {
  eyebrow: p.eyebrow,
  reference: 'EQ / TH–01',
  title: p.title,
  dek: p.dek,
  scrollPrompt: p.scrollPrompt,
  figureLabel: p.figureLabel,
  statusLabel: p.statusLabel,
  closingLabel: p.closingLabel,
  steps: explainerContent.steps.map((step, index) => ({
    ...step,
    state: STATES[index],
    sectionLabel: explainerContent.ui.sectionLabels[step.section],
    stageLabel: p.stageLabels[index],
  })),
  closing: explainerContent.closing,
};

export default function ThesisPrototype() {
  return <VisualEssay document={thesisDocument} Visual={ThesisWorldModel} />;
}
