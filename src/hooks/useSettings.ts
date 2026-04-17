import { useState, useCallback, useEffect } from 'react'

export interface Settings {
  autoplay: boolean
}

const STORAGE_KEY = 'a-player-settings'
const DEFAULT_SETTINGS: Settings = {
  autoplay: true,
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      }
    } catch (err) {
      console.error('Failed to load settings from localStorage:', err)
    }
    setIsLoaded(true)
  }, [])

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (err) {
        console.error('Failed to save settings to localStorage:', err)
      }
      return updated
    })
  }, [])

  return {
    settings,
    updateSettings,
    isLoaded,
  }
}
