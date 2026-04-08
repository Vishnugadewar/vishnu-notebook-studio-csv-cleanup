'use client'

import { useEffect, useCallback } from 'react'
import { useNotebookStore } from '@/lib/store'

interface UseKeyboardShortcutsOptions {
  onSave?: () => void
  onRunCell?: () => void
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions = {}) {
  const { setCommandPaletteOpen } = useNotebookStore()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + P - Command palette
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault()
        setCommandPaletteOpen(true)
        return
      }

      // Ctrl/Cmd + P - Also command palette (VS Code style)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p' && !e.shiftKey) {
        e.preventDefault()
        setCommandPaletteOpen(true)
        return
      }

      // Ctrl/Cmd + S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (options.onSave) {
          options.onSave()
        }
        return
      }
    },
    [setCommandPaletteOpen, options]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
