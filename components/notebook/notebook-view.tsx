'use client'

import { useCallback, useRef } from 'react'
import { Plus, Play, Save, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNotebookStore } from '@/lib/store'
import { usePyodide } from '@/hooks/use-pyodide'
import { NotebookCell } from './notebook-cell'
import type { CellOutput } from '@/lib/store'

interface NotebookViewProps {
  notebookId: string
}

export function NotebookView({ notebookId }: NotebookViewProps) {
  const executionCountRef = useRef(0)
  const { runPython, isReady, loadDataset } = usePyodide()

  const notebook = useNotebookStore((state) =>
    state.notebooks.find((n) => n.id === notebookId)
  )
  const datasets = useNotebookStore((state) => state.datasets)
  const activeCellId = useNotebookStore((state) => state.activeCellId)
  const {
    updateNotebook,
    addCell,
    deleteCell,
    updateCell,
    moveCell,
    setActiveCellId,
  } = useNotebookStore()

  const handleRunCell = useCallback(
    async (cellId: string) => {
      if (!notebook || !isReady) return

      const cell = notebook.cells.find((c) => c.id === cellId)
      if (!cell || cell.type !== 'code') return

      // Mark cell as running
      updateCell(notebookId, cellId, { isRunning: true, outputs: [] })

      try {
        // Load any datasets that haven't been loaded yet
        for (const dataset of datasets) {
          await loadDataset(dataset.name, dataset.data)
        }

        const result = await runPython(cell.content)
        const outputs: CellOutput[] = []

        if (result.error) {
          outputs.push({ type: 'error', content: result.error })
        } else {
          if (result.output) {
            outputs.push({ type: 'text', content: result.output })
          }
          if (result.hasPlot && result.plotData) {
            outputs.push({ type: 'image', content: result.plotData })
          }
        }

        executionCountRef.current += 1
        updateCell(notebookId, cellId, {
          isRunning: false,
          outputs,
          executionCount: executionCountRef.current,
        })
      } catch (err) {
        updateCell(notebookId, cellId, {
          isRunning: false,
          outputs: [
            {
              type: 'error',
              content: err instanceof Error ? err.message : 'Execution failed',
            },
          ],
        })
      }
    },
    [notebook, notebookId, isReady, datasets, runPython, loadDataset, updateCell]
  )

  const handleRunAll = useCallback(async () => {
    if (!notebook) return
    for (const cell of notebook.cells) {
      if (cell.type === 'code') {
        await handleRunCell(cell.id)
      }
    }
  }, [notebook, handleRunCell])

  const handleSave = useCallback(() => {
    if (!notebook) return
    // Convert to .ipynb format
    const ipynb = {
      metadata: {
        kernelspec: {
          display_name: 'Python 3 (Pyodide)',
          language: 'python',
          name: 'python3',
        },
        language_info: {
          name: 'python',
          version: '3.10',
        },
      },
      nbformat: 4,
      nbformat_minor: 5,
      cells: notebook.cells.map((cell) => ({
        cell_type: cell.type,
        execution_count: cell.executionCount,
        metadata: {},
        source: cell.content.split('\n'),
        outputs: cell.outputs.map((output) => {
          if (output.type === 'error') {
            return {
              output_type: 'error',
              ename: 'Error',
              evalue: output.content,
              traceback: [output.content],
            }
          } else if (output.type === 'image') {
            return {
              output_type: 'display_data',
              data: {
                'image/png': output.content,
              },
              metadata: {},
            }
          } else {
            return {
              output_type: 'stream',
              name: 'stdout',
              text: [output.content],
            }
          }
        }),
      })),
    }

    const blob = new Blob([JSON.stringify(ipynb, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${notebook.name}.ipynb`
    a.click()
    URL.revokeObjectURL(url)
  }, [notebook])

  if (!notebook) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>No notebook selected</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Notebook toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <Input
          value={notebook.name}
          onChange={(e) => updateNotebook(notebookId, { name: e.target.value })}
          className="max-w-xs font-medium bg-transparent border-transparent hover:border-input focus:border-input"
        />
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={handleRunAll} disabled={!isReady}>
          <Play className="h-4 w-4 mr-2" />
          Run All
        </Button>
        <Button variant="outline" size="sm" onClick={handleSave}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Cells */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {notebook.cells.map((cell, index) => (
            <NotebookCell
              key={cell.id}
              cell={cell}
              isActive={activeCellId === cell.id}
              onSelect={() => setActiveCellId(cell.id)}
              onUpdate={(updates) => updateCell(notebookId, cell.id, updates)}
              onDelete={() => deleteCell(notebookId, cell.id)}
              onRun={() => handleRunCell(cell.id)}
              onMoveUp={() => moveCell(notebookId, cell.id, 'up')}
              onMoveDown={() => moveCell(notebookId, cell.id, 'down')}
              onAddBelow={() => addCell(notebookId, cell.id)}
              canMoveUp={index > 0}
              canMoveDown={index < notebook.cells.length - 1}
            />
          ))}

          {/* Add cell button */}
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addCell(notebookId)}
              className="opacity-60 hover:opacity-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Cell
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
