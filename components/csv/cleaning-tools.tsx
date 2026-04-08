'use client'

import { useState } from 'react'
import {
  Trash2,
  Copy,
  Type,
  Filter,
  ArrowUpDown,
  Sparkles,
  Code,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { CSVDataset } from '@/lib/store'

interface CleaningToolsProps {
  dataset: CSVDataset
  onGenerateCode: (code: string) => void
  className?: string
}

interface CleaningAction {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  generateCode: (dataset: CSVDataset, params?: Record<string, string>) => string
  hasParams?: boolean
  paramFields?: { key: string; label: string; type: 'select-column' | 'text' | 'select-dtype' }[]
}

const cleaningActions: CleaningAction[] = [
  {
    id: 'drop-nulls',
    name: 'Remove Null Values',
    description: 'Drop rows with missing values',
    icon: <Trash2 className="h-4 w-4" />,
    generateCode: () => `# Remove rows with null values
df = df.dropna()
print(f"Dataset now has {len(df)} rows")
df.head()`,
  },
  {
    id: 'drop-duplicates',
    name: 'Drop Duplicates',
    description: 'Remove duplicate rows',
    icon: <Copy className="h-4 w-4" />,
    generateCode: () => `# Remove duplicate rows
original_len = len(df)
df = df.drop_duplicates()
print(f"Removed {original_len - len(df)} duplicate rows")
df.head()`,
  },
  {
    id: 'rename-column',
    name: 'Rename Column',
    description: 'Rename a column in the dataset',
    icon: <Type className="h-4 w-4" />,
    hasParams: true,
    paramFields: [
      { key: 'oldName', label: 'Select Column', type: 'select-column' },
      { key: 'newName', label: 'New Name', type: 'text' },
    ],
    generateCode: (dataset, params) => {
      const oldName = params?.oldName || 'old_column'
      const newName = params?.newName || 'new_column'
      return `# Rename column
df = df.rename(columns={'${oldName}': '${newName}'})
print(f"Renamed '{oldName}' to '{newName}'")
df.head()`
    },
  },
  {
    id: 'filter-rows',
    name: 'Filter Rows',
    description: 'Filter rows based on a condition',
    icon: <Filter className="h-4 w-4" />,
    hasParams: true,
    paramFields: [
      { key: 'column', label: 'Select Column', type: 'select-column' },
      { key: 'condition', label: 'Condition (e.g., > 100)', type: 'text' },
    ],
    generateCode: (dataset, params) => {
      const column = params?.column || 'column'
      const condition = params?.condition || '> 0'
      return `# Filter rows
original_len = len(df)
df = df[df['${column}'] ${condition}]
print(f"Filtered from {original_len} to {len(df)} rows")
df.head()`
    },
  },
  {
    id: 'convert-dtype',
    name: 'Convert Data Type',
    description: 'Change column data type',
    icon: <ArrowUpDown className="h-4 w-4" />,
    hasParams: true,
    paramFields: [
      { key: 'column', label: 'Select Column', type: 'select-column' },
      { key: 'dtype', label: 'Target Type', type: 'select-dtype' },
    ],
    generateCode: (dataset, params) => {
      const column = params?.column || 'column'
      const dtype = params?.dtype || 'str'
      return `# Convert data type
df['${column}'] = df['${column}'].astype(${dtype})
print(f"Converted '{column}' to ${dtype}")
df.dtypes`
    },
  },
  {
    id: 'fill-nulls',
    name: 'Fill Null Values',
    description: 'Replace missing values',
    icon: <Sparkles className="h-4 w-4" />,
    hasParams: true,
    paramFields: [
      { key: 'column', label: 'Select Column', type: 'select-column' },
      { key: 'value', label: 'Fill Value', type: 'text' },
    ],
    generateCode: (dataset, params) => {
      const column = params?.column || 'column'
      const value = params?.value || '0'
      return `# Fill null values
null_count = df['${column}'].isnull().sum()
df['${column}'] = df['${column}'].fillna(${value})
print(f"Filled {null_count} null values in '${column}'")
df.head()`
    },
  },
]

export function CleaningTools({ dataset, onGenerateCode, className }: CleaningToolsProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {cleaningActions.map((action) => (
          <CleaningActionButton
            key={action.id}
            action={action}
            dataset={dataset}
            onGenerateCode={onGenerateCode}
          />
        ))}
      </div>
    </div>
  )
}

interface CleaningActionButtonProps {
  action: CleaningAction
  dataset: CSVDataset
  onGenerateCode: (code: string) => void
}

function CleaningActionButton({ action, dataset, onGenerateCode }: CleaningActionButtonProps) {
  const [params, setParams] = useState<Record<string, string>>({})
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    if (action.hasParams) {
      setOpen(true)
    } else {
      onGenerateCode(action.generateCode(dataset))
    }
  }

  const handleConfirm = () => {
    onGenerateCode(action.generateCode(dataset, params))
    setOpen(false)
    setParams({})
  }

  if (action.hasParams) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="justify-start h-auto py-2.5 px-3"
          >
            {action.icon}
            <div className="ml-2 text-left">
              <div className="text-xs font-medium">{action.name}</div>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">{action.description}</p>
            {action.paramFields?.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium">{field.label}</label>
                {field.type === 'select-column' ? (
                  <Select
                    value={params[field.key] || ''}
                    onValueChange={(value) =>
                      setParams((p) => ({ ...p, [field.key]: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataset.columns.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === 'select-dtype' ? (
                  <Select
                    value={params[field.key] || ''}
                    onValueChange={(value) =>
                      setParams((p) => ({ ...p, [field.key]: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="str">String (str)</SelectItem>
                      <SelectItem value="int">Integer (int)</SelectItem>
                      <SelectItem value="float">Float (float)</SelectItem>
                      <SelectItem value="bool">Boolean (bool)</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={params[field.key] || ''}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, [field.key]: e.target.value }))
                    }
                    placeholder={field.label}
                  />
                )}
              </div>
            ))}
            <Button onClick={handleConfirm} className="w-full">
              <Code className="h-4 w-4 mr-2" />
              Generate Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="justify-start h-auto py-2.5 px-3"
      onClick={handleClick}
    >
      {action.icon}
      <div className="ml-2 text-left">
        <div className="text-xs font-medium">{action.name}</div>
      </div>
    </Button>
  )
}
