// src/content/site.ts
// Site chrome: copy and link data for the shared header, footer, contact form,
// error page, and per-page screen-reader titles. Kept out of components so all
// user-facing copy lives in one place and the site stays i18n-ready
// (see docs/adr/0006-i18n-readiness.md).

export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface SocialLink {
  name: string;
  icon: string;
  href: string;
}

export interface SiteContent {
  brand: string;
  skipToContent: string;
  nav: {
    toggleMenuLabel: string;
    links: NavLink[];
  };
  /** Screen-reader-only page titles for routes whose design has no visible <h1>. */
  pageTitles: {
    home: string;
    research: string;
    thesis: string;
  };
  footer: {
    tagline: string;
    quickLinksHeading: string;
    links: NavLink[];
    socials: SocialLink[];
    copyrightName: string;
  };
  contact: {
    heading: string;
    notConfigured: string;
    successTitle: string;
    successText: string;
    fields: {
      name: { label: string; placeholder: string };
      email: { label: string; placeholder: string };
      message: { label: string; placeholder: string };
    };
    submit: string;
    submitting: string;
  };
  notFound: {
    code: string;
    title: string;
    description: string;
    homeCta: string;
  };
}

export const siteContent: SiteContent = {
  brand: 'Equilibria Network',
  skipToContent: 'Skip to content',
  nav: {
    toggleMenuLabel: 'Toggle menu',
    links: [
      { href: '/', label: 'Home' },
      { href: '/explainer', label: 'Thesis' },
      { href: '/roadmap', label: 'Roadmap' },
      { href: '/products', label: 'Products' },
      { href: '/about', label: 'About' },
    ],
  },
  pageTitles: {
    home: 'Equilibria Network',
    research: 'Research',
    thesis: 'Thesis',
  },
  footer: {
    tagline:
      'Exploring the design space of collective intelligence through simulations and mathematical foundations.',
    quickLinksHeading: 'Quick Links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'Newsletter', href: 'https://wizardryweekly.substack.com/', external: true },
    ],
    socials: [
      {
        name: 'GitHub',
        icon: '/img/socials/github.svg',
        href: 'https://github.com/Equilibria-Network',
      },
      {
        name: 'LinkedIn',
        icon: '/img/socials/linkedin.svg',
        href: 'https://www.linkedin.com/company/equilibria-network',
      },
      {
        name: 'Substack',
        icon: '/img/socials/substack.svg',
        href: 'https://substack.com/@equilibria1',
      },
    ],
    copyrightName: 'Equilibria Network',
  },
  contact: {
    heading: 'Contact Us',
    notConfigured:
      'The contact form is not configured yet. Please reach out via one of the links in the footer.',
    successTitle: 'Thank you for your message!',
    successText: "We'll get back to you soon.",
    fields: {
      name: { label: 'Your name', placeholder: 'Your name' },
      email: { label: 'Your email', placeholder: 'Your email' },
      message: { label: 'Your message', placeholder: 'Your message' },
    },
    submit: 'Send Message',
    submitting: 'Sending...',
  },
  notFound: {
    code: '404',
    title: 'Page Not Found',
    description: "The page you're looking for doesn't exist or has been moved.",
    homeCta: 'Go Home',
  },
};
