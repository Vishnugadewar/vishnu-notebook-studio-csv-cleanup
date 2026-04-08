'use client'

import { useRef, useEffect, KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  onRun?: () => void
  language?: 'python' | 'markdown'
  placeholder?: string
  disabled?: boolean
  className?: string
}

// Simple syntax highlighting for Python
function highlightPython(code: string): string {
  const keywords = ['def', 'class', 'import', 'from', 'as', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'with', 'return', 'yield', 'lambda', 'pass', 'break', 'continue', 'and', 'or', 'not', 'in', 'is', 'None', 'True', 'False', 'global', 'nonlocal', 'assert', 'raise', 'del', 'async', 'await']
  const builtins = ['print', 'len', 'range', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 'type', 'isinstance', 'open', 'read', 'write', 'close', 'sum', 'min', 'max', 'abs', 'round', 'sorted', 'reversed', 'enumerate', 'zip', 'map', 'filter', 'any', 'all']
  
  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  // Strings (both single and double quotes)
  highlighted = highlighted.replace(/('''[\s\S]*?'''|"""[\s\S]*?"""|'[^']*'|"[^"]*")/g, '<span class="text-success">$1</span>')
  
  // Comments
  highlighted = highlighted.replace(/(#.*$)/gm, '<span class="text-muted-foreground italic">$1</span>')
  
  // Numbers
  highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-chart-4">$1</span>')
  
  // Keywords
  const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g')
  highlighted = highlighted.replace(keywordRegex, '<span class="text-primary font-medium">$1</span>')
  
  // Builtins
  const builtinRegex = new RegExp(`\\b(${builtins.join('|')})\\b(?=\\()`, 'g')
  highlighted = highlighted.replace(builtinRegex, '<span class="text-chart-2">$1</span>')
  
  // Function definitions
  highlighted = highlighted.replace(/\b(def|class)\s+(\w+)/g, '<span class="text-primary font-medium">$1</span> <span class="text-chart-1">$2</span>')
  
  return highlighted
}

export function CodeEditor({
  value,
  onChange,
  onRun,
  language = 'python',
  placeholder = 'Enter code...',
  disabled = false,
  className,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLPreElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift + Enter to run
    if (e.key === 'Enter' && e.shiftKey && onRun) {
      e.preventDefault()
      onRun()
      return
    }

    // Tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newValue = value.substring(0, start) + '    ' + value.substring(end)
      onChange(newValue)
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4
        }
      }, 0)
    }
  }

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  // Calculate line numbers
  const lineCount = value.split('\n').length
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1)

  useEffect(() => {
    // Adjust height based on content
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.max(80, textareaRef.current.scrollHeight) + 'px'
    }
  }, [value])

  return (
    <div className={cn('relative font-mono text-sm', className)}>
      <div className="flex">
        {/* Line numbers */}
        <div className="flex-shrink-0 select-none text-muted-foreground text-right pr-3 pt-3 pb-3 pl-2 bg-muted/30 border-r border-border">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6 h-6">
              {num}
            </div>
          ))}
        </div>

        {/* Code area */}
        <div className="relative flex-1 overflow-hidden">
          {/* Syntax highlighted display */}
          <pre
            ref={highlightRef}
            className="absolute inset-0 p-3 overflow-hidden pointer-events-none whitespace-pre-wrap break-words leading-6"
            aria-hidden="true"
            dangerouslySetInnerHTML={{
              __html: language === 'python' ? highlightPython(value || ' ') : (value || ' '),
            }}
          />

          {/* Actual textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            placeholder={placeholder}
            disabled={disabled}
            spellCheck={false}
            className={cn(
              'relative w-full p-3 bg-transparent resize-none outline-none leading-6',
              'text-transparent caret-foreground',
              'placeholder:text-muted-foreground',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'min-h-[80px]'
            )}
            style={{ WebkitTextFillColor: 'transparent' }}
          />
        </div>
      </div>
    </div>
  )
}
