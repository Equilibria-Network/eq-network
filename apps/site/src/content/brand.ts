// src/content/brand.ts
// Data for the /brand page. NOTE: this page is currently a PROTOTYPE exploration,
// not the settled brand. It proposes one direction ("blueprint / measured") built
// on the two cornerstones the owner endorsed: the Lorenz attractor and the hatched
// card. We iterate on prototypes here, then settle; the settled version becomes the
// real brand page that informs the rest of the site. Copy stays out of components
// (ADR-0004).

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
  prototypeNote: string;
  eyebrow: string;
  wordmark: string;
  tagline: string;
  intro: string;
  system: { tag: string; equations: string[]; params: string };
  sections: { mark: string; colour: string; type: string; motifs: string };
  markIntro: string;
  marks: Mark[];
  swatches: Swatch[];
  colourNote: string;
  faces: TypeFace[];
  motifs: Motif[];
  closing: { title: string; body: string; email: string };
}

export const brandContent: BrandContent = {
  prototypeNote:
    'Prototype — a direction, not the brand. We are exploring, not locking in. Everything here is up for iteration.',
  eyebrow: 'Identity / exploration',
  wordmark: 'Equilibria',
  tagline: 'Designing new forms of collective intelligence.',
  intro:
    'One direction for the Equilibria identity: measured and minimal, drawn like a blueprint — clear ' +
    'lines, sharp edges, honest structure — around the two things worth keeping: the Lorenz attractor and ' +
    'the hatched card.',
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
    'The mark is the Lorenz attractor, taken as closed contours — a thick outer loop with a few nested ' +
    'inner rings for fill. Clean vector paths regenerated from the equations, a fraction of the old 518 KB ' +
    'hand-traced logo.',
  marks: [
    {
      label: '01 / mark · navy',
      src: '/img/brand/marks/v-contour.svg',
      note: 'Primary. Bold enough to hold at small sizes.',
    },
    {
      label: '02 / mark · reversed',
      src: '/img/brand/marks/v-contour-white.svg',
      dark: true,
      note: 'On ink / dark sections.',
    },
    {
      label: '03 / mark · line',
      src: '/img/brand/marks/v-duo.svg',
      note: 'Lighter weight for large or quiet uses.',
    },
    {
      label: '04 / mark · accent',
      src: '/img/brand/marks/v-contour-accent.svg',
      note: 'Accent, used sparingly.',
    },
  ],
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
  closing: {
    title: 'This is a draft',
    body: 'React to it — keep, cut, or push further — and it becomes the next prototype. Reach us at ',
    email: 'contact@eq-network.org',
  },
};
