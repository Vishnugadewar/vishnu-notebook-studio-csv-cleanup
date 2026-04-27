'use client'

import { Plus, FileText, Trash2, File, BarChart3, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useNotebookStore } from '@/lib/store'

export function AppSidebar() {
  const notebooks = useNotebookStore((state) => state.notebooks)
  const activeNotebookId = useNotebookStore((state) => state.activeNotebookId)
  const datasets = useNotebookStore((state) => state.datasets)
  const sidebarOpen = useNotebookStore((state) => state.sidebarOpen)
  const viewMode = useNotebookStore((state) => state.viewMode)
  const { createNotebook, deleteNotebook, setActiveNotebook, setActiveDataset, setViewMode } =
    useNotebookStore()

  if (!sidebarOpen) return null

  return (
    <aside className="w-64 flex-shrink-0 border-r border-border bg-sidebar flex flex-col">
      {/* Navigation */}
      <div className="p-2 border-b border-sidebar-border">
        <div className="space-y-1">
          <button
            onClick={() => setViewMode('notebook')}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
              viewMode === 'notebook'
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            )}
          >
            <BookOpen className="h-4 w-4" />
            Notebook
          </button>
          <button
            onClick={() => setViewMode('eda-dashboard')}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
              viewMode === 'eda-dashboard'
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            )}
          >
            <BarChart3 className="h-4 w-4" />
            EDA Dashboard
          </button>
        </div>
      </div>

      {/* Notebooks section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
          <h2 className="text-sm font-semibold text-sidebar-foreground">Notebooks</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => createNotebook()}
            title="New notebook"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {notebooks.length === 0 ? (
              <div className="px-2 py-4 text-center">
                <p className="text-sm text-sidebar-foreground/60">No notebooks</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => createNotebook()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Notebook
                </Button>
              </div>
            ) : (
              notebooks.map((notebook) => (
                <div
                  key={notebook.id}
                  className={cn(
                    'group flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer transition-colors',
                    activeNotebookId === notebook.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                  onClick={() => setActiveNotebook(notebook.id)}
                >
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 text-sm truncate">{notebook.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotebook(notebook.id)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Datasets section */}
      <div className="border-t border-sidebar-border">
        <div className="px-4 py-3 border-b border-sidebar-border">
          <h2 className="text-sm font-semibold text-sidebar-foreground">Datasets</h2>
        </div>
        <ScrollArea className="max-h-48">
          <div className="p-2 space-y-1">
            {datasets.length === 0 ? (
              <p className="px-2 py-2 text-sm text-sidebar-foreground/60 text-center">
                No datasets loaded
              </p>
            ) : (
              datasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                  onClick={() => setActiveDataset(dataset.id)}
                >
                  <File className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                  <span className="flex-1 text-sm truncate">{dataset.name}</span>
                  <span className="text-xs text-sidebar-foreground/60">
                    {dataset.rowCount.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </aside>
  )
}
