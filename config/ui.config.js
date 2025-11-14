// config/ui.config.js
// UI and visual configuration

const uiConfig = {
  // Meta images and social cards
  image: 'img/docusaurus-social-card.jpg',
  
  // Color mode configuration (this should be at root level, not in navbar)
  colorMode: {
    defaultMode: 'light',
    disableSwitch: false,
    respectPrefersColorScheme: false,
  },
  
  // Prism theme for code blocks
  prism: {
    theme: require('prism-react-renderer').themes.github,
    darkTheme: require('prism-react-renderer').themes.dracula,
    additionalLanguages: ['python', 'javascript', 'typescript', 'json', 'bash'],
  },
  
  // Table of contents configuration
  tableOfContents: {
    minHeadingLevel: 2,
    maxHeadingLevel: 3,
  },
  
  // Announcement bar (for important announcements)
  // announcementBar: {
  //   id: 'support_us',
  //   content: 'We are looking to revamp our docs, please fill <a target="_blank" rel="noopener noreferrer" href="#">this survey</a>',
  //   backgroundColor: '#fafbfc',
  //   textColor: '#091E42',
  //   isCloseable: false,
  // },
  
  // Live code blocks configuration
  liveCodeBlock: {
    playgroundPosition: 'bottom',
  },
  
  // Algolia search configuration (when ready)
  // algolia: {
  //   appId: 'YOUR_APP_ID',
  //   apiKey: 'YOUR_SEARCH_API_KEY',
  //   indexName: 'YOUR_INDEX_NAME',
  //   contextualSearch: true,
  //   searchParameters: {},
  //   searchPagePath: 'search',
  // },
};

module.exports = uiConfig;
