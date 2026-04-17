import { useEffect, useState, useRef } from 'react'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import { useAudioMetadata } from '../hooks/useAudioMetadata'

interface AudioPlayerProps {
  file: File
  onClose: () => void
  onFileReplaced?: (file: File) => void
  error?: string | null
}

const ACCEPTED_MIME_TYPES = new Set(['audio/wav', 'audio/wave', 'audio/mpeg', 'audio/mp3'])
const ACCEPTED_EXTENSIONS = new Set(['.wav', '.mp3'])

function isAudioFile(file: File): boolean {
  if (ACCEPTED_MIME_TYPES.has(file.type)) return true
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  return ACCEPTED_EXTENSIONS.has(ext)
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ file, onClose, onFileReplaced, error }: AudioPlayerProps) {
  const { isPlaying, currentTime, duration, togglePlayPause, audioRef, setupAudioListeners, reset } = useAudioPlayer()
  const { metadata, extractMetadata } = useAudioMetadata()
  const [isDragActive, setIsDragActive] = useState(false)
  const dragCounterRef = useRef(0)

  useEffect(() => {
    extractMetadata(file)
  }, [file, extractMetadata])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Reset player state when file changes
    reset()
    
    // Reset audio playback position
    audio.currentTime = 0
    
    const cleanup = setupAudioListeners()
    return () => {
      audio.pause()
      cleanup?.()
    }
  }, [file, setupAudioListeners, reset])

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current += 1
    if (dragCounterRef.current === 1) setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current -= 1
    if (dragCounterRef.current === 0) setIsDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current = 0
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return
    if (files.length > 1) return

    const droppedFile = files[0]
    if (isAudioFile(droppedFile)) {
      onFileReplaced?.(droppedFile)
    }
  }

  const fileUrlRef = useRef<string | null>(null)

  useEffect(() => {
    // Create blob URL for the file
    const newUrl = URL.createObjectURL(file)
    
    // Revoke old URL if it exists
    if (fileUrlRef.current) {
      URL.revokeObjectURL(fileUrlRef.current)
    }
    
    fileUrlRef.current = newUrl
    
    // Update audio element src
    if (audioRef.current) {
      audioRef.current.src = newUrl
    }

    // Cleanup: revoke URL when component unmounts
    return () => {
      if (fileUrlRef.current) {
        URL.revokeObjectURL(fileUrlRef.current)
      }
    }
  }, [file])

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={[
        'flex w-full max-w-lg flex-col gap-8 rounded-2xl px-8 py-6 transition-colors duration-200',
        isDragActive ? 'bg-violet-950/40' : 'bg-gray-900/50',
      ].join(' ')}
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} />

      {/* Song Info Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-white">{metadata?.title || file.name}</h2>
          <p className="mt-1 text-sm text-gray-400">{metadata ? formatTime(metadata.duration) : '--:--'}</p>
        </div>
        <button
          type="button"
          aria-label="Close player"
          onClick={onClose}
          className="shrink-0 rounded-full p-2 text-gray-400 transition hover:bg-gray-800 hover:text-gray-200"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Play Button */}
      <div className="flex justify-center">
        <button
          type="button"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={togglePlayPause}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-violet-500 text-violet-400 transition hover:bg-violet-500/10"
        >
          {isPlaying ? (
            /* Pause icon */
            <svg
              className="h-7 w-7"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            /* Play icon */
            <svg
              className="h-7 w-7"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Scrubber / Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="relative h-1 w-full rounded-full bg-gray-800">
          {/* Filled track */}
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-violet-500 transition-all"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
        {/* Time display */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{metadata ? formatTime(metadata.duration) : '--:--'}</span>
        </div>
      </div>

      {/* Error message (if any) */}
      {error && (
        <div className="rounded-lg bg-red-950/40 px-4 py-3">
          <p role="alert" className="text-sm font-medium text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* Drag-to-replace hint */}
      {isDragActive && (
        <div className="rounded-lg bg-violet-950/40 px-4 py-3">
          <p className="text-center text-sm font-medium text-violet-300">Drop to replace track</p>
        </div>
      )}
    </div>
  )
}
