# Copilot Instructions — a-player

For full project context, read [`agents.md`](../agents.md) first.

## Non-Negotiable Rules

- **Package manager:** `pnpm` only — never `npm install` or `yarn add`
- **New dependencies:** discuss before adding; prefer custom hooks over new libraries for simple problems
- **Tests:** every new component in `src/components/` must have a co-located `.test.tsx`
- **TypeScript:** no `any`, no suppressed errors — fix the type properly
- **Styling:** Tailwind CSS only — no inline styles, no CSS modules, no new CSS files

## Quick Reference

```bash
pnpm dev          # Dev server + HMR at localhost:5173
pnpm test:run     # Run all tests once
pnpm build        # tsc + vite build (must pass before task is done)
```

## Patterns

- Logic → `src/hooks/`, UI → `src/components/`, Pages → `src/routes/`
- Dark theme: `bg-gray-950` background, `violet-400/500` accent
- Multi-state components use conditional Tailwind classes driven by the hook

## Skills

- Audio file handling → `.github/skills/audio-file-handling/SKILL.md`
- Component patterns → `.github/skills/component-patterns/SKILL.md`
