# a-player

A modern React SPA for loading, playing, and visualizing audio files. Built with React 19, TypeScript, Vite, and Tailwind CSS.

## Features

### ✅ Current
- **Drag-and-drop file loading** — Intuitive file upload with visual feedback
- **File validation** — Accepts `.wav` and `.mp3` only (validated by MIME type and extension)
- **Keyboard accessible** — Full keyboard navigation and interaction support
- **Modern UI** — Dark theme with responsive design powered by Tailwind CSS
- **Production-ready scaffold** — Vite + TypeScript + ESLint + component testing

### 🔜 Planned
- **Audio playback** — Play/pause/seek controls using Web Audio API
- **Waveform visualization** — Canvas-based waveform rendering from `AudioBuffer`
- **Frequency visualization** — Real-time FFT spectrum via `AnalyserNode`
- **Additional routes** — Settings page, file history, playback controls

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 6 | Type safety |
| Vite | 8 | Dev server & bundler |
| Tailwind CSS | 4 (Vite plugin) | Styling |
| React Router | 7 | Client-side routing |
| Vitest | 4 | Unit testing |
| React Testing Library | 16 | Component testing |
| pnpm | 10 | Package manager |

## Getting Started

### Prerequisites
- **Node.js** 18+ (for React 19)
- **pnpm** 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/handyjellyfish/a-player.git
cd a-player

# Install dependencies (use pnpm only)
pnpm install

# Start dev server
pnpm dev
```

The app will be available at `http://localhost:5173` with hot module reloading enabled.

## Available Scripts

```bash
pnpm dev          # Start dev server with HMR
pnpm build        # TypeScript check + production build
pnpm preview      # Preview production build locally
pnpm lint         # Run ESLint
pnpm test         # Run Vitest in watch mode
pnpm test:run     # Run Vitest once
pnpm coverage     # Generate test coverage report
```

## Project Structure

```
src/
  routes/              # Page-level components
    Home.tsx           # Landing page with file upload
  components/          # Reusable UI components
    AudioDropZone.tsx
    AudioDropZone.test.tsx
  hooks/               # Custom React hooks (logic only)
    useAudioDrop.ts    # File upload and validation logic
  test/
    setup.ts           # Vitest + testing-library setup
  App.tsx              # Router configuration
  main.tsx             # React entry point
  index.css            # Tailwind CSS import
```

## Architecture

### Hook + Component Split
Business logic lives in `src/hooks/`, UI components in `src/components/`. Hooks export plain data and event handlers; components remain purely presentational.

### Multi-State Components
Interactive components expose distinct visual states (idle, drag-active, accepted, rejected, error) driven by conditional Tailwind CSS classes. State logic lives in the hook, not the component.

### Design System
- **Dark theme**: `bg-gray-950` background
- **Accent color**: Violet (`violet-400`, `violet-500`)
- **Status colors**: Green for success, red for errors
- **Text hierarchy**: `text-white` → `text-gray-200` → `text-gray-400` → `text-gray-500`

## Testing

Every component in `src/components/` includes a co-located `.test.tsx` file. Tests use:
- **React Testing Library** for component testing
- **@testing-library/user-event** for realistic user interactions
- **Vitest** as the test runner

Run tests with `pnpm test` (watch mode) or `pnpm test:run` (single run).

## Contributing

Contributions are welcome! When adding new features:

1. **Logic** → Create a hook in `src/hooks/`
2. **UI** → Create a component in `src/components/` with a co-located `.test.tsx`
3. **Routes** → Add to `src/routes/` and register in `App.tsx` for new pages
4. **Styling** → Use Tailwind CSS only (follow the dark theme palette)
5. **Quality** → Run `pnpm test:run && pnpm build` before submitting

## License

MIT License — see LICENSE file for details

---

**Package Manager**: This project uses `pnpm`. Do not use `npm install` or `yarn add`.
