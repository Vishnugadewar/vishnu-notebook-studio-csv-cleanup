'use client'

import { Menu, Moon, Sun, Search, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useNotebookStore } from '@/lib/store'

interface AppHeaderProps {
  pyodideReady: boolean
  pyodideLoading: boolean
}

export function AppHeader({ pyodideReady, pyodideLoading }: AppHeaderProps) {
  const theme = useNotebookStore((state) => state.theme)
  const { toggleSidebar, toggleTheme, setCommandPaletteOpen } = useNotebookStore()

  return (
    <header className="h-12 flex-shrink-0 flex items-center justify-between px-4 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleSidebar}
          title="Toggle sidebar"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">N</span>
          </div>
          <span className="font-semibold text-foreground">Notebook Studio</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Python runtime status */}
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
            pyodideReady
              ? 'bg-success/10 text-success'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {pyodideLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading Python...
            </>
          ) : pyodideReady ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Python Ready
            </>
          ) : (
            'Python not loaded'
          )}
        </div>

        {/* Command palette trigger */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 gap-2"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs text-muted-foreground">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium">
              <span className="text-xs">Ctrl</span>
              <span className="text-xs">P</span>
            </kbd>
          </span>
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  )
}
