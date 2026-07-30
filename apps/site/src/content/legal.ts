export interface LegalDetail {
  label: string;
  value: string;
}

export interface LegalContent {
  title: string;
  eyebrow: string;
  intro: string;
  details: LegalDetail[];
  sections: Array<{
    heading: string;
    paragraphs: string[];
    links?: Array<{ label: string; href: string }>;
  }>;
  contact: {
    heading: string;
    body: string;
    email: string;
  };
}

export const legalContent: LegalContent = {
  title: 'Legal information',
  eyebrow: 'ORGANISATION / PUBLIC RECORD',
  intro:
    'This page identifies the organisation responsible for eq-network.org and provides a durable contact point for formal enquiries.',
  details: [
    { label: 'Legal name', value: 'EQUILIBRIA NETWORK' },
    { label: 'Organisation number', value: '802556-9552' },
    { label: 'Legal form', value: 'Swedish nonprofit association' },
    { label: 'Registration date', value: '12 June 2026' },
    { label: 'Registered municipality', value: 'Uppsala' },
    { label: 'Status', value: 'Registered' },
    { label: 'Website', value: 'eq-network.org' },
  ],
  sections: [
    {
      heading: 'Website operator',
      paragraphs: [
        'Equilibria Network operates this website and is responsible for its published organisational and research information.',
        'The website is informational. Nothing published here constitutes legal, financial, or professional advice.',
      ],
    },
    {
      heading: 'Website host',
      paragraphs: [
        'This static website is hosted through GitHub Pages. GitHub’s European entity is GitHub B.V., Prins Bernhardplein 200, Amsterdam 1097 JB, the Netherlands. GitHub, Inc. is located at 88 Colin P. Kelly Jr. Street, San Francisco, California 94107, United States.',
      ],
      links: [
        {
          label: 'GitHub Pages service information',
          href: 'https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages',
        },
        {
          label: 'GitHub privacy statement',
          href: 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
        },
      ],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        'The website source code is published under the MIT licence included with its public repository. Unless a page or downloadable work says otherwise, names, marks, research writing, images, and other editorial materials remain the property of Equilibria Network or their respective rights holders.',
      ],
      links: [
        { label: 'Source-code licence', href: 'https://github.com/Equilibria-Network/eq-network' },
      ],
    },
    {
      heading: 'Privacy',
      paragraphs: [
        'The site does not use analytics or advertising trackers. Personal data submitted through the contact form is handled as described in the Privacy Policy.',
      ],
    },
  ],
  contact: {
    heading: 'Formal contact',
    body: 'For legal, organisational, or rights-related enquiries, contact',
    email: 'contact@eq-network.org',
  },
};
