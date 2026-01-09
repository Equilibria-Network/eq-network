// src/components/layout/Footer.tsx
import React from 'react';
import ContactForm from './ContactForm';
import styles from './Footer.module.css';

export default function Footer() {
  const footerLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Roadmap', href: '/roadmap' },
    { label: 'Newsletter', href: 'https://wizardryweekly.substack.com/', external: true }
  ];

  const socials = [
    { name: 'GitHub', icon: '/img/socials/github.svg', href: 'https://github.com/Equilibria-Network' },
    { name: 'LinkedIn', icon: '/img/socials/linkedin.svg', href: 'https://www.linkedin.com/company/equilibria-network' },
    { name: 'Substack', icon: '/img/socials/substack.svg', href: 'https://substack.com/@equilibria1' }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Logo Section */}
          <div className={styles.logoSection}>
            <img 
              src="/img/logo/logo_text_only.svg" 
              alt="Equilibria Network"
              className={styles.logo}
            />
            <p className={styles.description}>
              Exploring the design space of collective intelligence through simulations and mathematical foundations.
            </p>
            <div className={styles.logoSocials}>
              {socials.map((social) => (
                <a
                  key={social.name}
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

          {/* Contact Form Section */}
          <div className={styles.formSection}>
            <ContactForm />
          </div>

          {/* Quick Links Section */}
          <div className={styles.linksSection}>
            <h3 className={styles.linksTitle}>Quick Links</h3>
            <ul className={styles.linksList}>
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className={styles.link}
                    {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.divider} />
        <div className={styles.copyright}>
          <div className={styles.copyrightContent}>
            <span className={styles.copyrightYear}>{new Date().getFullYear()}</span>
            <span className={styles.copyrightName}>Equilibria Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
