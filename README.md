# Daily Gita Wisdom

A modern, highly optimized web application that provides daily verses from the Bhagavad Gita, complete with translations in Hindi and English, intelligent audio reading, and dynamic social sharing.

## Features

- **Daily Verses**: Start your day with a new shloka (verse) automatically selected each day.
- **High-Quality Dataset**: Powered by a meticulously curated dataset providing flawless transliterations and 1-to-1 strict translations in both Hindi and English.
- **Edge TTS Engine**: Features a bespoke, server-side Text-to-Speech integration using Microsoft Edge's Neural Voices. It combines Sanskrit, Hindi, and English into a seamless, sagely "Krishna-like" audio track. Features smart edge caching and offline/fallback resilience via the native Web Speech API.
- **Dynamic Social Cards**: Automatically generates beautiful, highly legible Open Graph (OG) image cards for each verse using `@vercel/og` and custom Devanagari fonts, making social media sharing look pristine.
- **Native Web Sharing**: Seamlessly integrates with the device's native Web Share API for sharing verses on mobile and desktop platforms.
- **Favorites & Search**: Save verses for later reflection, and use the smart search functionality to instantly find specific chapters, verses, or keywords.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) with React 19 (leveraging RPCs and SSR)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Audio Engine**: `msedge-tts` combined with TanStack Server Functions (`createServerFn`)
- **Dynamic OG**: `@vercel/og`
- **Build Tool**: [Vite](https://vitejs.dev/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd daily-gita-wisdom
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code issues.
- `npm run format`: Formats code using Prettier.
