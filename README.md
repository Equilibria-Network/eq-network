# Equilibria Network Website

This repository contains the source code for the Equilibria Network website.

## Todo

- [ ] Home: Lorenz Attractor animation
- [ ] Home: Mission background transparency
- [ ] Blog: Implement Page
- [ ] Nav: Donate button
- [ ] Nav: Search button

## Project Structure

```
eq-network/
├── blog/                    # Blog posts directory (currently unused)
├── src/
│   ├── css/
│   │   └── custom.css      # Global CSS and Tailwind configuration
│   ├── components/
│   │   └── HomepageComponents/
│   │       ├── Hero.js     # Homepage hero section
│   │       ├── Mission.js  # Mission statement section
│   │       ├── WhatWeDo.js # What We Do section
│   │       ├── WhoWeAre.js # Who We Are section
│   │       └── *.module.css # Component-specific styles
│   ├── theme/
│   │   └── Footer/         # Custom footer components
│   │       ├── index.js    # Main footer component
│   │       ├── SocialBar.js # Social media links
│   │       └── ContactForm.js # Contact form component
│   └── pages/
│       └── index.js        # Homepage layout
├── static/
│   ├── img/               # Static images and logos
│   └── Logo Files/        # Logo assets
├── docusaurus.config.js   # Main configuration file
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json          # Project dependencies and scripts
```

## Key Files

### Configuration Files
- `docusaurus.config.js`: Main configuration file for Docusaurus. Edit this for:
  - Site metadata (title, tagline)
  - Navigation bar configuration
  - Deployment settings
  - Theme configuration
  - Social links

- `tailwind.config.js`: Tailwind CSS configuration. Edit this for:
  - Custom theme extensions
  - Plugin configurations
  - Content paths for Tailwind processing

### Style Files
- `src/css/custom.css`: Global styles and CSS variables including:
  - Theme colors
  - Dark/light mode configurations
  - Container styles
  - Global utility classes

### Component Files
All component files follow a consistent pattern with their respective CSS modules:
- Component file (e.g., `Hero.js`)
- CSS module file (e.g., `Hero.module.css`)

## Hosting and Deployment

### Current Hosting
The website is hosted on GitHub Pages at `eq-network.org`. The domain is managed through DNS settings on namecheap pointing to GitHub Pages.

### Deployment Process
1. Building the site:
   ```bash
   npm run build
   ```

2. Testing locally:
   ```bash
   npm run serve
   ```

3. Deploying:
   ```bash
   GIT_USER=<GITHUB_USERNAME> npm run deploy
   ```

The site is automatically deployed to the `gh-pages` branch when changes are pushed to the main branch.

### Development Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Equilibria-Network/eq-network.git
   cd eq-network
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start local development server:
   ```bash
   yarn start
   ```

## Adding Content

### Adding New Sections (Home example)
1. Create new component js + css in `src/components/Home/`
2. Export component in `src/components/Home/index.js`
3. Import and add to layout in `src/pages/index.js`
4. You can follow these same steps for any page e.g. `src/components/Blog/*`

### Adding Blog Posts
1. Create markdown folder in `blog/` directory
2. Create images folder in `postname/images` for blog specific images
3. First lines should always be frontmatter

## Common Customizations

### Updating Colors
1. Edit color variables in `src/css/custom.css`
2. Both light and dark mode colors are configured here

### Modifying Navbar
1. Edit `navbar` configuration in `docusaurus.config.js`

### Adding New Pages
1. Create new component in `src/pages/`
2. Add to navigation if needed in `docusaurus.config.js`
