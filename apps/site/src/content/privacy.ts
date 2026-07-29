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
    'Equilibria Network operates eq-network.org and is the controller for personal data submitted through this site. This policy explains what data travels where, why it is processed, and what you can do to reduce what you reveal.',
    'The site is static. We set no first-party cookies, run no analytics or advertising, and load no third-party tracking scripts. Hosting still exposes ordinary request metadata to GitHub Pages, and the contact form sends the details you choose to provide to Formspree.',
  ],
  commitment: {
    title: 'Our minimisation commitment',
    body: 'Privacy is not delegated to a policy document. We try to remove collection at the system level before asking visitors to manage it themselves.',
    principles: [
      'No analytics, advertising pixels, behavioural profiles, or cross-site tracking.',
      'No account system and no database of website visitors.',
      'Only three contact fields: name, email address, and message.',
      'No sale, rental, or advertising use of contact data.',
      'A planned move from Formspree to an EU-resident form handler.',
    ],
  },
  sections: [
    {
      heading: 'What reaches our service providers',
      paragraphs: [
        'A normal web request necessarily reveals some technical metadata to the host. Submitting the contact form reveals additional information to the form processor. The table separates what we control, what a processor receives, and practical steps you can take.',
        'A VPN or privacy tool changes which intermediary you trust; it does not guarantee anonymity. Do not include sensitive or unnecessary personal information in a contact message.',
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
      heading: 'Purpose and lawful basis',
      paragraphs: [
        'We use contact-form details only to receive, assess, and respond to your enquiry. Our lawful basis is legitimate interests: operating an organisational contact channel and replying to people who choose to contact us. We balance that interest by collecting few fields, using the data only for correspondence, and honouring objections and deletion requests where the law allows.',
        'We do not use contact submissions for automated decisions, profiling, advertising, or an unrelated mailing list.',
      ],
    },
    {
      heading: 'International transfers',
      paragraphs: [
        'GitHub and Formspree are US-based providers, so personal data may be processed outside the European Economic Area. Their published safeguards include European Commission Standard Contractual Clauses; GitHub also publishes participation in the EU–US Data Privacy Framework.',
        'These safeguards reduce legal risk but do not make a US transfer identical to EU-only processing. Moving contact-form delivery to an EU-resident provider is planned.',
      ],
    },
    {
      heading: 'Retention and deletion',
      paragraphs: [
        'We keep correspondence only while it remains useful for handling the enquiry, maintaining the relationship, or meeting a legal obligation. We periodically remove messages that no longer serve those purposes.',
        'Formspree may retain submissions in its dashboard and backups under its own service controls. Until a precise account-level deletion schedule has been confirmed, we do not promise a fixed number of days. You may ask us to delete your submission and we will remove the copies under our control and initiate any processor-side deletion available to us.',
        'GitHub controls retention of its security logs. GitHub states that retention depends on the collection purpose and legal obligations.',
      ],
    },
    {
      heading: 'Cookies, local storage, and tracking',
      paragraphs: [
        'Equilibria Network sets no cookies or local-storage identifiers and runs no analytics, advertising, session replay, or fingerprinting code.',
        'Links to external websites are separate services with their own privacy practices. Our no-referrer policy is intended to avoid sending those sites the address of the Equilibria page you came from.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'Depending on the circumstances, GDPR gives you rights to information, access, correction, deletion, restriction, objection, and data portability. You may also withdraw consent where a processing activity actually relies on consent. Some rights have legal limits.',
        'Contact us using the details below. We may need enough information to verify that the request concerns you. You can also complain to Sweden’s data-protection authority, Integritetsskyddsmyndigheten (IMY).',
      ],
      links: [
        {
          label: 'IMY: your rights under GDPR',
          href: 'https://www.imy.se/privatperson/dataskydd/dina-rattigheter/',
        },
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: [
        'We update this page when processors, collection, purposes, or legal responsibilities change. The date at the top identifies the current version.',
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
