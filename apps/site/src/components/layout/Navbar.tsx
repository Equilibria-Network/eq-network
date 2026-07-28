// src/components/layout/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

interface NavbarProps {
  currentPath?: string;
}

export default function Navbar({ currentPath = '/' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explainer', label: 'Thesis' },
    { href: '/roadmap', label: 'Roadmap' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' }
  ];

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
            alt="Equilibria Network"
            className={styles.logoImage}
          />
        </a>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          {navLinks.map(link => (
            <a 
              key={link.href}
              href={link.href} 
              className={styles.navLink}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(link => (
            <a 
              key={link.href}
              href={link.href} 
              className={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
