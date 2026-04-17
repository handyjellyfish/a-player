---
name: audio-file-handling
description: How audio file loading works in a-player — the useAudioDrop hook, accepted formats, validation logic, and testing patterns.
---

# Skill: Audio File Handling

## Overview

Audio file loading is handled entirely by a custom hook with no external library. The hook encapsulates all drag-and-drop events and file validation; the component is a pure consumer of its output.

**Files:**
- `src/hooks/useAudioDrop.ts` — all logic
- `src/components/AudioDropZone.tsx` — UI

---

## `useAudioDrop` Hook API

```ts
import { useAudioDrop } from '../hooks/useAudioDrop'

const {
  rootProps,    // Spread onto the drop zone <div> (drag events + click + keydown)
  inputProps,   // Spread onto the hidden <input type="file">
  inputRef,     // Attach as ref={inputRef} to the hidden <input>
  isDragActive, // true while a file is being dragged over the zone
  file,         // File | null — the accepted file
  error,        // string | null — validation error message
  clearFile,    // () => void — resets file and error
} = useAudioDrop(onFileAccepted?)
```

`onFileAccepted` is an optional callback `(file: File) => void` called when a valid file is dropped or selected.

---

## Accepted Formats

Validated by both MIME type and file extension (browsers are inconsistent with MIME types):

```ts
const ACCEPTED_MIME_TYPES = new Set(['audio/wav', 'audio/wave', 'audio/mpeg', 'audio/mp3'])
const ACCEPTED_EXTENSIONS = new Set(['.wav', '.mp3'])
```

### Adding a New Format (e.g. FLAC)

1. Add to both sets in `useAudioDrop.ts`:
   ```ts
   const ACCEPTED_MIME_TYPES = new Set([..., 'audio/flac', 'audio/x-flac'])
   const ACCEPTED_EXTENSIONS = new Set([..., '.flac'])
   ```
2. Update the `accept` attribute in `inputProps` and on `<AudioDropZone>`:
   ```ts
   accept: '.wav,.mp3,.flac,audio/wav,audio/mpeg,audio/flac'
   ```
3. Update the helper text in `AudioDropZone.tsx` ("WAV or MP3 · single file" → "WAV, MP3 or FLAC · single file")

---

## Drag Counter Pattern

Browser drag events fire `dragenter`/`dragleave` on child elements too, causing flicker. A ref counter prevents this:

```ts
const dragCounterRef = useRef(0)

onDragEnter: () => {
  dragCounterRef.current += 1
  if (dragCounterRef.current === 1) setIsDragActive(true)
}

onDragLeave: () => {
  dragCounterRef.current -= 1
  if (dragCounterRef.current === 0) setIsDragActive(false)
}

onDrop: () => {
  dragCounterRef.current = 0  // always reset on drop
  setIsDragActive(false)
}
```

---

## Testing File Drop Behaviour

### Valid file via click/browse
Use `userEvent.upload` — it triggers `onChange` and respects accepted MIME types:
```ts
const input = document.querySelector('input[type="file"]') as HTMLInputElement
const file = new File(['audio'], 'track.mp3', { type: 'audio/mpeg' })
await userEvent.upload(input, file)
expect(screen.getByText('track.mp3')).toBeInTheDocument()
```

### Invalid file type
`userEvent.upload` respects the `accept` attribute and silently drops non-matching files.
Use `fireEvent.change` directly to bypass this so the hook's own validation runs:
```ts
import { fireEvent } from '@testing-library/react'

const file = new File(['data'], 'doc.pdf', { type: 'application/pdf' })
fireEvent.change(input, { target: { files: [file] } })
expect(screen.getByRole('alert')).toHaveTextContent(/only wav and mp3/i)
```

### Drag events
Simulate with `fireEvent.dragEnter`, `fireEvent.dragOver`, `fireEvent.drop`:
```ts
const dropZone = screen.getByRole('button', { name: /audio file drop zone/i })
fireEvent.dragEnter(dropZone)
// isDragActive should now be true — check for visual state changes
```
