import { useState, useCallback, useRef } from 'react'

export interface UseAudioPlayerResult {
  isPlaying: boolean
  currentTime: number
  duration: number
  togglePlayPause: () => void
  seek: (time: number) => void
  setDuration: (duration: number) => void
  reset: () => void
  audioRef: React.RefObject<HTMLAudioElement | null>
  setupAudioListeners: () => (() => void) | undefined
}

export function useAudioPlayer(): UseAudioPlayerResult {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      // Ensure audio is loaded before playing
      if (audioRef.current.readyState === 0) {
        audioRef.current.load()
      }
      
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

  const setDuration_ = useCallback((dur: number) => {
    setDuration(dur)
  }, [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [])

  const setupAudioListeners = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      if (isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  return {
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    seek,
    setDuration: setDuration_,
    reset,
    audioRef,
    setupAudioListeners,
  }
}

