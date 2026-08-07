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
  /** Required whenever `closing` is present. */
  closingLabel?: string;
  steps: VisualEssayStep<State>[];
  /** Optional so a page can stack several essay segments and close once. */
  closing?: {
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
  showHeader?: boolean;
  /** Prefix for step anchor ids (`#<prefix>-N`). Defaults to `step`; a page
      stacking several essay segments must give each a distinct prefix so
      anchors stay unique and deep links land on the right segment. */
  anchorPrefix?: string;
}
