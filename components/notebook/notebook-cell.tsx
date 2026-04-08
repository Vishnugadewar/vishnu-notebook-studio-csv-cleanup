'use client'

import { useCallback } from 'react'
import { Play, Trash2, ChevronUp, ChevronDown, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CodeEditor } from './code-editor'
import { CellOutputDisplay } from './cell-output'
import type { Cell } from '@/lib/store'

interface NotebookCellProps {
  cell: Cell
  isActive: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<Cell>) => void
  onDelete: () => void
  onRun: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onAddBelow: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}

export function NotebookCell({
  cell,
  isActive,
  onSelect,
  onUpdate,
  onDelete,
  onRun,
  onMoveUp,
  onMoveDown,
  onAddBelow,
  canMoveUp,
  canMoveDown,
}: NotebookCellProps) {
  const handleContentChange = useCallback(
    (content: string) => {
      onUpdate({ content })
    },
    [onUpdate]
  )

  return (
    <div
      className={cn(
        'group relative rounded-lg border transition-all duration-200',
        isActive
          ? 'border-primary/50 shadow-sm shadow-primary/10'
          : 'border-border hover:border-muted-foreground/30',
        'bg-card'
      )}
      onClick={onSelect}
    >
      {/* Cell toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30 rounded-t-lg">
        <div className="flex items-center gap-2">
          {/* Execution count or indicator */}
          <div className="flex items-center justify-center min-w-[24px] h-6 text-xs font-mono text-muted-foreground">
            {cell.isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : cell.executionCount !== null ? (
              <span>[{cell.executionCount}]</span>
            ) : (
              <span>[ ]</span>
            )}
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {cell.type === 'code' ? 'Python' : 'Markdown'}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation()
              onRun()
            }}
            disabled={cell.isRunning || cell.type !== 'code'}
            title="Run cell (Shift+Enter)"
          >
            <Play className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation()
              onMoveUp()
            }}
            disabled={!canMoveUp}
            title="Move up"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation()
              onMoveDown()
            }}
            disabled={!canMoveDown}
            title="Move down"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation()
              onAddBelow()
            }}
            title="Add cell below"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            title="Delete cell"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Code editor */}
      <CodeEditor
        value={cell.content}
        onChange={handleContentChange}
        onRun={cell.type === 'code' ? onRun : undefined}
        language={cell.type === 'code' ? 'python' : 'markdown'}
        placeholder={
          cell.type === 'code'
            ? '# Enter Python code here...\n# Press Shift+Enter to run'
            : 'Enter Markdown...'
        }
        disabled={cell.isRunning}
      />

      {/* Outputs */}
      <CellOutputDisplay outputs={cell.outputs} />
    </div>
  )
}
