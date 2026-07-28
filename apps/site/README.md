# Equilibria Network - Astro

Migrated from Docusaurus to Astro for better performance and simpler architecture.

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `PUBLIC_FORMSPREE_ENDPOINT`: Formspree contact form endpoint

## Project Structure

```
/
├── public/           # Static assets (images, patterns, etc.)
├── src/
│   ├── components/   # React components
│   │   ├── layout/   # Navbar, Footer
│   │   ├── home/     # Home page components
│   │   ├── about/    # About page components
│   │   └── roadmap/  # Roadmap page components
│   ├── content/      # TypeScript data files
│   ├── pages/        # Astro pages (routes)
│   ├── styles/       # Global CSS
│   └── utils/        # Helper functions
└── astro.config.mjs
```

## Tech Stack

- **Framework**: Astro 4.x
- **UI Library**: React (for interactive islands)
- **Styling**: CSS Modules + Global CSS
- **Package Manager**: pnpm
- **TypeScript**: Strict mode
