// docusaurus.config.js
const config = {
  title: 'Equilibria Network',
  tagline: 'Better decision-making through computational coordination and collective intelligence.',
  url: 'https://eq-network.org/', 
  baseUrl: '/',
  //url: 'https://equilibria-network.github.io', // temp until DNS for domain gets updated
  //baseUrl: '/eq-network/', // temp until DNS for domain gets updated
  favicon: 'img/favicon.ico',
organizationName: 'Equilibria-Network',
projectName: 'eq-network',
deploymentBranch: 'gh-pages',
trailingSlash: false,

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        theme: {
          customCss: './src/css/custom.css',
        },

        blog: {
          showReadingTime: true,
          path: 'blog',
          routeBasePath: 'blog',
          blogTitle: 'Blog',
          blogDescription: 'Equilibria Network Blog',
          postsPerPage: 10,
        }
      }),
    ],
  ],




  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        //title: 'Equilibria',
  logo: {
    alt: 'Equilibria Network Logo',
    src: 'img/logo_text.svg',
    srcDark: 'img/logo_text.svg',
  },
        items: [
          //{to: '/blog', label: 'Blog', position: 'right'},
          //{to: '/about', label: 'About', position: 'right'},
          //{to: '/contact', label: 'Contact', position: 'right'},
        ],
      },
  socials: {
    //twitter: 'your-twitter-handle',  // if you have one
    github: 'Equilibria-Network',
  },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Content',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'About',
                to: '/about',
              },
              {
                label: 'Contact',
                to: '/contact',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Equilibria Network. All rights reserved.`,
      },
    }),

  // Math plugin configuration
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
};

module.exports = config;
