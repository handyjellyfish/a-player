import { useCallback, useRef, useState } from 'react'

const ACCEPTED_MIME_TYPES = new Set(['audio/wav', 'audio/wave', 'audio/mpeg', 'audio/mp3'])
const ACCEPTED_EXTENSIONS = new Set(['.wav', '.mp3'])

function isAudioFile(file: File): boolean {
  if (ACCEPTED_MIME_TYPES.has(file.type)) return true
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  return ACCEPTED_EXTENSIONS.has(ext)
}

export interface UseAudioDropResult {
  rootProps: React.HTMLAttributes<HTMLDivElement>
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
  inputRef: React.RefObject<HTMLInputElement | null>
  isDragActive: boolean
  file: File | null
  error: string | null
  clearFile: () => void
}

export function useAudioDrop(onFileAccepted?: (file: File) => void): UseAudioDropResult {
  const [isDragActive, setIsDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragCounterRef = useRef(0)

  const acceptFile = useCallback(
    (f: File) => {
      setFile(f)
      setError(null)
      onFileAccepted?.(f)
    },
    [onFileAccepted],
  )

  const rejectFile = useCallback((reason: string) => {
    setError(reason)
  }, [])

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return
      if (files.length > 1) {
        rejectFile('Please drop a single file.')
        return
      }
      const f = files[0]
      if (!isAudioFile(f)) {
        rejectFile('Only WAV and MP3 files are accepted.')
        return
      }
      acceptFile(f)
    },
    [acceptFile, rejectFile],
  )

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current += 1
    if (dragCounterRef.current === 1) setIsDragActive(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current -= 1
    if (dragCounterRef.current === 0) setIsDragActive(false)
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounterRef.current = 0
      setIsDragActive(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const onClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      inputRef.current?.click()
    }
  }, [])

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
      // reset so the same file can be re-selected
      e.target.value = ''
    },
    [handleFiles],
  )

  const clearFile = useCallback(() => {
    setFile(null)
    setError(null)
  }, [])

  return {
    rootProps: { onDragEnter, onDragLeave, onDragOver, onDrop, onClick, onKeyDown },
    inputProps: {
      type: 'file',
      accept: '.wav,.mp3,audio/wav,audio/mpeg',
      onChange: onInputChange,
      tabIndex: -1,
      style: { display: 'none' },
      'aria-hidden': true,
    },
    inputRef,
    isDragActive,
    file,
    error,
    clearFile,
  }
}
