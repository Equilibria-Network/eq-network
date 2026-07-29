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
  eyebrow: explainerContent.header.eyebrow,
  reference: 'EQ / TH–01',
  title: explainerContent.header.title,
  dek: explainerContent.header.summary ?? '',
  scrollPrompt: explainerContent.header.prompt ?? '',
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

interface ThesisPrototypeProps {
  showHeader?: boolean;
}

export default function ThesisPrototype({ showHeader = true }: ThesisPrototypeProps) {
  return (
    <VisualEssay document={thesisDocument} Visual={ThesisWorldModel} showHeader={showHeader} />
  );
}
