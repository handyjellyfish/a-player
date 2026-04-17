import { render, screen } from '@testing-library/react'
import AudioPlayer from './src/components/AudioPlayer'

const mockFile = new File(['audio data'], 'song.mp3', { type: 'audio/mpeg' })
const { container } = render(<AudioPlayer file={mockFile} onClose={() => {}} />)
console.log(container.textContent)
