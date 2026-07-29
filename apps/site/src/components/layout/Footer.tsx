// src/components/layout/Footer.tsx
import ContactForm from './ContactForm';
import { siteContent } from '@content/site';
import styles from './Footer.module.css';

export default function Footer() {
  const { brand, footer } = siteContent;
  const {
    links: footerLinks,
    institutionalLinks,
    socials,
    tagline,
    quickLinksHeading,
    copyrightName,
  } = footer;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Logo Section */}
          <div className={styles.logoSection}>
            <img
              src="/img/logo/logo_text_only.svg"
              alt={brand}
              className={styles.logo}
              loading="lazy"
              decoding="async"
            />
            <p className={styles.description}>{tagline}</p>
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
                    loading="lazy"
                    decoding="async"
                    src={social.icon}
                    alt={social.name}
                    className={styles.logoSocialIcon}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form Section */}
          <div id="contact" className={styles.formSection}>
            <ContactForm />
          </div>

          {/* Quick Links Section */}
          <div className={styles.linksSection}>
            <h3 className={styles.linksTitle}>{quickLinksHeading}</h3>
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

        <div className={styles.footerBase}>
          <div className={styles.copyrightContent}>
            <span className={styles.copyrightYear}>{new Date().getFullYear()}</span>
            <span className={styles.copyrightName}>{copyrightName}</span>
          </div>
          <nav className={styles.institutionalNav} aria-label="Institutional information">
            <ul className={styles.institutionalLinks}>
              {institutionalLinks.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <a href={link.href}>{link.label}</a>
                  ) : (
                    <span aria-label={link.unavailableLabel} title={link.unavailableLabel}>
                      {link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
