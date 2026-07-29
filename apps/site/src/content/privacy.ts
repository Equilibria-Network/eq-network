// Public privacy contract for eq-network.org. Keep this synchronized with
// apps/site/docs/privacy/data-map.md and the actual deployed processors.

export interface PrivacyLink {
  label: string;
  href: string;
}

export interface PrivacyProcessor {
  name: string;
  role: string;
  location: string;
  data: string;
  safeguards: string;
  visitorMitigation: string;
  assurance: Array<{
    framework: string;
    statement: string;
    href: string;
  }>;
  policyLinks: PrivacyLink[];
}

export interface PrivacySection {
  heading: string;
  paragraphs?: string[];
  links?: PrivacyLink[];
  processors?: PrivacyProcessor[];
}

export interface PrivacyContent {
  title: string;
  lastUpdated: string;
  intro: string[];
  commitment: {
    title: string;
    body: string;
    principles: string[];
  };
  sections: PrivacySection[];
  privacyTools: Array<{
    title: string;
    body: string;
    href: string;
    cta: string;
  }>;
  contact: {
    heading: string;
    body: string;
    email: string;
    authorityLabel: string;
    authorityHref: string;
  };
}

export const privacyContent: PrivacyContent = {
  title: 'Privacy Policy',
  lastUpdated: '29 July 2026',
  intro: [
    'We built this site to learn from, not to learn about you. There are no accounts, analytics, ad trackers, or cookies.',
    'Two outside services still handle some information: GitHub serves the pages, and Formspree delivers messages from the contact form. The useful version is below; open the details only if you want them.',
  ],
  commitment: {
    title: 'What we do—and do not do',
    body: 'Our first privacy control is simply not collecting the data. That is much more useful than asking you to click through a banner.',
    principles: [
      'No analytics, advertising pixels, behavioural profiles, or cross-site tracking.',
      'No account system and no database of website visitors.',
      'Only three contact fields: name, email address, and message.',
      'No sale, rental, or advertising use of contact data.',
      'We plan to replace Formspree with an EU-resident form handler.',
    ],
  },
  sections: [
    {
      heading: 'The only services involved',
      paragraphs: [
        'Opening a website always tells its host something about the connection. Sending us a message also gives the form service whatever you type. Those are the only two data paths on this site.',
        'Select a service to see exactly what it may receive, what we do about it, and what you can do if you want to reveal less.',
      ],
      processors: [
        {
          name: 'GitHub Pages',
          role: 'Static website hosting',
          location: 'United States and other GitHub processing locations',
          data: 'IP address is logged for security. Ordinary request metadata may include time, requested path, browser user-agent, and referring origin.',
          safeguards:
            'We publish static files only, set no analytics cookies, load no tracker, and send a no-referrer policy for outbound navigation. We do not receive GitHub’s raw visitor logs.',
          visitorMitigation:
            'A trusted VPN or Tor can mask your network IP from the destination. A privacy-oriented browser can reduce user-agent and fingerprint uniqueness.',
          assurance: [
            {
              framework: 'GDPR / transfers',
              statement:
                'GitHub publishes GDPR lawful bases, EU Standard Contractual Clauses, and EU–US Data Privacy Framework participation.',
              href: 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
            },
            {
              framework: 'US state privacy',
              statement:
                'GitHub’s privacy statement documents California and other US state rights and request routes.',
              href: 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement#us-state-specific-information',
            },
          ],
          policyLinks: [
            {
              label: 'GitHub Pages data collection',
              href: 'https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection',
            },
            {
              label: 'GitHub privacy statement',
              href: 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
            },
          ],
        },
        {
          name: 'Formspree',
          role: 'Contact-form processing and delivery',
          location: 'United States',
          data: 'Name, email address, message, and request metadata needed to process and protect the submission, which may include IP address, user-agent, and referrer.',
          safeguards:
            'We request only the fields needed to reply. We do not add marketing fields or mailing-list consent. Migration to an EU-resident handler is planned; until then, Formspree remains the active processor.',
          visitorMitigation:
            'Use an email alias if you do not want to disclose your primary address. Use a pseudonym where your legal name is not needed, and omit sensitive details from the message.',
          assurance: [
            {
              framework: 'GDPR / transfers',
              statement:
                'Formspree states that it acts as a processor and relies on EU Standard Contractual Clauses.',
              href: 'https://formspree.io/security/',
            },
            {
              framework: 'CCPA',
              statement:
                'Formspree states that it supports California rights to know, delete, opt out, and receive non-discriminatory treatment.',
              href: 'https://formspree.io/security/',
            },
            {
              framework: 'SOC 2 Type II',
              statement:
                'Formspree states that an independent auditor has assessed its controls against the AICPA Trust Services Criteria.',
              href: 'https://formspree.io/security/',
            },
          ],
          policyLinks: [
            { label: 'Formspree security and privacy', href: 'https://formspree.io/security/' },
            {
              label: 'Formspree privacy policy',
              href: 'https://formspree.io/legal/privacy-policy/',
            },
          ],
        },
      ],
    },
    {
      heading: 'Why we use it',
      paragraphs: [
        'If you write to us, we use your message and reply address to read it and respond. That is it. We rely on legitimate interests to run this basic contact channel.',
        'Your message does not put you on a mailing list. We do not profile you, advertise to you, or make automated decisions about you.',
      ],
    },
    {
      heading: 'Where it goes',
      paragraphs: [
        'GitHub and Formspree are US-based, so some data may be processed outside the European Economic Area. Both publish contractual safeguards for European data transfers, and GitHub also publishes participation in the EU–US Data Privacy Framework.',
        'Paperwork is not the same thing as EU-only processing. We therefore keep collection small and plan to move the contact form to an EU-resident provider.',
      ],
    },
    {
      heading: 'How long we keep it',
      paragraphs: [
        'We keep correspondence while it is useful for the conversation, an ongoing relationship, or a legal obligation. We remove messages that no longer have a reason to be there.',
        'Formspree may retain submissions in its dashboard and backups under its own service controls. Until a precise account-level deletion schedule has been confirmed, we do not promise a fixed number of days. You may ask us to delete your submission and we will remove the copies under our control and initiate any processor-side deletion available to us.',
        'GitHub controls retention of its security logs. GitHub states that retention depends on the collection purpose and legal obligations.',
      ],
    },
    {
      heading: 'Cookies and tracking',
      paragraphs: [
        'There is no cookie banner because we do not set cookies. We also do not use local-storage identifiers, analytics, advertising, session replay, or fingerprinting code.',
        'Links to external websites are separate services with their own privacy practices. Our no-referrer policy is intended to avoid sending those sites the address of the Equilibria page you came from.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'You can ask what we hold about you, ask us to correct or delete it, restrict how we use it, or object. GDPR rights depend on the circumstances and sometimes have legal limits.',
        'Email us below. We may need enough information to confirm the request is really yours. You can also complain to Sweden’s data-protection authority, IMY.',
      ],
      links: [
        {
          label: 'IMY: your rights under GDPR',
          href: 'https://www.imy.se/privatperson/dataskydd/dina-rattigheter/',
        },
      ],
    },
    {
      heading: 'If this changes',
      paragraphs: [
        'If we add a service, collect something new, or change why data is used, we will update this page. The date at the top tells you which version you are reading.',
      ],
    },
  ],
  privacyTools: [
    {
      title: 'See your browser fingerprint',
      body: 'EFF’s Cover Your Tracks explains how browser configuration can make a browser recognisable even without cookies.',
      href: 'https://coveryourtracks.eff.org/',
      cta: 'Open Cover Your Tracks',
    },
    {
      title: 'Check network and browser leaks',
      body: 'Mullvad’s Connection Check displays the public IP, DNS, WebRTC, and other signals visible from your connection.',
      href: 'https://mullvad.net/en/check',
      cta: 'Open Connection Check',
    },
    {
      title: 'Use an email alias',
      body: 'An alias can receive replies without revealing your primary mailbox and can be disabled if it is later abused.',
      href: 'https://simplelogin.io/blog/what-is-an-email-alias/',
      cta: 'Learn about aliases',
    },
  ],
  contact: {
    heading: 'Privacy contact',
    body: 'For a privacy question or rights request, email',
    email: 'contact@eq-network.org',
    authorityLabel: 'Swedish Authority for Privacy Protection (IMY)',
    authorityHref: 'https://www.imy.se/privatperson/utfora-arenden/lamna-ett-klagomal/',
  },
};
