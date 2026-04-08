'use client'

import { cn } from '@/lib/utils'
import type { CellOutput } from '@/lib/store'

interface CellOutputProps {
  outputs: CellOutput[]
  className?: string
}

export function CellOutputDisplay({ outputs, className }: CellOutputProps) {
  if (outputs.length === 0) return null

  return (
    <div className={cn('border-t border-border bg-muted/20', className)}>
      {outputs.map((output, index) => (
        <div key={index} className="p-3">
          {output.type === 'error' ? (
            <pre className="text-destructive font-mono text-sm whitespace-pre-wrap overflow-x-auto">
              {output.content}
            </pre>
          ) : output.type === 'image' ? (
            <div className="flex justify-center">
              <img
                src={`data:image/png;base64,${output.content}`}
                alt="Plot output"
                className="max-w-full h-auto rounded-md"
              />
            </div>
          ) : output.type === 'html' ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: output.content }}
            />
          ) : (
            <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto text-foreground">
              {output.content}
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}
