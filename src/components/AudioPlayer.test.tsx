import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import AudioPlayer from './AudioPlayer'

describe('AudioPlayer', () => {
  const mockFile = new File(['audio data'], 'song.mp3', { type: 'audio/mpeg' })

  it('renders filename and file size', () => {
    const onClose = vi.fn()
    render(<AudioPlayer file={mockFile} onClose={onClose} />)

    expect(screen.getByText('song.mp3')).toBeInTheDocument()
    expect(screen.getByText(/10 B/)).toBeInTheDocument()
  })

  it('renders play button initially', () => {
    const onClose = vi.fn()
    const { container } = render(<AudioPlayer file={mockFile} onClose={onClose} />)

    const buttons = container.querySelectorAll('[aria-label="Play"]')
    expect(buttons.length).toBeGreaterThan(0)
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

  it('toggles back to play when pause is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { container } = render(<AudioPlayer file={mockFile} onClose={onClose} />)

    const playButtons = container.querySelectorAll('[aria-label="Play"]')
    const playButton = playButtons[playButtons.length - 1]
    await user.click(playButton)

    const pauseButtons = container.querySelectorAll('[aria-label="Pause"]')
    const pauseButton = pauseButtons[pauseButtons.length - 1]
    await user.click(pauseButton)

    const newPlayButtons = container.querySelectorAll('[aria-label="Play"]')
    expect(newPlayButtons.length).toBeGreaterThan(0)
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<AudioPlayer file={mockFile} onClose={onClose} />)

    const closeButton = screen.getByRole('button', { name: /close player/i })
    await user.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders scrubber section with time display', () => {
    const onClose = vi.fn()
    render(<AudioPlayer file={mockFile} onClose={onClose} />)

    expect(screen.getByText('0:00')).toBeInTheDocument()
    expect(screen.getByText('--:--')).toBeInTheDocument()
  })

  it('displays large files correctly', () => {
    const largeFile = new File(['x'.repeat(2 * 1024 * 1024)], 'large-song.mp3', {
      type: 'audio/mpeg',
    })
    const onClose = vi.fn()
    render(<AudioPlayer file={largeFile} onClose={onClose} />)

    expect(screen.getByText(/2\.0 MB/)).toBeInTheDocument()
  })

  it('displays error message when provided', () => {
    const onClose = vi.fn()
    const errorMessage = 'Invalid file format'
    render(<AudioPlayer file={mockFile} onClose={onClose} error={errorMessage} />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
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

  it('ignores non-audio files on drop', async () => {
    const onClose = vi.fn()
    const onFileReplaced = vi.fn()
    const { container } = render(<AudioPlayer file={mockFile} onClose={onClose} onFileReplaced={onFileReplaced} />)

    const invalidFile = new File(['text content'], 'document.txt', { type: 'text/plain' })
    const dropZone = container.firstChild as HTMLElement

    const dropEvent = new MouseEvent('drop', {
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        files: [invalidFile],
      },
    })

    dropZone.dispatchEvent(dropEvent)

    expect(onFileReplaced).not.toHaveBeenCalled()
  })
})


