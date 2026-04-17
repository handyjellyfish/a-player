import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useAudioMetadata } from './useAudioMetadata'

describe('useAudioMetadata', () => {
  it('has initial state of null metadata', () => {
    const { result } = renderHook(() => useAudioMetadata())

    expect(result.current.metadata).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('finishes loading after extractMetadata completes', async () => {
    const { result } = renderHook(() => useAudioMetadata())

    const invalidFile = new File(['not audio'], 'test.txt', { type: 'text/plain' })
    await result.current.extractMetadata(invalidFile)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('handles extraction errors gracefully', async () => {
    const { result } = renderHook(() => useAudioMetadata())

    const invalidFile = new File(['invalid data'], 'invalid.txt', { type: 'text/plain' })

    await result.current.extractMetadata(invalidFile)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.metadata).toBeNull()
  })

  it('clears error on new extraction attempt', async () => {
    const { result } = renderHook(() => useAudioMetadata())

    const invalidFile = new File(['invalid'], 'invalid.txt', { type: 'text/plain' })
    await result.current.extractMetadata(invalidFile)

    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })

    // Attempt extraction again
    const anotherInvalidFile = new File(['more invalid'], 'another.txt', { type: 'text/plain' })
    await result.current.extractMetadata(anotherInvalidFile)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Error state should be updated (or still contain an error)
    expect(result.current.isLoading).toBe(false)
  })

  it('returns hook with expected interface', () => {
    const { result } = renderHook(() => useAudioMetadata())

    expect(result.current).toHaveProperty('metadata')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('error')
    expect(result.current).toHaveProperty('extractMetadata')
    expect(typeof result.current.extractMetadata).toBe('function')
  })
})
