// src/content/home.ts
// The home (task-0015): the front door, promoted from /prototype on 2026-08-26.
// The legacy hero / publications / audience content that preceded it is gone
// with the islands that rendered it.
//
// Second pass (owner direction 2026-08-21): the home is a map of the site, not
// a manifesto. Every section below points at one part of the site and borrows
// that part's own copy and pictures (roadmap phases, lab pipeline sketches,
// research one-liners, team and advisors) so the home cannot drift from the
// pages it routes to.
//
// Third pass (owner direction 2026-08-26): the facts strip is gone; the thesis
// is stated in the owner's own words (`thesis.points`) instead of sampled from
// the scroll story; people shows photographs (the about prototype's
// `prototypeImage`) and no longer lists partners or the public record; the
// closing is a plain invitation to collaborate. Hand-written copy is therefore
// the section framings, the thesis points, the closing, and the Writing list
// (which tracks the Substack archive the repo cannot see at build time).
// ---------------------------------------------------------------------------

import type { PageHeaderContent, PageSeo } from './types/page';

export interface FrontLink {
  href: string;
  label: string;
  /** One line under the label; for site pages this is the page's own subtitle. */
  sublabel?: string;
  external?: boolean;
}

/** One short point of the thesis as stated on the home. */
export interface ThesisPoint {
  title: string;
  body: string;
}

/** A blog post card. Sourced from the Substack archive; the two pieces that
 *  were deliberately linked to LessWrong on the old home keep those links. */
export interface WritingPost {
  id: string;
  title: string;
  subtitle: string;
  /** Display date, e.g. "Jul 2026". */
  date: string;
  href: string;
  image: string | null;
}

/** The framing every section shares: a mono label, a heading, one or two
 *  sentences, and the link to the page the section stands for. */
export interface FrontSectionIntro {
  label: string;
  title: string;
  body: string;
  link: FrontLink;
}

export interface HomeFrontContent {
  seo: PageSeo;
  header: PageHeaderContent;
  /** Short in-page index printed under the hero summary. */
  index: { label: string; links: FrontLink[] };
  /** The argument in the owner's words: a lead and a few short points. */
  thesis: FrontSectionIntro & { points: ThesisPoint[] };
  /** Renders the five roadmap phases with their portraits. */
  roadmap: FrontSectionIntro;
  /** Renders the lab pipeline sketches and the library links. */
  library: FrontSectionIntro & { links: FrontLink[]; sketchNote: string };
  /** Renders the four research areas from their one-liners. */
  research: FrontSectionIntro;
  writing: {
    label: string;
    posts: WritingPost[];
    moreLabel: string;
    allLabel: string;
    allHref: string;
  };
  /** Renders the team and advisors from the about content, with their
   *  photographs (`prototypeImage`) rather than the line sketches. */
  people: FrontSectionIntro & {
    teamLabel: string;
    advisorsLabel: string;
  };
  closing: { label: string; title: string; body: string; links: FrontLink[] };
}

export const homeFrontContent: HomeFrontContent = {
  seo: {
    title: 'Equilibria Network — Designing New Forms of Collective Intelligence',
    description:
      'Equilibria Network is a Swedish non-profit research network studying how groups of people and AI systems coordinate, and building the simulation library to design better ways of doing it.',
    canonicalPath: '/',
  },
  header: {
    eyebrow: 'Research network / collective intelligence',
    title: 'Designing new forms of collective intelligence.',
    summary:
      'Equilibria Network is a research network studying how groups of people and AI systems come to act together, and building the tools to design better ways of doing it. The work runs from theory to simulation to practice.',
  },
  index: {
    label: 'On this page',
    links: [
      { href: '#thesis', label: 'Why' },
      { href: '#roadmap', label: 'Where we are going' },
      { href: '#library', label: 'What we build' },
      { href: '#research', label: 'What we study' },
      { href: '#writing', label: 'Writing' },
      { href: '#people', label: 'Who we are' },
      { href: '#collaborate', label: 'Get in touch' },
    ],
  },
  thesis: {
    label: 'Why / the thesis',
    title: 'Cooperation is a property of the network.',
    body: 'To understand how a system works, you have to understand how it cooperates at larger scales. Whether people and AI systems act together depends less on any one of them than on the network around them.',
    points: [
      {
        title: 'Loops spread, good and bad.',
        body: 'Once a few actors start poisoning the well, it spreads through the network. Cooperative clusters exist too, and they spread the same way.',
      },
      {
        title: 'Start the positive loops early.',
        body: 'Computational social science has shown that it matters to start the positive loops early. As AI agents are integrated into society at larger and larger scales, we want positive environments to be what comes out of it.',
      },
      {
        title: 'One language across disciplines.',
        body: 'Existing theories each cover one corner. We are building a cross-disciplinary way of seeing these systems, where democratic decision-making, social choice theory, economics and mechanism design can be modelled in the same language and from the same perspective.',
      },
    ],
    link: { href: '/thesis', label: 'Read the full thesis' },
  },
  roadmap: {
    label: 'Where we are going / roadmap',
    title: 'Five phases, from foundations to self-sustaining networks.',
    body: 'The programme moves from understanding coordination failures, through building and testing new mechanisms in simulation, to validating them in real domains. Each phase is named for a thinker whose work it leans on. Detail thins out further from the present, on purpose.',
    link: { href: '/roadmap', label: 'Read the roadmap' },
  },
  library: {
    label: 'What we build / the CI Library',
    title: 'A simulation library where institutions are objects you can compose.',
    body: 'The Collective Intelligence Library treats a market, a network and a democracy as the same kind of thing: mechanisms acting on one population, scheduled over time. Compose a world, run it, measure it. It is where every research area gets tested.',
    sketchNote:
      'Design sketches of the interface, not screenshots. The engine underneath runs today.',
    link: { href: '/library/explanation', label: 'Inside the library' },
    links: [
      {
        href: '/showcase',
        label: 'Showcase',
        sublabel: 'A basic toy model of gradual disempowerment.',
      },
      {
        href: '/library/roadmap',
        label: 'Dev roadmap',
        sublabel: 'Where we are going next.',
      },
      {
        href: 'https://github.com/Equilibria-Network',
        label: 'GitHub',
        external: true,
      },
    ],
  },
  research: {
    label: 'What we study / research areas',
    title: 'Four research areas, each shown as work in progress.',
    body: 'When does a group of agents count as one agent? How fast can a collective change, and what sets the limit? How much variety does an institution need to keep up with what it governs? And the library where all of it gets tested. Each area has its own page with the open questions and the pieces so far.',
    link: { href: '/research', label: 'The four areas in full' },
  },
  writing: {
    label: 'Writing',
    moreLabel: 'More from the newsletter',
    allLabel: 'All essays on the newsletter',
    allHref: 'https://equilibria1.substack.com/archive',
    posts: [
      {
        id: 'viable-system-model',
        title: 'The Viable System Model & Multi-Scale Agency',
        subtitle: 'Stafford Beer and the quest for understanding general agents.',
        date: 'Jul 2026',
        href: 'https://equilibria1.substack.com/p/the-viable-system-model-and-multi',
        image: null,
      },
      {
        id: 'models-of-society',
        title: 'Models of Society Are Built on Models of Agents',
        subtitle:
          'Part 1 of a series on process alignment, a different way of thinking about agents at every scale.',
        date: 'Jul 2026',
        href: 'https://equilibria1.substack.com/p/stories-of-the-future-are-undermined',
        image: null,
      },
      {
        id: 'taxonomy-of-agents',
        title: 'A Taxonomy of Agents',
        subtitle: 'What kinds of agents exist, and a request for feedback on the classification.',
        date: 'Mar 2026',
        href: 'https://equilibria1.substack.com/p/a-taxonomy-of-agents-intro-and-request',
        image: null,
      },
      {
        id: 'compositional-philosophy',
        title: 'A Compositional Philosophy of Science for Agent Foundations',
        subtitle: 'A philosophy-of-science approach to agent foundations research.',
        date: 'Mar 2026',
        href: 'https://equilibria1.substack.com/p/a-compositional-philosophy-of-science',
        image: null,
      },
      {
        id: 'systemic-risks',
        title: 'Systemic Risks and Where to Find Them',
        subtitle:
          'Todd has a presentation in London on Thursday and three academics, some of them dead, will not stop arguing about root fungi.',
        date: 'Feb 2026',
        href: 'https://equilibria1.substack.com/p/collective-agents-and-where-to-find',
        image: null,
      },
      {
        id: 'spectral-signatures',
        title: 'Spectral Signatures of Gradual Disempowerment',
        subtitle:
          'AI disempowerment operates across markets, networks, and governance at once, but analytical tools do not cross those boundaries.',
        date: 'Feb 2026',
        href: 'https://equilibria1.substack.com/p/spectral-signatures-of-gradual-disempowerment',
        image: '/img/home/publications/spectral.png',
      },
      {
        id: 'atoms-knowledge',
        title: "The Atoms of Knowledge Aren't Universal",
        subtitle:
          'Why DeSci should stop searching for universal verification and start building compositional translations.',
        date: 'Feb 2026',
        href: 'https://equilibria1.substack.com/p/bridges-not-primitives',
        image: '/img/home/publications/atoms.svg',
      },
      {
        id: 'system-level-safety',
        title: 'System Level Safety Evaluations',
        subtitle: 'Adversarial evaluations and safety measures at the level of whole systems.',
        date: 'Sep 2025',
        href: 'https://www.lesswrong.com/posts/AJo2HFT8TdY2B3wNJ/system-level-safety-evaluations',
        image: '/img/home/publications/system.webp',
      },
      {
        id: 'phylogeny-agents',
        title: 'A Phylogeny of Agents',
        subtitle: 'How simple elements give rise to complex wholes with emergent properties.',
        date: 'Aug 2025',
        href: 'https://www.lesswrong.com/posts/vqfT5QCWa66gsfziB/a-phylogeny-of-agents',
        image: '/img/home/publications/philogeny.webp',
      },
    ],
  },
  people: {
    label: 'Who we are / the network',
    title: 'A small team, with advisors across disciplines.',
    body: 'A research network, run as a Swedish non-profit: a core team of two and four advisors from neighbouring fields.',
    teamLabel: 'Team',
    advisorsLabel: 'Advisors',
    link: { href: '/about', label: 'About the network' },
  },
  closing: {
    label: 'Get in touch',
    title: 'We are open to collaboration.',
    body: 'Want to use system dynamics or agent-based models to make better policy proposals? Interested in the foundations of the science we are doing? Write to us. We are happy to talk about either, and about most things in between.',
    links: [
      { href: 'mailto:contact@eq-network.org', label: 'Write to us' },
      { href: 'https://equilibria1.substack.com', label: 'Newsletter', external: true },
      { href: 'https://github.com/Equilibria-Network', label: 'GitHub', external: true },
    ],
  },
};

/** Split the Writing list into the cards that carry a picture and the rest,
 *  keeping archive order inside each. The home shows the first as a card grid
 *  and the second as a compact list, so the grid never renders ragged. */
export function splitWriting(posts: WritingPost[]): {
  featured: WritingPost[];
  more: WritingPost[];
} {
  return {
    featured: posts.filter((post) => post.image),
    more: posts.filter((post) => !post.image),
  };
}

/** A roadmap phase tagline reads "Foundation: Understand Multi-Scale
 *  Coordination". The home shows the phase name separately, so take the part
 *  after the first colon; fall back to the whole line if there is none. */
export function phaseSummary(tagline: string): string {
  const i = tagline.indexOf(':');
  const rest = i === -1 ? tagline : tagline.slice(i + 1);
  return rest.trim().replace(/\.$/, '');
}

/** "AREA 03 / ADAPTIVE INSTITUTIONS" -> "Adaptive institutions": a plain topic
 *  label for the home, where the areas' question-style names read as jargon. */
export function areaTopic(eyebrow: string): string {
  const raw = eyebrow.split('/').pop()?.trim() ?? eyebrow;
  const lower = raw.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}
