import { useCallback, useState } from 'react'
import * as mm from 'music-metadata'

export interface AudioMetadata {
  title: string
  duration: number // seconds
}

export interface UseAudioMetadataResult {
  metadata: AudioMetadata | null
  isLoading: boolean
  error: string | null
  extractMetadata: (file: File) => Promise<void>
}

export function useAudioMetadata(): UseAudioMetadataResult {
  const [metadata, setMetadata] = useState<AudioMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const extractMetadata = useCallback(async (file: File) => {
    setIsLoading(true)
    setError(null)
    setMetadata(null)

    try {
      const parsed = await mm.parseBlob(file)

      const title = parsed.common?.title || file.name
      const duration = parsed.format?.duration || 0

      setMetadata({
        title,
        duration,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to extract metadata'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    metadata,
    isLoading,
    error,
    extractMetadata,
  }
}
