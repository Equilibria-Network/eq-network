// src/content/social.ts

export interface SocialLink {
  name: string;
  url: string;
  icon: string; // lucide-react icon name
}

export const socialLinks: SocialLink[] = [
  {
    name: 'Twitter',
    url: 'https://twitter.com/equilibrianet',
    icon: 'Twitter',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/equilibria-xyz',
    icon: 'Github',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/equilibria-network',
    icon: 'Linkedin',
  },
  {
    name: 'Substack',
    url: 'https://equilibria.substack.com',
    icon: 'Mail',
  },
];
