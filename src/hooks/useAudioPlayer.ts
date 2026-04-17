import { useState, useCallback } from 'react'

export interface UseAudioPlayerResult {
  isPlaying: boolean
  togglePlayPause: () => void
}

export function useAudioPlayer(): UseAudioPlayerResult {
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  return {
    isPlaying,
    togglePlayPause,
  }
}
