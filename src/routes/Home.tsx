import AudioDropZone from '../components/AudioDropZone'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-gray-950 px-4 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">a-player</h1>
        <p className="mt-3 text-lg text-gray-400">Load an audio file to get started</p>
      </div>
      <AudioDropZone onFileAccepted={(file) => console.log('Accepted:', file.name)} />
    </main>
  )
}
