// src/content/brand.ts
// Copy and data for the /brand page. The page renders the brand identity FROM the
// real design tokens and motifs, so it doubles as a living check: if the running
// site and this page disagree, the brand has drifted. Canonical written contract:
// apps/site/docs/context/10-visual-language.md.

export interface Swatch {
  name: string;
  hex: string;
  token: string; // CSS custom property in variables.css / Tailwind @theme
  utility: string; // Tailwind utility, e.g. "bg-primary"
  onDark?: boolean; // swatch is dark enough to need light text
  note?: string;
}

export interface LogoLockup {
  name: string;
  file: string; // path under /public
  note: string;
  onDark?: boolean; // preview on a dark panel instead of paper
}

export interface TypeSpecimen {
  label: string;
  fontClass: string; // "font-serif" | "font-sans"
  sample: string;
  usage: string;
}

export interface ScaleStep {
  token: string;
  size: string;
  use: string;
}

export interface Motif {
  title: string;
  body: string;
}

export interface UsageRule {
  do: string;
  dont: string;
}

export interface BrandContent {
  title: string;
  tagline: string;
  intro: string;
  hero: { src: string; alt: string; caption: string };
  sections: {
    logo: string;
    colour: string;
    type: string;
    motifs: string;
    usage: string;
  };
  logos: LogoLockup[];
  logoNote: string;
  swatches: Swatch[];
  colourNote: string;
  typeSpecimens: TypeSpecimen[];
  typeScale: ScaleStep[];
  weightsNote: string;
  motifs: Motif[];
  usage: UsageRule[];
  contact: { heading: string; body: string; email: string };
}

export const brandContent: BrandContent = {
  title: 'Brand',
  tagline: 'The Equilibria Network visual identity, in one place.',
  intro:
    'These are the building blocks of the Equilibria Network brand — the logo, palette, type, and the ' +
    'hand-drawn motifs that make the work recognisable. This page renders straight from the design ' +
    'tokens, so it is also the honest reference: if something here looks off, the system has drifted.',
  hero: {
    src: '/img/brand/brand-hero.webp',
    alt: 'Hand-drawn network of nodes settling into balance, in Equilibria navy.',
    caption: 'Proposed brand illustration (generated) — the hand-drawn network-in-balance motif.',
  },
  sections: {
    logo: 'Logo',
    colour: 'Colour',
    type: 'Typography',
    motifs: 'Signature motifs',
    usage: 'Usage',
  },
  logos: [
    {
      name: 'Icon',
      file: '/img/logo/logo_icon.svg',
      note: 'The standalone mark. Use where the name is already clear.',
    },
    {
      name: 'Icon + wordmark',
      file: '/img/logo/logo_icon_text_big.svg',
      note: 'The primary lockup. Default for headers and covers.',
    },
    {
      name: 'Icon + wordmark (compact)',
      file: '/img/logo/logo_icon_text_small.svg',
      note: 'The inline lockup for tight horizontal space.',
    },
    {
      name: 'Wordmark',
      file: '/img/logo/logo_text_only.svg',
      note: 'Type only, for contexts that already carry the icon.',
    },
  ],
  logoNote:
    'Keep clear space around the logo equal to the height of the icon, and never redraw, recolour, ' +
    'stretch, or add effects to it. On dark backgrounds use the mark as-is; it is built to hold navy.',
  swatches: [
    {
      name: 'Brand navy',
      hex: '#003B7E',
      token: '--color-primary',
      utility: 'bg-primary',
      onDark: true,
      note: 'The brand. A 7-step ramp (--color-primary-dark … --color-primary-lightest) extends it.',
    },
    {
      name: 'Navy light',
      hex: '#0047A1',
      token: '--color-primary-light',
      utility: 'bg-primary-light',
      onDark: true,
    },
    {
      name: 'Accent blue',
      hex: '#4AB3F4',
      token: '--color-accent',
      utility: 'bg-accent',
      note: 'Decorative and small accents only — too light for body text on white.',
    },
    {
      name: 'Sky',
      hex: '#89CFF0',
      token: '--color-sky',
      utility: 'bg-sky',
      note: 'Soft fills and highlights.',
    },
    {
      name: 'Ink',
      hex: '#000000',
      token: '--text-color',
      utility: 'text-ink',
      onDark: true,
      note: 'Body text on white.',
    },
    {
      name: 'Paper',
      hex: '#FFFFFF',
      token: '--bg-color',
      utility: 'bg-paper',
      note: 'The background.',
    },
  ],
  colourNote:
    'Quieter text is opacity on ink (0.85 muted, 0.65 quiet, 0.5 faint) — never a grey hex. Semantic ' +
    'status colours (the explainer/lab reds, greens, oranges) are not yet ratified and should not be extended.',
  typeSpecimens: [
    {
      label: 'Serif — Georgia',
      fontClass: 'font-serif',
      sample: 'Designing new forms of collective intelligence.',
      usage:
        'Editorial: interior-page hero titles and long-form description. Serif carries the gravitas.',
    },
    {
      label: 'Sans — system UI',
      fontClass: 'font-sans',
      sample: 'Designing new forms of collective intelligence.',
      usage: 'Product and UI: body copy, navigation, labels, buttons.',
    },
  ],
  typeScale: [
    { token: '--fs-hero', size: '4.5rem', use: 'Interior hero title' },
    { token: '--fs-h1', size: '3rem', use: 'Page title' },
    { token: '--fs-h2', size: '2.5rem', use: 'Section header' },
    { token: '--fs-h3', size: '1.75rem', use: 'Subsection' },
    { token: '--fs-lg', size: '1.25rem', use: 'Lead / standfirst' },
    { token: '--fs-body', size: '1.125rem', use: 'Body (line-height 1.7)' },
    { token: '--fs-sm', size: '0.95rem', use: 'Meta / captions' },
    { token: '--fs-xs', size: '0.8rem', use: 'Micro-labels / badges' },
  ],
  weightsNote:
    'Weights: 700 for headings and the tagline, 600 for subheads, labels, and CTAs, 500 sparingly. ' +
    'Body sets at 1.125rem / 1.7.',
  motifs: [
    {
      title: 'Hand-drawn roughjs visuals',
      body: 'The differentiator. Sketchy imperfect strokes (roughness ~0.4–1.2) in navy and accent, used for the hero and the explainer/lab diagrams.',
    },
    {
      title: 'Parallax paper texture',
      body: 'A fixed, full-viewport paper texture at ~3% opacity behind transparent content — the quiet warmth under everything.',
    },
    {
      title: 'Textured card, tilting shadow',
      body: 'Publication and roadmap cards sit on paper texture and tilt on a soft overshoot easing when hovered.',
    },
    {
      title: 'Section-title underline',
      body: 'A left-aligned heading with an 80×3px navy underline. The section-header signature (used for every heading on this page).',
    },
    {
      title: 'Dashed "honest hedge" badge',
      body: 'A 1px dashed border with a muted uppercase micro-label, marking anything illustrative, in-design, or assumption-based.',
    },
    {
      title: 'Two-column serif hero',
      body: 'The interior-page hero: a 4.5rem uppercase Georgia title beside a serif description, in a 1fr / 1.2fr split.',
    },
  ],
  usage: [
    {
      do: 'Pull colour and type from the tokens.',
      dont: 'Type a raw hex or rem outside the token layer.',
    },
    {
      do: 'Use the section-underline heading and the shared card.',
      dont: 'Re-invent a heading or card style per page.',
    },
    {
      do: 'Mark illustrative content with the dashed hedge badge.',
      dont: 'Present a mock-up or assumption as if it were final.',
    },
    {
      do: 'Give the logo clear space and leave it navy.',
      dont: 'Recolour, stretch, rotate, or add effects to the logo.',
    },
    {
      do: 'Honour prefers-reduced-motion in any animated visual.',
      dont: 'Ship a roughjs/canvas loop that ignores the setting.',
    },
  ],
  contact: {
    heading: 'Using the brand',
    body: 'For partnership, press, or questions about using these assets, reach us at ',
    email: 'contact@eq-network.org',
  },
};
