// config/navbar.config.js
// Navigation bar configuration

const navbarConfig = {
  // title: 'Equilibria', // Commented out since we use logo
  logo: {
    alt: 'Equilibria Network Logo',
    src: 'img/logo_icon_text_2.svg', // Single logo file for both themes
    // Removed srcDark - use same logo for both light and dark mode
  },
  
  items: [
    { to: '/about', label: 'About', position: 'right' },
    { to: '/research', label: 'Research', position: 'right' },
    { to: '/faq', label: 'FAQ', position: 'right' },
    // Future navigation items (commented for now)
    // { to: '/projects', label: 'Projects', position: 'right' },
    // { to: '/blog', label: 'Blog', position: 'right' },
    // { to: '/contact', label: 'Contact', position: 'right' },
  ],
  
  // Navbar behavior
  hideOnScroll: false,
  style: 'primary',
  
  // Note: position and colorMode are not valid navbar properties in Docusaurus
  // colorMode should be at the root level of themeConfig
};

module.exports = navbarConfig;
