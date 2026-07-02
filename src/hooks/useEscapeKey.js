import { useEffect } from 'react'

export const useEscapeKey = (isActive, onEscape) => {
  useEffect(() => {
    if (!isActive) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onEscape()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isActive, onEscape])
}
