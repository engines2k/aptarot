# ApTarot - Digital Tarot Reference

A comprehensive digital tarot card reference application built with SvelteKit. ApTarot provides detailed information about all 78 cards in a traditional tarot deck, featuring beautiful card imagery, interactive carousel navigation, and extensive esoteric correspondences.

[View this code live!](https://aptarot.net)

## Features

- **Complete 78-Card Deck**: All Major Arcana, Minor Arcana, and Court Cards
- **Interactive Carousel**: Smooth, animated card browsing with GSAP animations
- **Detailed Card Information**: 
  - Card meanings and interpretations
  - Original titles and attributions
  - Astrological correspondences
  - Hebrew letter associations (Major Arcana)
  - Tree of Life pathworking (Major Arcana)
  - Elemental associations and soul correspondences (Minor Arcana)
  - Qabalistic world attributions
  - Notable personalities for Court Cards
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern Web Technologies**: Built with SvelteKit, TypeScript, and Tailwind CSS

## Getting Started

### Prerequisites
- Node.js (v22 or higher)
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/engines2k/tarot-app.git
cd tarot-app

# Install dependencies
pnpm install
# or
npm install
```

### Development

Start the development server:

```bash
pnpm dev
# or
npm run dev

# Open in browser with:
pnpm dev --open
```

### Building

Create a production build:

```bash
pnpm build
# or
npm run build
```

Preview the production build:

```bash
pnpm preview
# or
npm run preview
```

## Technology Stack

- **[SvelteKit](https://kit.svelte.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS](https://tailwindcss.com/)**
- **[GSAP](https://greensock.com/gsap/)**
- **[Vite](https://vitejs.dev/)**


## Deployment

### Static Site Generation
The app is configured for static deployment:

```bash
pnpm build
```

Deploy the `build/` directory to any static hosting service.

### AWS SAM (Serverless)
The project includes AWS SAM configuration and a build / deploy script for serverless deployment:

```bash
sam build
sam deploy --guided
```