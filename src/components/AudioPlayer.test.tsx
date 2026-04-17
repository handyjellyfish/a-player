import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AudioPlayer from './AudioPlayer'

describe('AudioPlayer', () => {
  const mockFile = new File(['audio data'], 'song.mp3', { type: 'audio/mpeg' })

  beforeEach(() => {
    // Mock HTML audio methods
    HTMLAudioElement.prototype.play = vi.fn().mockResolvedValue(undefined)
    HTMLAudioElement.prototype.pause = vi.fn()
  })

  it('renders and displays song title from metadata', async () => {
    const onClose = vi.fn()
    render(<AudioPlayer file={mockFile} onClose={onClose} />)

    await waitFor(() => {
      expect(screen.getByText(/song/i)).toBeInTheDocument()
    })
  })

  it('renders play button initially', () => {
    const onClose = vi.fn()
    const { container } = render(<AudioPlayer file={mockFile} onClose={onClose} />)

    const playButtons = container.querySelectorAll('[aria-label="Play"]')
    expect(playButtons.length).toBeGreaterThan(0)
  })

  it('toggles play button to pause on click', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { container } = render(<AudioPlayer file={mockFile} onClose={onClose} />)

    const playButtons = container.querySelectorAll('[aria-label="Play"]')
    const playButton = playButtons[playButtons.length - 1]
    await user.click(playButton)

    const pauseButtons = container.querySelectorAll('[aria-label="Pause"]')
    expect(pauseButtons.length).toBeGreaterThan(0)
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<AudioPlayer file={mockFile} onClose={onClose} />)

    const closeButton = screen.getByRole('button', { name: /close player/i })
    await user.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders time display elements', () => {
    const onClose = vi.fn()
    render(<AudioPlayer file={mockFile} onClose={onClose} />)

    expect(screen.getByText(/0:00/)).toBeInTheDocument()
  })

  it('displays error message when provided', () => {
    const onClose = vi.fn()
    const errorMessage = 'Invalid file format'
    render(<AudioPlayer file={mockFile} onClose={onClose} error={errorMessage} />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('creates hidden audio element with file URL', () => {
    const onClose = vi.fn()
    const { container } = render(<AudioPlayer file={mockFile} onClose={onClose} />)

    const audioElement = container.querySelector('audio')
    expect(audioElement).toBeInTheDocument()
    expect(audioElement?.src).toMatch(/blob:/)
  })

  it('calls onFileReplaced with valid audio file on drop', async () => {
    const onClose = vi.fn()
    const onFileReplaced = vi.fn()
    const { container } = render(<AudioPlayer file={mockFile} onClose={onClose} onFileReplaced={onFileReplaced} />)

    const newFile = new File(['new audio'], 'new-song.wav', { type: 'audio/wav' })
    const dropZone = container.firstChild as HTMLElement

    const dropEvent = new MouseEvent('drop', {
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        files: [newFile],
      },
    })

    dropZone.dispatchEvent(dropEvent)

    expect(onFileReplaced).toHaveBeenCalledWith(newFile)
  })
})


