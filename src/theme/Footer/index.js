// src/theme/Footer/index.js
import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { ContactForm } from './ContactForm';
import styles from './Footer.module.css';

// Social platform icon mappings
const socialIcons = {
  github: '/img/socials/github.svg',
  linkedin: '/img/socials/linkedin.svg',
  twitter: '/img/socials/twitter.svg',
  substack: '/img/socials/substack.svg',
  youtube: '/img/socials/youtube.svg',
  discord: '/img/socials/discord.svg',
  arxiv: '/img/socials/arxiv.svg',
  lesswrong: '/img/socials/lesswrong.svg',
};

// URL builders for different platforms
const buildSocialUrl = (platform, handle) => {
  const urlBuilders = {
    github: (handle) => `https://github.com/${handle}`,
    linkedin: (handle) => `https://www.linkedin.com/company/${handle}`,
    twitter: (handle) => `https://twitter.com/${handle}`,
    substack: (handle) => `https://substack.com/@${handle}`,
    youtube: (handle) => `https://youtube.com/@${handle}`,
    discord: (handle) => handle, // Assume full URL
    arxiv: (handle) => `https://arxiv.org/${handle}`,
    lesswrong: (handle) => `https://lesswrong.com/users/${handle}`,
    email: (email) => `mailto:${email}`,
    website: (url) => url,
  };
  
  return urlBuilders[platform] ? urlBuilders[platform](handle) : handle;
};

export default function Footer() {
  const { siteConfig } = useDocusaurusContext();
  const { themeConfig } = siteConfig;
  const { socials } = themeConfig;

  // Filter out platforms that don't have icons or values
  const activeSocials = Object.entries(socials || {})
    .filter(([platform, value]) => value && socialIcons[platform])
    .map(([platform, value]) => ({
      name: platform.charAt(0).toUpperCase() + platform.slice(1),
      platform,
      href: buildSocialUrl(platform, value),
      icon: socialIcons[platform]
    }));

  // Fallback socials if config is empty
  const fallbackSocials = [
    {
      name: 'GitHub',
      platform: 'github',
      href: 'https://github.com/Equilibria-Network',
      icon: '/img/socials/github.svg'
    },
    {
      name: 'LinkedIn',
      platform: 'linkedin',
      href: 'https://www.linkedin.com/company/equilibria-network',
      icon: '/img/socials/linkedin.svg'
    },
    {
      name: 'Substack',
      platform: 'substack',
      href: 'https://substack.com/@equilibria1',
      icon: '/img/socials/substack.svg'
    }
  ];

  const socialsToRender = activeSocials.length > 0 ? activeSocials : fallbackSocials;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Logo, Description and Social Icons */}
          <div className={styles.logoSection}>
            <img 
              src="/img/logo_icon_text_2.svg"
              alt="Equilibria Network"
              className={styles.logo}
            />
            <p className={styles.description}>
              Fostering resilience, agency, and positive-sum collaboration in hybrid human-AI systems.
            </p>
            
            {/* Social Icons */}
            <div className={styles.logoSocials}>
              {socialsToRender.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  className={styles.logoSocialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <img 
                    src={social.icon} 
                    alt={social.name}
                    className={styles.logoSocialIcon}
                  />
                </a>
              ))}
            </div>
          </div>
          
          {/* Contact Form */}
          <div className={styles.formSection}>
            <ContactForm />
          </div>
          
          {/* Links */}
          <div className={styles.linksSection}>
            <h3 className={styles.linksTitle}>Stay Coordinated</h3>
            <ul className={styles.linksList}>
              <li>
                <a 
                  href="https://lu.ma/calendar/cal-DywZJnk1m1uAMlD"
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img 
                    src="/img/footer/calendar.svg" 
                    alt="" 
                    className={styles.linkIcon}
                  />
                  Luma Calendar
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.divider} />
        
        {/* Copyright */}
        <div className={styles.copyright}>
          <div className={styles.copyrightContent}>
            <span className={styles.copyrightYear}>© {new Date().getFullYear()}</span>
            <span className={styles.copyrightName}>Equilibria Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
