// src/content/authorship.ts
//
// Copy for the "AI-assisted text" tag shown at the top right of a page
// header. Each page that carries the tag declares how much of its text an AI
// language model drafted; the tag's hover/focus note says what that means.
// Strings live here so the tag component holds no copy (ADR-0004).

export type AuthorshipLevel = 'partly' | 'mainly';

export interface AuthorshipNote {
  /** Short heading inside the note ("Mainly AI-written"). */
  title: string;
  /** One or two short sentences: who drafted the text, who is responsible. */
  body: string;
}

export interface AuthorshipContent {
  /** The visible tag text. */
  label: string;
  /** Accessible name for the tag button, read before the note. */
  ariaLabel: string;
  notes: Record<AuthorshipLevel, AuthorshipNote>;
}

export const authorshipContent: AuthorshipContent = {
  label: 'AI-assisted text',
  ariaLabel: 'About how the text on this page was written',
  notes: {
    partly: {
      title: 'Partly AI-written',
      body: 'Some of this text was drafted by an AI model from our instructions and material. We edit it and are responsible for it.',
    },
    mainly: {
      title: 'Mainly AI-written',
      body: 'Most of this text was drafted by an AI model from our instructions and material. We edit it and are responsible for it.',
    },
  },
};
