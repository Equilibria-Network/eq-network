// src/content/privacy.ts
// Copy for the /privacy page. Kept consistent with apps/site/docs/privacy/data-map.md.
// DRAFT: owner should legal-review before relying on it, and confirm the
// privacy contact inbox below exists and routes.

export interface PrivacyProcessor {
  name: string;
  role: string;
  location: string;
  data: string;
}

export interface PrivacySection {
  heading: string;
  paragraphs?: string[];
  /** Optional processor table rendered after the paragraphs. */
  processors?: PrivacyProcessor[];
}

export interface PrivacyContent {
  title: string;
  lastUpdated: string;
  intro: string[];
  sections: PrivacySection[];
  contact: {
    heading: string;
    body: string;
    email: string;
  };
}

export const privacyContent: PrivacyContent = {
  title: 'Privacy Policy',
  lastUpdated: '28 July 2026',
  intro: [
    'Equilibria Network operates the website at eq-network.org. This policy explains what personal data the site handles, why, who processes it, and the choices you have. We keep it short because the site collects very little.',
    'The site is a static website. It sets no cookies, runs no analytics, and loads no third-party tracking scripts. The only place you can share personal data with us is the contact form.',
  ],
  sections: [
    {
      heading: 'What we collect',
      paragraphs: [
        'If you use the contact form, we collect the name, email address, and message you provide. We do not create accounts, track your behaviour, collect location data, or handle any special-category data.',
      ],
    },
    {
      heading: 'Why we collect it',
      paragraphs: [
        'We use the details you submit only to read and respond to your enquiry. The lawful basis is your consent, given when you choose to send the form, together with our legitimate interest in replying to you.',
      ],
    },
    {
      heading: 'Who processes your data',
      paragraphs: [
        'The site has no backend of its own. Two third-party services process data on our behalf:',
      ],
      processors: [
        {
          name: 'GitHub Pages',
          role: 'Website hosting',
          location: 'United States',
          data: 'Standard request metadata (such as IP address and browser user-agent) in server access logs',
        },
        {
          name: 'Formspree',
          role: 'Contact-form delivery',
          location: 'United States',
          data: 'The name, email address, and message from each contact-form submission',
        },
      ],
    },
    {
      heading: 'International transfers',
      paragraphs: [
        'Both processors are based in the United States, so data you submit may be processed there. We prefer EU-resident or self-hosted processing and may move the contact form to an EU-resident handler in future; this policy will be updated if we do.',
      ],
    },
    {
      heading: 'How long we keep it',
      paragraphs: [
        'We do not run a database, so we do not store contact submissions ourselves. Messages are held by the form processor according to its own retention policy; email replies live in our normal mailbox for as long as we need them to handle your enquiry.',
      ],
    },
    {
      heading: 'Cookies and tracking',
      paragraphs: ['The site sets no cookies and uses no analytics or advertising trackers.'],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'You can ask us to access, correct, or delete the personal data you have sent us, or object to our use of it. Contact us using the details below and we will respond within a reasonable time.',
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: [
        'We may update this policy as the site changes. The "last updated" date above shows the current version.',
      ],
    },
  ],
  contact: {
    heading: 'Contact',
    body: 'For any privacy question or request, email us at',
    email: 'contact@eq-network.org',
  },
};
