'use client'

import { useCallback, useState } from 'react'
import { Upload, File, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useNotebookStore } from '@/lib/store'

interface CSVUploadProps {
  className?: string
}

function parseCSV(csvString: string): { headers: string[]; rows: string[][] } {
  const lines = csvString.trim().split('\n')
  if (lines.length === 0) return { headers: [], rows: [] }

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''))
  const rows = lines.slice(1).map((line) => {
    // Simple CSV parsing (doesn't handle all edge cases)
    const values: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())
    return values
  })

  return { headers, rows }
}

export function CSVUpload({ className }: CSVUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const addDataset = useNotebookStore((state) => state.addDataset)

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csvData = e.target?.result as string
        const { headers, rows } = parseCSV(csvData)

        addDataset({
          name: file.name,
          data: csvData,
          preview: [headers, ...rows.slice(0, 10)],
          columns: headers,
          rowCount: rows.length,
        })
      }
      reader.readAsText(file)
    },
    [addDataset]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const csvFile = files.find((f) => f.name.endsWith('.csv'))
      if (csvFile) {
        handleFile(csvFile)
      }
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-lg transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-muted-foreground/50',
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center justify-center p-6 pointer-events-none">
        <Upload className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">
          Drop CSV file here
        </p>
        <p className="text-xs text-muted-foreground">or click to browse</p>
      </div>
    </div>
  )
}

interface DatasetCardProps {
  id: string
  name: string
  rowCount: number
  columns: string[]
  isActive: boolean
  onSelect: () => void
  onRemove: () => void
}

export function DatasetCard({
  name,
  rowCount,
  columns,
  isActive,
  onSelect,
  onRemove,
}: DatasetCardProps) {
  return (
    <div
      className={cn(
        'group relative p-3 rounded-lg border cursor-pointer transition-all',
        isActive
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-muted-foreground/50'
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <File className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {rowCount.toLocaleString()} rows, {columns.length} columns
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
