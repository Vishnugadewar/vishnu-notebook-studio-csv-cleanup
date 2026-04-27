'use client'

import { useCallback, useEffect } from 'react'
import { useNotebookStore } from '@/lib/store'
import { usePyodide } from '@/hooks/use-pyodide'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { AppHeader } from './layout/app-header'
import { AppSidebar } from './layout/app-sidebar'
import { NotebookView } from './notebook/notebook-view'
import { DataPanel } from './csv/data-panel'
import { CommandPalette } from './command-palette'
import { WelcomePanel } from './welcome-panel'
import { EDADashboard } from './dashboard/eda-dashboard'
import { JobBoard } from './job-board/job-board'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

export function NotebookStudio() {
  const theme = useNotebookStore((state) => state.theme)
  const activeNotebookId = useNotebookStore((state) => state.activeNotebookId)
  const notebooks = useNotebookStore((state) => state.notebooks)
  const viewMode = useNotebookStore((state) => state.viewMode)
  const { addCell } = useNotebookStore()
  const { isReady, isLoading } = usePyodide()

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Create initial notebook if none exist
  useEffect(() => {
    if (notebooks.length === 0) {
      // Don't auto-create, let user do it from welcome panel
    }
  }, [notebooks.length])

  const handleAddCode = useCallback(
    (code: string) => {
      if (activeNotebookId) {
        addCell(activeNotebookId)
        // We need to update the last cell with the code
        const notebook = notebooks.find((n) => n.id === activeNotebookId)
        if (notebook) {
          const { updateCell } = useNotebookStore.getState()
          const lastCell = notebook.cells[notebook.cells.length - 1]
          if (lastCell) {
            // Add to a new cell
            setTimeout(() => {
              const currentNotebook = useNotebookStore
                .getState()
                .notebooks.find((n) => n.id === activeNotebookId)
              const newCell = currentNotebook?.cells[currentNotebook.cells.length - 1]
              if (newCell) {
                updateCell(activeNotebookId, newCell.id, { content: code })
              }
            }, 50)
          }
        }
      }
    },
    [activeNotebookId, notebooks, addCell]
  )

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSave: () => {
      console.log('Save triggered')
    },
  })

  return (
    <div className="h-screen flex flex-col bg-background">
      <AppHeader pyodideReady={isReady} pyodideLoading={isLoading} />

      <div className="flex-1 flex overflow-hidden">
        <AppSidebar />

        {viewMode === 'eda-dashboard' ? (
          <EDADashboard />
        ) : viewMode === 'job-board' ? (
          <JobBoard />
        ) : (
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={70} minSize={40}>
              {activeNotebookId ? (
                <NotebookView notebookId={activeNotebookId} />
              ) : (
                <WelcomePanel />
              )}
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
              <DataPanel onAddCode={handleAddCode} />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>

      <CommandPalette />
    </div>
  )
}
