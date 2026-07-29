import type { ComponentType } from 'react';

export interface VisualEssayStep<State extends string> {
  id: number;
  state: State;
  section: string;
  sectionLabel: string;
  stageLabel: string;
  headline: string;
  body: string;
}

export interface VisualEssayLink {
  href: string;
  label: string;
  description: string;
}

export interface VisualEssayDocument<State extends string> {
  eyebrow: string;
  reference: string;
  title: string;
  dek: string;
  scrollPrompt: string;
  figureLabel: string;
  statusLabel: string;
  closingLabel: string;
  steps: VisualEssayStep<State>[];
  closing: {
    headline: string;
    body: string;
    links: VisualEssayLink[];
  };
}

export interface VisualEssayRendererProps<State extends string> {
  activeState: State;
  activeStep: number;
  step: VisualEssayStep<State>;
}

export interface VisualEssayProps<State extends string> {
  document: VisualEssayDocument<State>;
  Visual: ComponentType<VisualEssayRendererProps<State>>;
}
