# a-player — Agent Briefing

## Purpose
`a-player` is a React SPA demo for loading, playing, and visualising audio files. It is under active development. The current build is a working foundation: file loading via drag-and-drop is complete; audio playback and visualisation are the next planned phases.

---

## Tech Stack

| Tool | Version | Role |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 6 | Type safety |
| Vite | 8 | Dev server + bundler |
| Tailwind CSS | 4 (Vite plugin) | Styling |
| React Router | 7 | Client-side routing |
| Vitest | 4 | Test runner |
| React Testing Library | 16 | Component tests |
| pnpm | 10 | Package manager — **always use pnpm, never npm or yarn** |

---

## Project Structure

```
src/
  routes/         # Page-level components, one file per route
    Home.tsx      # Landing page with AudioDropZone
  components/     # Reusable UI components
    AudioDropZone.tsx
    AudioDropZone.test.tsx
  hooks/          # Custom React hooks (logic only, no JSX)
    useAudioDrop.ts
  test/
    setup.ts      # Vitest + jest-dom setup
  App.tsx         # Router root
  main.tsx        # React entry point
  index.css       # Tailwind import (@import "tailwindcss")
```

---

## Dev Commands

```bash
pnpm dev          # Start dev server at http://localhost:5173 (HMR enabled)
pnpm test         # Vitest in watch mode
pnpm test:run     # Vitest single run
pnpm build        # TypeScript check + Vite production build
pnpm lint         # ESLint
pnpm coverage     # Coverage report
```

---

## Current Feature State

### ✅ Done
- **Project scaffold** — Vite + React 19 + TypeScript 6
- **Routing** — React Router v7 with `BrowserRouter` wrapping the app
- **Styling** — Tailwind CSS v4 via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed)
- **Audio file loading** — Drag-and-drop + click-to-browse on the Home page
  - Accepts `.wav` and `.mp3` only (validated by MIME type and extension)
  - Single-file enforcement
  - Four visual states: idle, drag-active, accepted, rejected
  - Fully keyboard-accessible

### 🔜 Planned (not started)
- **Audio playback** — Play/pause/seek using `<audio>` element + Web Audio API
- **Metadata display** — Extract and display song duration, title (from ID3 tags)
- **Waveform visualisation** — Canvas-based waveform rendered from `AudioBuffer`
- **Frequency visualisation** — Real-time FFT spectrum via `AnalyserNode`
- **Custom decoders** — Support for non-standard audio formats
- **Encoding/save-as** — Export to WAV, MP3, or other formats
- **Additional routes** — e.g. a settings page, a history/recent files page

---

## Audio Architecture & Strategy

### Rationale
The project will evolve through three phases: metadata display → visualization → custom decoders & encoding. The architecture must support this progression without major refactors.

### Phase 1 (Immediate): Metadata Display
**Stack**: `<audio>` element + `music-metadata` library

**Why this approach:**
- Simple, dependency-minimal, accessible
- Leverages browser's native codec support (MP3, WAV)
- `music-metadata` (50 KB) extracts ID3/Vorbis tags and duration reliably
- No performance overhead for current use case

**Implementation**:
```typescript
// Hook: useAudioMetadata.ts
import * as mm from 'music-metadata';

const metadata = await mm.parseBlob(audioFile);
const duration = metadata.format.duration; // seconds
const title = metadata.common.title || filename;
```

### Phase 2 (Near-term): Visualization
**Add**: Web Audio API + Canvas component

**Why**:
- `AudioContext.decodeAudioData()` gives direct access to PCM samples
- Enables waveform rendering to canvas
- Keeps `<audio>` for simple playback (optimal performance)
- Zero risk of breaking Phase 1

**Note**: Files decoded twice (once by browser, once by Web Audio), but acceptable at this scale.

### Phase 3 (Future): Custom Decoders & Encoding
**Two paths based on complexity**:

**Path A — Pure JS Decoders** (if custom codec is JavaScript-based):
- Migrate entirely to Web Audio API
- Implement custom decoders as PCM pipelines
- Feed PCM to encoders (e.g., Opus, WAV libraries)
- **Drop**: `<audio>` element

**Path B — Complex Formats** (if supporting wide codec range):
- Introduce FFmpeg.wasm (35 MB, only when needed)
- Use FFmpeg for decoding → PCM
- Keep `<audio>` for standard formats
- Use FFmpeg or JS encoder for export

### Decision Matrix

| Feature | Phase 1 | Phase 2 | Phase 3 |
|---------|---------|---------|---------|
| **Playback** | `<audio>` | `<audio>` | Web Audio API or FFmpeg |
| **Metadata** | `music-metadata` | ✓ (reuse) | ✓ (reuse) |
| **Visualization** | ✗ | Canvas + `AnalyserNode` | ✓ (enhance) |
| **Custom decoders** | ✗ | ✗ | Web Audio or FFmpeg |
| **Encoding** | ✗ | ✗ | JS encoder or FFmpeg |

### Bundle Impact
- **Phase 1**: +50 KB (`music-metadata`)
- **Phase 2**: +0 KB (Web Audio API is browser built-in)
- **Phase 3A**: +~100 KB (JS encoder libs)
- **Phase 3B**: +35 MB (FFmpeg.wasm, lazy-loaded)

---

### Hook + Component Split
Logic lives in `src/hooks/`, UI in `src/components/`. Hooks export plain data and event props; components are purely presentational. See `.github/skills/component-patterns/SKILL.md`.

### Multi-State Components
Interactive components expose distinct visual states via conditional Tailwind classes (idle / active / accepted / rejected / error). States are driven by the hook, not internal component state.

### Tailwind Theme
- Dark background: `bg-gray-950`
- Accent colour: violet (`violet-400`, `violet-500`)
- Success: green (`green-400`, `green-500`)
- Error: red (`red-400`, `red-500`)
- Text hierarchy: `text-white` → `text-gray-200` → `text-gray-400` → `text-gray-500`

### Testing
- Every component in `src/components/` should have a co-located `.test.tsx`
- Use `@testing-library/user-event` for interactions; `fireEvent` only when `userEvent` can't bypass browser restrictions (e.g. `accept` attribute filtering on file inputs)
- No snapshot tests

---

## Key Files to Know

| File | What it does |
|---|---|
| `vite.config.ts` | Vite + Tailwind plugin + Vitest config (single source of truth) |
| `src/hooks/useAudioDrop.ts` | All drag-and-drop + file validation logic |
| `src/components/AudioDropZone.tsx` | Drop zone UI component |
| `src/routes/Home.tsx` | Landing page, composes drop zone |
| `src/test/setup.ts` | Imports `@testing-library/jest-dom` matchers |

---

## Adding a New Feature — Checklist

1. If the feature has significant logic, create a hook in `src/hooks/`
2. Create the component in `src/components/` with a co-located `.test.tsx`
3. Add a route in `src/routes/` and register it in `App.tsx` if it's a new page
4. Style with Tailwind — follow the dark theme palette above
5. Run `pnpm test:run && pnpm build` before considering the task done
