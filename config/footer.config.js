// config/footer.config.js
// Footer configuration

const footerConfig = {
  style: 'dark',
  
  links: [
    {
      title: 'Research',
      items: [
        // {
        //   label: 'Publications',
        //   to: '/research',
        // },
        // {
        //   label: 'Working Papers',
        //   to: '/research/working-papers',
        // },
      ],
    },
    {
      title: 'Community',
      items: [
        // {
        //   label: 'Blog',
        //   to: '/blog',
        // },
        // {
        //   label: 'Discord',
        //   href: 'https://discord.gg/equilibria',
        // },
        // {
        //   label: 'Twitter',
        //   href: 'https://twitter.com/equilibria_net',
        // },
      ],
    },
    {
      title: 'More',
      items: [
        {
          label: 'About',
          to: '/about',
        },
        {
          label: 'GitHub',
          href: 'https://github.com/Equilibria-Network',
        },
        // {
        //   label: 'Contact',
        //   to: '/contact',
        // },
      ],
    },
  ],
  
  copyright: `Copyright © ${new Date().getFullYear()} Equilibria Network. Built with Docusaurus.`,
  
  // Footer logo (optional)
  logo: {
    alt: 'Equilibria Network Logo',
    src: 'img/logo_icon_text_2.svg',
    srcDark: 'img/logo_text.svg',
    href: '/',
    width: 160,
    height: 51,
  },
};

module.exports = footerConfig;
