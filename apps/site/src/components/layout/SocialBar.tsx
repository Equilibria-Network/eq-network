// src/components/layout/SocialBar.tsx
import React from 'react';
import styles from './SocialBar.module.css';

interface Social {
  name: string;
  platform: string;
  href: string;
  icon: string;
}

const socialIcons: Record<string, string> = {
  github: '/img/socials/github.svg',
  linkedin: '/img/socials/linkedin.svg',
  twitter: '/img/socials/twitter.svg',
  substack: '/img/socials/substack.svg',
  youtube: '/img/socials/youtube.svg',
  discord: '/img/socials/discord.svg',
  arxiv: '/img/socials/arxiv.svg',
  lesswrong: '/img/socials/lesswrong.svg',
};

const buildSocialUrl = (platform: string, handle: string): string => {
  const urlBuilders: Record<string, (handle: string) => string> = {
    github: (handle) => `https://github.com/${handle}`,
    linkedin: (handle) => `https://www.linkedin.com/company/${handle}`,
    twitter: (handle) => `https://twitter.com/${handle}`,
    substack: (handle) => `https://substack.com/@${handle}`,
    youtube: (handle) => `https://youtube.com/@${handle}`,
    discord: (handle) => handle,
    arxiv: (handle) => `https://arxiv.org/${handle}`,
    lesswrong: (handle) => `https://lesswrong.com/users/${handle}`,
    email: (email) => `mailto:${email}`,
    website: (url) => url,
  };

  return urlBuilders[platform] ? urlBuilders[platform](handle) : handle;
};

interface SocialBarProps {
  socials?: Record<string, string>;
}

export default function SocialBar({ socials = {} }: SocialBarProps) {
  const activeSocials = Object.entries(socials)
    .filter(([platform, value]) => value && socialIcons[platform])
    .map(([platform, value]) => ({
      name: platform.charAt(0).toUpperCase() + platform.slice(1),
      platform,
      href: buildSocialUrl(platform, value),
      icon: socialIcons[platform],
    }));

  const fallbackSocials: Social[] = [
    {
      name: 'GitHub',
      platform: 'github',
      href: 'https://github.com/Equilibria-Network',
      icon: '/img/socials/github.svg',
    },
    {
      name: 'LinkedIn',
      platform: 'linkedin',
      href: 'https://www.linkedin.com/company/equilibria-network',
      icon: '/img/socials/linkedin.svg',
    },
    {
      name: 'Substack',
      platform: 'substack',
      href: 'https://substack.com/@equilibria1',
      icon: '/img/socials/substack.svg',
    },
  ];

  const socialsToRender = activeSocials.length > 0 ? activeSocials : fallbackSocials;

  if (socialsToRender.length === 0) {
    return null;
  }

  return (
    <div className={styles.socialBar}>
      <div className={styles.container}>
        <div className={styles.socialIcons}>
          {socialsToRender.map((social) => (
            <a
              key={social.platform}
              href={social.href}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
            >
              <img src={social.icon} alt={social.name} className={styles.socialIcon} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
