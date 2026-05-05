import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CellOutput {
  type: 'text' | 'error' | 'html' | 'image'
  content: string
}

export interface Cell {
  id: string
  type: 'code' | 'markdown'
  content: string
  outputs: CellOutput[]
  isRunning: boolean
  executionCount: number | null
}

export interface Notebook {
  id: string
  name: string
  cells: Cell[]
  createdAt: number
  updatedAt: number
}

export interface CSVDataset {
  id: string
  name: string
  data: string
  preview: string[][]
  columns: string[]
  rowCount: number
}

type ViewMode = 'notebook' | 'eda-dashboard' | 'job-board' | 'jobs-dashboard'

interface NotebookState {
  notebooks: Notebook[]
  activeNotebookId: string | null
  datasets: CSVDataset[]
  activeDatasetId: string | null
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  commandPaletteOpen: boolean
  activeCellId: string | null
  viewMode: ViewMode
  
  // Notebook actions
  createNotebook: (name?: string) => string
  deleteNotebook: (id: string) => void
  setActiveNotebook: (id: string | null) => void
  updateNotebook: (id: string, updates: Partial<Notebook>) => void
  
  // Cell actions
  addCell: (notebookId: string, afterCellId?: string, type?: 'code' | 'markdown') => void
  deleteCell: (notebookId: string, cellId: string) => void
  updateCell: (notebookId: string, cellId: string, updates: Partial<Cell>) => void
  moveCell: (notebookId: string, cellId: string, direction: 'up' | 'down') => void
  setActiveCellId: (cellId: string | null) => void
  
  // Dataset actions
  addDataset: (dataset: Omit<CSVDataset, 'id'>) => string
  removeDataset: (id: string) => void
  setActiveDataset: (id: string | null) => void
  
  // UI actions
  toggleSidebar: () => void
  toggleTheme: () => void
  setCommandPaletteOpen: (open: boolean) => void
  setViewMode: (mode: ViewMode) => void
}

const generateId = () => Math.random().toString(36).substring(2, 15)

const createDefaultCell = (type: 'code' | 'markdown' = 'code'): Cell => ({
  id: generateId(),
  type,
  content: '',
  outputs: [],
  isRunning: false,
  executionCount: null,
})

const createDefaultNotebook = (name: string = 'Untitled Notebook'): Notebook => ({
  id: generateId(),
  name,
  cells: [createDefaultCell()],
  createdAt: Date.now(),
  updatedAt: Date.now(),
})

export const useNotebookStore = create<NotebookState>()(
  persist(
    (set, get) => ({
      notebooks: [],
      activeNotebookId: null,
      datasets: [],
      activeDatasetId: null,
      sidebarOpen: true,
      theme: 'dark',
      commandPaletteOpen: false,
      activeCellId: null,
      viewMode: 'notebook',
      
      createNotebook: (name) => {
        const notebook = createDefaultNotebook(name)
        set((state) => ({
          notebooks: [...state.notebooks, notebook],
          activeNotebookId: notebook.id,
          activeCellId: notebook.cells[0]?.id || null,
        }))
        return notebook.id
      },
      
      deleteNotebook: (id) => {
        set((state) => ({
          notebooks: state.notebooks.filter((n) => n.id !== id),
          activeNotebookId: state.activeNotebookId === id ? null : state.activeNotebookId,
        }))
      },
      
      setActiveNotebook: (id) => {
        const notebook = get().notebooks.find((n) => n.id === id)
        set({
          activeNotebookId: id,
          activeCellId: notebook?.cells[0]?.id || null,
        })
      },
      
      updateNotebook: (id, updates) => {
        set((state) => ({
          notebooks: state.notebooks.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
          ),
        }))
      },
      
      addCell: (notebookId, afterCellId, type = 'code') => {
        const newCell = createDefaultCell(type)
        set((state) => ({
          notebooks: state.notebooks.map((n) => {
            if (n.id !== notebookId) return n
            const index = afterCellId
              ? n.cells.findIndex((c) => c.id === afterCellId) + 1
              : n.cells.length
            const cells = [...n.cells]
            cells.splice(index, 0, newCell)
            return { ...n, cells, updatedAt: Date.now() }
          }),
          activeCellId: newCell.id,
        }))
      },
      
      deleteCell: (notebookId, cellId) => {
        set((state) => ({
          notebooks: state.notebooks.map((n) => {
            if (n.id !== notebookId) return n
            const cells = n.cells.filter((c) => c.id !== cellId)
            if (cells.length === 0) {
              cells.push(createDefaultCell())
            }
            return { ...n, cells, updatedAt: Date.now() }
          }),
        }))
      },
      
      updateCell: (notebookId, cellId, updates) => {
        set((state) => ({
          notebooks: state.notebooks.map((n) => {
            if (n.id !== notebookId) return n
            return {
              ...n,
              cells: n.cells.map((c) => (c.id === cellId ? { ...c, ...updates } : c)),
              updatedAt: Date.now(),
            }
          }),
        }))
      },
      
      moveCell: (notebookId, cellId, direction) => {
        set((state) => ({
          notebooks: state.notebooks.map((n) => {
            if (n.id !== notebookId) return n
            const index = n.cells.findIndex((c) => c.id === cellId)
            if (index === -1) return n
            const newIndex = direction === 'up' ? index - 1 : index + 1
            if (newIndex < 0 || newIndex >= n.cells.length) return n
            const cells = [...n.cells]
            const [cell] = cells.splice(index, 1)
            cells.splice(newIndex, 0, cell)
            return { ...n, cells, updatedAt: Date.now() }
          }),
        }))
      },
      
      setActiveCellId: (cellId) => set({ activeCellId: cellId }),
      
      addDataset: (dataset) => {
        const id = generateId()
        set((state) => ({
          datasets: [...state.datasets, { ...dataset, id }],
          activeDatasetId: id,
        }))
        return id
      },
      
      removeDataset: (id) => {
        set((state) => ({
          datasets: state.datasets.filter((d) => d.id !== id),
          activeDatasetId: state.activeDatasetId === id ? null : state.activeDatasetId,
        }))
      },
      
      setActiveDataset: (id) => set({ activeDatasetId: id }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'notebook-studio-storage',
      partialize: (state) => ({
        notebooks: state.notebooks,
        datasets: state.datasets,
        theme: state.theme,
      }),
    }
  )
)
