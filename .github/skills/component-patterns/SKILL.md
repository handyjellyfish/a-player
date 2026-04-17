---
name: component-patterns
description: How components and hooks are structured in a-player — the hook+component split, multi-state pattern, Tailwind conventions, and testing approach.
---

# Skill: Component Patterns

## Hook + Component Split

Logic and UI are always separated:

- **`src/hooks/`** — custom hooks containing all state, event handlers, and derived values. No JSX.
- **`src/components/`** — presentational components that consume hook output. Minimal internal state.
- **`src/routes/`** — page-level components that compose hooks and components together.

### Example

```
useAudioDrop (hook)        →   AudioDropZone (component)   →   Home (route)
handles drag events             renders the drop zone           composes the page
validates file types            4 visual states
manages file/error state        spreads rootProps/inputProps
```

**The hook returns "prop bags"** that spread directly onto elements:
```tsx
const { rootProps, inputProps, inputRef, isDragActive, file, error, clearFile } = useAudioDrop()

<div {...rootProps} role="button">
  <input ref={inputRef} {...inputProps} />
</div>
```

This keeps components thin and makes hooks independently testable.

---

## Multi-State Components

Complex components expose distinct visual states via conditional Tailwind classes. States are computed from hook output, not internal component state.

### Pattern

```tsx
className={[
  'base classes always applied',
  stateA
    ? 'stateA classes'
    : stateB
      ? 'stateB classes'
      : 'default classes',
].join(' ')}
```

### AudioDropZone States

| State | Condition | Border | Background |
|---|---|---|---|
| Idle | `!isDragActive && !file && !error` | `border-gray-600` | `bg-gray-900/50` |
| Drag active | `isDragActive` | `border-violet-400` | `bg-violet-950/40` |
| Accepted | `!!file` | `border-green-500` | `bg-green-950/20` |
| Rejected | `!!error` | `border-red-500` | `bg-red-950/20` |

**Important:** Use a fixed height on multi-state components to prevent layout shifts:
```tsx
className="flex h-56 flex-col items-center justify-center ..."
```

---

## Tailwind Conventions

### Dark Theme Palette

```
Background:   bg-gray-950
Surfaces:     bg-gray-900, bg-gray-800
Borders:      border-gray-600, border-gray-700
Text:         text-white → text-gray-200 → text-gray-400 → text-gray-500
Accent:       violet-400 / violet-500
Success:      green-400 / green-500
Error:        red-400 / red-500
```

### Class Organisation

Order classes as: layout → sizing → spacing → border → background → text → interactive → transition

```tsx
// Good
'flex h-56 w-full max-w-lg flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 text-center cursor-pointer transition-colors duration-200'

// Avoid mixing concerns randomly
'cursor-pointer border-2 flex text-center h-56 ...'
```

### Tailwind v4 Note

This project uses **Tailwind CSS v4** via the `@tailwindcss/vite` plugin. There is **no `tailwind.config.js`**. The only Tailwind config entry is in `src/index.css`:
```css
@import "tailwindcss";
```

---

## Testing Conventions

### Co-located Tests
Every component in `src/components/` has a `.test.tsx` file alongside it:
```
src/components/
  AudioDropZone.tsx
  AudioDropZone.test.tsx
```

### What to Test
- The component renders without crashing (smoke test)
- Each meaningful user interaction produces the correct visual outcome
- Error/edge cases (invalid input, empty state)

### What Not to Test
- Implementation details of the hook (those are tested via the component)
- Snapshot tests
- Tailwind class names

### Tool Preference
- Use `userEvent` for realistic interactions (click, type, upload)
- Use `fireEvent` only when `userEvent` can't bypass browser API restrictions (e.g. file `accept` attribute filtering)
- Always import `{ describe, it, expect, vi }` from `vitest` explicitly (globals are enabled but explicit imports aid readability)

### Vitest Config
Tests run in `jsdom` environment. The setup file (`src/test/setup.ts`) imports `@testing-library/jest-dom` to extend Vitest matchers with DOM assertions like `toBeInTheDocument()` and `toHaveTextContent()`.
