// src/components/layout/Navbar.tsx
import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { siteContent } from '@content/site';
import styles from './Navbar.module.css';

interface NavbarProps {
  currentPath?: string;
}

export default function Navbar({ currentPath = '/' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  // Check if we're on the home page
  const isHomePage = currentPath === '/';

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar background + logo when scrolled down past 100px
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { links: navLinks, toggleMenuLabel } = siteContent.nav;

  // On home page: show logo only when scrolled
  // On other pages: always show logo
  const shouldShowLogo = !isHomePage || isScrolled;
  const shouldShowBackground = !isHomePage || isScrolled;

  return (
    <nav className={`${styles.navbar} ${shouldShowBackground ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo - visibility depends on page and scroll */}
        <a
          href="/"
          className={`${styles.logo} ${shouldShowLogo ? styles.logoVisible : styles.logoHidden}`}
        >
          <img
            src="/img/logo/logo_icon_text_big.svg"
            alt={siteContent.brand}
            className={styles.logoImage}
          />
        </a>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className={`${styles.navGroup} ${openGroup === link.label ? styles.navGroupOpen : ''}`}
              >
                <button
                  type="button"
                  className={`${styles.navLink} ${styles.navGroupTrigger}`}
                  aria-haspopup="true"
                  aria-expanded={openGroup === link.label}
                  onClick={() => setOpenGroup(openGroup === link.label ? null : link.label)}
                >
                  {link.label}
                  <ChevronDown size={14} aria-hidden="true" />
                </button>
                <div className={styles.dropdown}>
                  {link.children.map((child) => (
                    <a key={child.href} href={child.href} className={styles.dropdownLink}>
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a key={link.label} href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={toggleMenuLabel}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className={styles.mobileNavGroup}>
                <p className={styles.mobileNavGroupLabel}>{link.label}</p>
                {link.children.map((child) => (
                  <a
                    key={child.href}
                    href={child.href}
                    className={`${styles.mobileNavLink} ${styles.mobileNavSubLink}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={styles.mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            )
          )}
        </div>
      )}
    </nav>
  );
}
