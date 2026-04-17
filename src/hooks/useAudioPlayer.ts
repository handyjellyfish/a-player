import { useState, useCallback, useRef } from 'react'

export interface UseAudioPlayerResult {
  isPlaying: boolean
  currentTime: number
  duration: number
  togglePlayPause: () => void
  seek: (time: number) => void
  setDuration: (duration: number) => void
  audioRef: React.RefObject<HTMLAudioElement | null>
}

export function useAudioPlayer(): UseAudioPlayerResult {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play?.().catch((err) => {
        console.error('Failed to play audio:', err)
      })
      setIsPlaying(true)
    }
  }, [isPlaying])

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, Math.min(time, duration))
  }, [duration])

  const setDuration_ = useCallback((duration: number) => {
    setDuration(duration)
  }, [])

  const currentTime = audioRef.current?.currentTime ?? 0

  return {
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    seek,
    setDuration: setDuration_,
    audioRef,
  }
}

