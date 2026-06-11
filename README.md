# EGCSite

[![Astro](https://img.shields.io/badge/Astro-5-FF5D01?logo=astro&logoColor=white)](https://astro.build) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com) [![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org) [![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-deployed-222222?logo=github&logoColor=white)](https://pages.github.com)

Marketing and documentation website for [EGC — Extended Global Context](https://github.com/Fmarzochi/EGC).

**Live site:** https://fmarzochi.github.io/EGCSite

## Stack

- [Astro 5](https://astro.build) — static site generator
- [Tailwind CSS 3](https://tailwindcss.com) — utility-first styling with a custom EGC green palette
- TypeScript (strict)
- GitHub Pages — deployment via GitHub Actions on every push to `main`

## Local development

**Requirements:** Node.js 18+

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:4321`.

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint `.astro` and `.ts` files |
| `npm run format` | Format with Prettier |

## Project structure

```
src/
├── components/       # Navbar, Footer, Icon
├── layouts/          # Base.astro, DocsLayout.astro
├── pages/
│   ├── index.astro
│   ├── features.astro
│   ├── get-started.astro
│   └── docs/         # architecture, cli, faq, guardian, memory, mcp, security
├── styles/
│   └── global.css
└── utils/
    └── base.ts       # resolves base path for GitHub Pages

public/               # static assets (logo, og image, robots.txt)
```

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`), which builds the site and deploys the `dist/` folder to GitHub Pages automatically.

## Contributing

This repo follows the same conventions as the main EGC repo. Keep the version badge in `src/pages/index.astro` in sync with npm releases.

## License

MIT — see [LICENSE](https://github.com/Fmarzochi/EGC/blob/main/LICENSE) in the main EGC repo.
