import { useState } from 'react'
import AudioDropZone from '../components/AudioDropZone'
import AudioPlayer from '../components/AudioPlayer'

export default function Home() {
  const [loadedFile, setLoadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

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
      {loadedFile ? (
        <AudioPlayer file={loadedFile} onClose={handleClosePlayer} onFileReplaced={handleFileReplaced} error={error} />
      ) : (
        <AudioDropZone onFileAccepted={handleFileAccepted} />
      )}
    </main>
  )
}
