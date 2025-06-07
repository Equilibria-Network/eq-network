// config/navbar.config.js
// Navigation bar configuration

const navbarConfig = {
  // title: 'Equilibria', // Commented out since we use logo
  logo: {
    alt: 'Equilibria Network Logo',
    src: 'img/logo_icon_text_2.svg',
    srcDark: 'img/logo_text.svg',
  },
  
  items: [
    { to: '/about', label: 'About', position: 'right' },
    // Future navigation items (commented for now)
    // { to: '/research', label: 'Research', position: 'right' },
    // { to: '/projects', label: 'Projects', position: 'right' },
    // { to: '/blog', label: 'Blog', position: 'right' },
    // { to: '/contact', label: 'Contact', position: 'right' },
  ],
  
  // Navbar behavior
  hideOnScroll: false,
  // Remove the style: 'primary' - this was causing white text on white background
  // style: 'primary',
  
  // Note: position and colorMode are not valid navbar properties in Docusaurus
  // colorMode should be at the root level of themeConfig
};

module.exports = navbarConfig;
