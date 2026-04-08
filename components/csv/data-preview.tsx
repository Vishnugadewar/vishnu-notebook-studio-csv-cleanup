'use client'

import { cn } from '@/lib/utils'
import type { CSVDataset } from '@/lib/store'

interface DataPreviewProps {
  dataset: CSVDataset
  className?: string
}

export function DataPreview({ dataset, className }: DataPreviewProps) {
  const { preview, columns, rowCount } = dataset

  return (
    <div className={cn('overflow-hidden rounded-lg border border-border', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground w-12">
                #
              </th>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-3 py-2 text-left font-medium text-foreground whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.slice(1).map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  'border-b border-border last:border-0',
                  rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                )}
              >
                <td className="px-3 py-2 text-muted-foreground font-mono text-xs">
                  {rowIndex + 1}
                </td>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-3 py-2 whitespace-nowrap max-w-[200px] truncate"
                    title={cell}
                  >
                    {cell || <span className="text-muted-foreground italic">null</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-3 py-2 bg-muted/30 border-t border-border text-xs text-muted-foreground">
        Showing {Math.min(preview.length - 1, 10)} of {rowCount.toLocaleString()} rows
      </div>
    </div>
  )
}
