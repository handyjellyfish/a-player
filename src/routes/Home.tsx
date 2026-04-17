import { useState } from 'react'
import AudioDropZone from '../components/AudioDropZone'
import AudioPlayer from '../components/AudioPlayer'
import SettingsDialog from '../components/SettingsDialog'
import { useSettings } from '../hooks/useSettings'

export default function Home() {
  const [loadedFile, setLoadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { settings, updateSettings, isLoaded } = useSettings()

  const handleFileAccepted = (file: File) => {
    setLoadedFile(file)
    setError(null)
  }

  const handleFileReplaced = (file: File) => {
    setLoadedFile(file)
    setError(null)
  }

  const handleClosePlayer = () => {
    setLoadedFile(null)
    setError(null)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-gray-950 px-4 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">a-player</h1>
        {!loadedFile && (
          <p className="mt-3 text-lg text-gray-400">Load an audio file to get started</p>
        )}
      </div>
      
      {/* Player Container with Settings Button */}
      <div className="relative w-full max-w-md">
        {/* Settings Button - positioned top-right within player area */}
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="absolute -right-16 top-0 rounded-full p-3 text-gray-400 transition hover:bg-gray-800 hover:text-gray-200"
          aria-label="Open settings"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {loadedFile && isLoaded ? (
          <AudioPlayer
            file={loadedFile}
            onClose={handleClosePlayer}
            onFileReplaced={handleFileReplaced}
            error={error}
            autoplay={settings.autoplay}
          />
        ) : (
          <AudioDropZone onFileAccepted={handleFileAccepted} />
        )}
      </div>

      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={settings} onSettingsChange={updateSettings} />
    </main>
  )
}
