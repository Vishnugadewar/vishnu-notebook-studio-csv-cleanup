'use client'

import { useCallback } from 'react'
import { Download, Table } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNotebookStore } from '@/lib/store'
import { CSVUpload, DatasetCard } from './csv-upload'
import { DataPreview } from './data-preview'
import { CleaningTools } from './cleaning-tools'

interface DataPanelProps {
  onAddCode?: (code: string) => void
}

export function DataPanel({ onAddCode }: DataPanelProps) {
  const datasets = useNotebookStore((state) => state.datasets)
  const activeDatasetId = useNotebookStore((state) => state.activeDatasetId)
  const { setActiveDataset, removeDataset } = useNotebookStore()

  const activeDataset = datasets.find((d) => d.id === activeDatasetId)

  const handleDownloadCSV = useCallback(() => {
    if (!activeDataset) return

    const blob = new Blob([activeDataset.data], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = activeDataset.name.replace('.csv', '_cleaned.csv')
    a.click()
    URL.revokeObjectURL(url)
  }, [activeDataset])

  const handleGenerateCode = useCallback(
    (code: string) => {
      if (onAddCode) {
        onAddCode(code)
      }
    },
    [onAddCode]
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Table className="h-4 w-4" />
          Data Panel
        </h2>
      </div>

      <Tabs defaultValue="datasets" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="datasets" className="flex-1">
            Datasets
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex-1" disabled={!activeDataset}>
            Preview
          </TabsTrigger>
          <TabsTrigger value="clean" className="flex-1" disabled={!activeDataset}>
            Clean
          </TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="flex-1 p-4 space-y-4 overflow-y-auto">
          <CSVUpload />

          {datasets.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Loaded Datasets
              </h3>
              {datasets.map((dataset) => (
                <DatasetCard
                  key={dataset.id}
                  id={dataset.id}
                  name={dataset.name}
                  rowCount={dataset.rowCount}
                  columns={dataset.columns}
                  isActive={dataset.id === activeDatasetId}
                  onSelect={() => setActiveDataset(dataset.id)}
                  onRemove={() => removeDataset(dataset.id)}
                />
              ))}
            </div>
          )}

          {datasets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <p>No datasets loaded</p>
              <p className="text-xs mt-1">Upload a CSV file to get started</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="flex-1 p-4 overflow-y-auto">
          {activeDataset ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{activeDataset.name}</h3>
                <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <DataPreview dataset={activeDataset} />
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Select a dataset to preview
            </div>
          )}
        </TabsContent>

        <TabsContent value="clean" className="flex-1 p-4 overflow-y-auto">
          {activeDataset ? (
            <CleaningTools
              dataset={activeDataset}
              onGenerateCode={handleGenerateCode}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Select a dataset to clean
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
