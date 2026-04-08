'use client'

import { FileText, Upload, Terminal, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotebookStore } from '@/lib/store'

export function WelcomePanel() {
  const { createNotebook } = useNotebookStore()

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-6">
          <Terminal className="h-8 w-8 text-primary" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-3 text-balance">
          Welcome to Notebook Studio
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto text-pretty">
          A browser-based Python notebook for data analysis and CSV cleanup.
          No installation required.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button size="lg" onClick={() => createNotebook()}>
            <FileText className="h-5 w-5 mr-2" />
            Create New Notebook
          </Button>
          <Button size="lg" variant="outline">
            <Upload className="h-5 w-5 mr-2" />
            Upload CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="h-10 w-10 rounded-lg bg-chart-1/10 flex items-center justify-center mb-3">
              <Terminal className="h-5 w-5 text-chart-1" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Python in Browser</h3>
            <p className="text-sm text-muted-foreground">
              Run Python code directly in your browser with pandas and numpy support.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center mb-3">
              <Upload className="h-5 w-5 text-chart-2" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">CSV Cleanup</h3>
            <p className="text-sm text-muted-foreground">
              Upload CSV files and clean them with quick actions or custom code.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="h-10 w-10 rounded-lg bg-chart-3/10 flex items-center justify-center mb-3">
              <Zap className="h-5 w-5 text-chart-3" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Inline Charts</h3>
            <p className="text-sm text-muted-foreground">
              Create matplotlib visualizations rendered inline in your notebook.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3">Keyboard Shortcuts</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-muted text-muted-foreground font-mono text-xs">
                Shift + Enter
              </kbd>
              <span className="text-muted-foreground">Run cell</span>
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-muted text-muted-foreground font-mono text-xs">
                Ctrl + S
              </kbd>
              <span className="text-muted-foreground">Save</span>
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-muted text-muted-foreground font-mono text-xs">
                Ctrl + P
              </kbd>
              <span className="text-muted-foreground">Commands</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
