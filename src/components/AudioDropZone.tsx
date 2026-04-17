import { useAudioDrop } from '../hooks/useAudioDrop'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface AudioDropZoneProps {
  onFileAccepted?: (file: File) => void
}

export default function AudioDropZone({ onFileAccepted }: AudioDropZoneProps) {
  const { rootProps, inputProps, inputRef, isDragActive, file, error, clearFile } = useAudioDrop(onFileAccepted)

  return (
    <div
      {...rootProps}
      role="button"
      tabIndex={0}
      aria-label="Audio file drop zone. Accepts WAV and MP3 files."
      className={[
        'relative flex h-56 w-full max-w-lg flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 text-center',
        'cursor-pointer select-none outline-none transition-colors duration-200',
        'focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
        isDragActive
          ? 'border-violet-400 bg-violet-950/40'
          : file
            ? 'border-green-500 bg-green-950/20'
            : error
              ? 'border-red-500 bg-red-950/20'
              : 'border-gray-600 bg-gray-900/50 hover:border-gray-400 hover:bg-gray-900',
      ].join(' ')}
    >
      <input ref={inputRef} {...inputProps} />

      {/* Idle / drag-active state */}
      {!file && (
        <>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-800">
            {isDragActive ? (
              /* Arrow-down icon when dragging */
              <svg
                className="h-7 w-7 text-violet-400 animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-4-4m4 4l4-4" />
              </svg>
            ) : (
              /* Music note icon when idle */
              <svg
                className="h-7 w-7 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            )}
          </div>

          {isDragActive ? (
            <p className="text-lg font-medium text-violet-300">Drop your audio file here</p>
          ) : (
            <>
              <p className="text-base font-medium text-gray-200">
                Drag &amp; drop an audio file, or{' '}
                <span className="text-violet-400 underline underline-offset-2">browse</span>
              </p>
              <p className="mt-2 text-sm text-gray-500">WAV or MP3 · single file</p>
            </>
          )}

          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-red-400">
              {error}
            </p>
          )}
        </>
      )}

      {/* Accepted file state */}
      {file && (
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-900/60">
            <svg
              className="h-6 w-6 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-medium text-gray-100">{file.name}</p>
            <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
          </div>
          <button
            type="button"
            aria-label="Remove file"
            onClick={(e) => {
              e.stopPropagation()
              clearFile()
            }}
            className="shrink-0 rounded-full p-1.5 text-gray-500 transition hover:bg-gray-700 hover:text-gray-200"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
