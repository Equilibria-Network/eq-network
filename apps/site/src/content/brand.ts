// src/content/brand.ts
// Canonical data for the /brand visual-identity reference.

export interface Mark {
  label: string; // mono annotation
  src: string;
  dark?: boolean; // show on a dark panel
  note: string;
}

export interface Swatch {
  name: string;
  hex: string; // display value
  token: string;
  role: string;
  dark?: boolean;
}

export interface TypeFace {
  role: string; // mono tag
  name: string;
  fontClass: string;
  sample: string;
  usage: string;
}

export interface Motif {
  tag: string;
  title: string;
  body: string;
}

export interface BrandContent {
  eyebrow: string;
  wordmark: string;
  tagline: string;
  intro: string;
  system: { tag: string; equations: string[]; params: string };
  sections: { mark: string; colour: string; type: string; motifs: string };
  markIntro: string;
  marks: Mark[];
  assets: Array<{ label: string; href: string; downloadName: string }>;
  usage: {
    title: string;
    intro: string;
    dos: string[];
    donts: string[];
  };
  swatches: Swatch[];
  colourNote: string;
  faces: TypeFace[];
  motifs: Motif[];
  drawing: {
    sheetLabel: string;
    revision: string;
    figureLabel: string;
    markMeasurement: string;
    titleBlock: Array<{ label: string; value: string; accent?: boolean }>;
  };
  components: {
    sectionTitle: string;
    intro: string;
    card: {
      phase: string;
      reference: string;
      title: string;
      abstract: string;
      status: string;
      caption: string;
    };
    tooltips: {
      title: string;
      intro: string;
      examples: Array<{ before: string; term: string; definition: string; after: string }>;
    };
  };
  closing: { title: string; body: string; email: string };
}

export const brandContent: BrandContent = {
  eyebrow: 'Visual identity system',
  wordmark: 'Equilibria',
  tagline: 'Designing new forms of collective intelligence.',
  intro:
    'The Equilibria identity is measured and minimal, drawing on mathematical notation and architectural ' +
    'working drawings. Clear lines, sharp edges, honest structure, and restrained technical texture give ' +
    'complex-systems research a legible visual form.',
  system: {
    tag: 'the mark is the math',
    equations: ['dx/dt = σ (y − x)', 'dy/dt = x (ρ − z) − y', 'dz/dt = x y − β z'],
    params: 'σ = 10   ρ = 28   β = 8/3',
  },
  sections: {
    mark: 'Mark',
    colour: 'Colour',
    type: 'Type',
    motifs: 'System',
  },
  markIntro:
    'The mark uses one heavy, closed figure-eight contour with three fine concentric lines inside each ' +
    'wing. The outer silhouette stays uninterrupted while the nested geometry recalls the Lorenz orbit.',
  marks: [
    {
      label: '01 / mark · navy',
      src: '/img/brand/marks/sym-concentric.svg',
      note: 'Primary. Heavy outline with three fine contours per wing.',
    },
    {
      label: '02 / mark · reversed',
      src: '/img/brand/marks/sym-concentric-white.svg',
      dark: true,
      note: 'On ink / dark sections.',
    },
  ],
  assets: [
    {
      label: 'Download primary SVG',
      href: '/img/brand/marks/sym-concentric.svg',
      downloadName: 'equilibria-mark-primary.svg',
    },
    {
      label: 'Download reversed SVG',
      href: '/img/brand/marks/sym-concentric-white.svg',
      downloadName: 'equilibria-mark-reversed.svg',
    },
  ],
  usage: {
    title: 'Mark usage',
    intro:
      'Use the mark as a precise mathematical symbol. Consistency matters more than decorative variation.',
    dos: [
      'Use navy on white as the default.',
      'Use the reversed mark on the dark navy ground.',
      'Keep clear space of at least one inner-contour width around the mark.',
      'Use the navy or reversed mark at a size where the internal contours remain legible.',
    ],
    donts: [
      'Do not stretch, skew, rotate, or redraw the mark.',
      'Do not recolour the mark or add gradients, shadows, or glow.',
      'Do not place the mark over a busy image or dense grid.',
      'Do not substitute an outline-only or simplified redraw at small sizes.',
    ],
  },
  swatches: [
    {
      name: 'Ink',
      hex: '#003B7E',
      token: '--color-primary',
      role: 'Text, mark, structure',
      dark: true,
    },
    { name: 'Accent', hex: '#4AB3F4', token: '--color-accent', role: 'Highlights, sparingly' },
    { name: 'Void', hex: '#0B1F3A', token: '--color-void', role: 'Dark sections', dark: true },
    { name: 'Paper', hex: '#FFFFFF', token: '--color-paper', role: 'Ground — clean white' },
    { name: 'Line', hex: '#003B7E26', token: '--color-line', role: 'Hairlines + hatch (15% ink)' },
  ],
  colourNote:
    'Restrained on purpose: ink and paper carry the page, one accent, one dark. Quieter text is opacity ' +
    'on ink, not a grey. Texture comes from hatch and hairlines, not colour or a photo.',
  faces: [
    {
      role: 'display',
      name: 'Space Grotesk',
      fontClass: 'ff-display',
      sample: 'Equilibria',
      usage: 'Wordmark and headings. Technical grotesk — precise, a little mechanical.',
    },
    {
      role: 'mono',
      name: 'IBM Plex Mono',
      fontClass: 'ff-mono',
      sample: 'σ ρ β / 01 / DATA',
      usage: 'Labels, annotations, coordinates, and data — the blueprint voice.',
    },
  ],
  motifs: [
    {
      tag: 'a',
      title: 'Hairline frame + ticks',
      body: 'Content sits on a drawn sheet: a 1px ink-15% frame with corner ticks, like a measured drawing.',
    },
    {
      tag: 'b',
      title: 'Diagonal hatch',
      body: 'The texture that replaces flat white and the old photo. A fine 45° hatch in ink-6%, nothing more.',
    },
    {
      tag: 'c',
      title: 'Hatched card',
      body: 'The card the site already gets right, elevated: sharp edges, hatch ground, a hairline border, a mono tag.',
    },
    {
      tag: 'd',
      title: 'Annotated rule',
      body: 'Section breaks are a full hairline with a mono label riding on it — the drawing-callout motif.',
    },
  ],
  drawing: {
    sheetLabel: 'Equilibria Network / identity system',
    revision: 'Version 1.0',
    figureLabel: 'Figure 01 / primary mark',
    markMeasurement: 'Nominal width 160',
    titleBlock: [
      { label: 'Project', value: 'Equilibria Network identity' },
      { label: 'Drawing', value: 'Visual identity guidelines' },
      { label: 'Scale', value: '1 : 1' },
      { label: 'Grid', value: '8 units' },
      { label: 'Status', value: 'Active', accent: true },
      { label: 'Revision', value: '1.0' },
    ],
  },
  components: {
    sectionTitle: 'Components',
    intro:
      'The identity applied to interface elements: a hatched information strip, sharp white body, and an offset hatched shadow on hover.',
    card: {
      phase: 'Phase 02',
      reference: 'EQ-014',
      title: 'Bounded-influence objectives',
      abstract:
        'Reward shaping that keeps a policy’s causal footprint inside a measured envelope under distribution shift.',
      status: 'Status: active',
      caption: 'Research card / hatched header + offset hatch hover',
    },
    tooltips: {
      title: 'Tooltip',
      intro:
        'A solid ink annotation appears above technical terms on hover or keyboard focus. The dashed underline signals that an explanation is available.',
      examples: [
        {
          before: 'Constrained by a',
          term: 'Lyapunov envelope',
          definition: 'A bound that provably contracts over time.',
          after: 'during training.',
        },
        {
          before: 'Measured against the',
          term: 'influence budget',
          definition: 'The maximum causal effect a policy may exert.',
          after: 'per rollout.',
        },
      ],
    },
  },
  closing: {
    title: 'Questions',
    body: 'For brand assets, applications, or partnership materials, contact ',
    email: 'contact@eq-network.org',
  },
};
