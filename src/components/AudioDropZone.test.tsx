import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import AudioDropZone from './AudioDropZone'

describe('AudioDropZone', () => {
  it('renders the drop zone', () => {
    render(<AudioDropZone />)
    expect(screen.getByRole('button', { name: /audio file drop zone/i })).toBeInTheDocument()
    expect(screen.getByText(/drag & drop/i)).toBeInTheDocument()
  })

  it('shows accepted filename after valid file is selected via input', async () => {
    const onFileAccepted = vi.fn()
    render(<AudioDropZone onFileAccepted={onFileAccepted} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['audio content'], 'track.mp3', { type: 'audio/mpeg' })
    await userEvent.upload(input, file)

    expect(await screen.findByText('track.mp3')).toBeInTheDocument()
    expect(onFileAccepted).toHaveBeenCalledWith(file)
  })

  it('shows an error for an invalid file type', () => {
    render(<AudioDropZone />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['data'], 'document.pdf', { type: 'application/pdf' })
    // Use fireEvent directly so the hook's own validation runs (userEvent respects accept attr)
    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByRole('alert')).toHaveTextContent(/only wav and mp3/i)
  })

  it('clears the file when the remove button is clicked', async () => {
    render(<AudioDropZone />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['audio'], 'song.wav', { type: 'audio/wav' })
    await userEvent.upload(input, file)

    expect(await screen.findByText('song.wav')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /remove file/i }))
    expect(screen.queryByText('song.wav')).not.toBeInTheDocument()
  })
})
