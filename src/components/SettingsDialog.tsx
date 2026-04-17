import type { Settings } from '../hooks/useSettings'

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  settings: Settings
  onSettingsChange: (settings: Partial<Settings>) => void
}

export default function SettingsDialog({ isOpen, onClose, settings, onSettingsChange }: SettingsDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-gray-900 p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-800 hover:text-gray-200"
            aria-label="Close settings"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Autoplay Setting */}
          <div className="flex items-center justify-between">
            <label htmlFor="autoplay" className="text-sm text-gray-300">
              Autoplay
            </label>
            <button
              id="autoplay"
              type="button"
              onClick={() => onSettingsChange({ autoplay: !settings.autoplay })}
              className={[
                'relative h-6 w-11 rounded-full transition',
                settings.autoplay ? 'bg-violet-500' : 'bg-gray-700',
              ].join(' ')}
              aria-label={`Autoplay ${settings.autoplay ? 'on' : 'off'}`}
            >
              <div
                className={[
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white transition',
                  settings.autoplay ? 'translate-x-5' : 'translate-x-0.5',
                ].join(' ')}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
