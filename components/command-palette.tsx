'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  FileText,
  Plus,
  Play,
  Download,
  Sun,
  Moon,
  Trash2,
  PanelLeft,
  Table,
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useNotebookStore } from '@/lib/store'

interface CommandPaletteProps {
  onRunAll?: () => void
  onExport?: () => void
}

export function CommandPalette({ onRunAll, onExport }: CommandPaletteProps) {
  const open = useNotebookStore((state) => state.commandPaletteOpen)
  const theme = useNotebookStore((state) => state.theme)
  const notebooks = useNotebookStore((state) => state.notebooks)
  const activeNotebookId = useNotebookStore((state) => state.activeNotebookId)
  const datasets = useNotebookStore((state) => state.datasets)

  const {
    setCommandPaletteOpen,
    createNotebook,
    setActiveNotebook,
    deleteNotebook,
    toggleTheme,
    toggleSidebar,
    addCell,
    setActiveDataset,
  } = useNotebookStore()

  const handleSelect = useCallback(
    (action: string) => {
      setCommandPaletteOpen(false)

      switch (action) {
        case 'new-notebook':
          createNotebook()
          break
        case 'toggle-theme':
          toggleTheme()
          break
        case 'toggle-sidebar':
          toggleSidebar()
          break
        case 'add-cell':
          if (activeNotebookId) {
            addCell(activeNotebookId)
          }
          break
        case 'run-all':
          if (onRunAll) onRunAll()
          break
        case 'export':
          if (onExport) onExport()
          break
        default:
          if (action.startsWith('notebook:')) {
            setActiveNotebook(action.replace('notebook:', ''))
          } else if (action.startsWith('delete-notebook:')) {
            deleteNotebook(action.replace('delete-notebook:', ''))
          } else if (action.startsWith('dataset:')) {
            setActiveDataset(action.replace('dataset:', ''))
          }
      }
    },
    [
      setCommandPaletteOpen,
      createNotebook,
      toggleTheme,
      toggleSidebar,
      activeNotebookId,
      addCell,
      onRunAll,
      onExport,
      setActiveNotebook,
      deleteNotebook,
      setActiveDataset,
    ]
  )

  return (
    <CommandDialog open={open} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => handleSelect('new-notebook')}>
            <Plus className="mr-2 h-4 w-4" />
            New Notebook
          </CommandItem>
          {activeNotebookId && (
            <>
              <CommandItem onSelect={() => handleSelect('add-cell')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Cell
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('run-all')}>
                <Play className="mr-2 h-4 w-4" />
                Run All Cells
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('export')}>
                <Download className="mr-2 h-4 w-4" />
                Export Notebook
              </CommandItem>
            </>
          )}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="View">
          <CommandItem onSelect={() => handleSelect('toggle-sidebar')}>
            <PanelLeft className="mr-2 h-4 w-4" />
            Toggle Sidebar
          </CommandItem>
          <CommandItem onSelect={() => handleSelect('toggle-theme')}>
            {theme === 'dark' ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </CommandItem>
        </CommandGroup>

        {notebooks.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Notebooks">
              {notebooks.map((notebook) => (
                <CommandItem
                  key={notebook.id}
                  onSelect={() => handleSelect(`notebook:${notebook.id}`)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {notebook.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {datasets.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Datasets">
              {datasets.map((dataset) => (
                <CommandItem
                  key={dataset.id}
                  onSelect={() => handleSelect(`dataset:${dataset.id}`)}
                >
                  <Table className="mr-2 h-4 w-4" />
                  {dataset.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
