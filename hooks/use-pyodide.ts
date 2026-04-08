'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { PyodideInterface } from 'pyodide'

interface UsePyodideReturn {
  pyodide: PyodideInterface | null
  isLoading: boolean
  isReady: boolean
  error: string | null
  runPython: (code: string) => Promise<{ output: string; error: string | null; hasPlot: boolean; plotData: string | null }>
  loadDataset: (name: string, csvData: string) => Promise<void>
}

export function usePyodide(): UsePyodideReturn {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const loadPyodide = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load Pyodide from CDN
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js'
        script.async = true
        
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load Pyodide script'))
          document.head.appendChild(script)
        })

        // Initialize Pyodide
        const pyodideInstance = await (window as unknown as { loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface> }).loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
        })

        // Load essential packages
        await pyodideInstance.loadPackage(['pandas', 'numpy', 'matplotlib'])

        // Setup matplotlib for inline display
        await pyodideInstance.runPythonAsync(`
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import io
import base64
import sys
from io import StringIO

# Store for datasets
_datasets = {}

def _capture_plot():
    """Capture current matplotlib figure as base64 PNG"""
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='white')
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    plt.close('all')
    return img_str

def _load_csv(name, csv_string):
    """Load CSV data into a pandas DataFrame"""
    global _datasets
    df = pd.read_csv(StringIO(csv_string))
    _datasets[name] = df
    globals()[name.replace('.csv', '').replace(' ', '_').replace('-', '_')] = df
    return df

# Make df available globally for convenience
df = None
`)

        setPyodide(pyodideInstance)
        setIsReady(true)
      } catch (err) {
        console.error('Pyodide initialization error:', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize Python runtime')
      } finally {
        setIsLoading(false)
      }
    }

    loadPyodide()
  }, [])

  const runPython = useCallback(async (code: string) => {
    if (!pyodide) {
      return { output: '', error: 'Python runtime not ready', hasPlot: false, plotData: null }
    }

    try {
      // Capture stdout
      await pyodide.runPythonAsync(`
_stdout_capture = StringIO()
_old_stdout = sys.stdout
sys.stdout = _stdout_capture
_plot_created = False
`)

      // Check if code might create a plot
      const mightCreatePlot = code.includes('plt.') || code.includes('plot(') || code.includes('.plot')

      // Run the user code
      let result
      try {
        result = await pyodide.runPythonAsync(code)
      } catch (err) {
        // Restore stdout before throwing
        await pyodide.runPythonAsync(`sys.stdout = _old_stdout`)
        throw err
      }

      // Check for plot and capture if exists
      let plotData = null
      if (mightCreatePlot) {
        const figNum = await pyodide.runPythonAsync(`len(plt.get_fignums())`)
        if (figNum > 0) {
          plotData = await pyodide.runPythonAsync(`_capture_plot()`)
        }
      }

      // Get captured output
      const capturedOutput = await pyodide.runPythonAsync(`
sys.stdout = _old_stdout
_stdout_capture.getvalue()
`)

      // Format the result
      let output = capturedOutput || ''
      if (result !== undefined && result !== null && String(result) !== 'None') {
        // Check if result is a DataFrame
        const isDataFrame = await pyodide.runPythonAsync(`
isinstance(${code.split('=')[0].trim() if '=' in code else '_'} if '${code.split('=')[0].trim() if '=' in code else '_'}' in dir() else None, pd.DataFrame) if 'pd' in dir() else False
`)
        if (output) {
          output += '\n'
        }
        output += String(result)
      }

      return {
        output: output.trim(),
        error: null,
        hasPlot: plotData !== null,
        plotData,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      return {
        output: '',
        error: errorMessage,
        hasPlot: false,
        plotData: null,
      }
    }
  }, [pyodide])

  const loadDataset = useCallback(async (name: string, csvData: string) => {
    if (!pyodide) {
      throw new Error('Python runtime not ready')
    }

    const escapedCsv = csvData.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
    await pyodide.runPythonAsync(`
df = _load_csv('${name}', '''${escapedCsv}''')
print(f"Loaded '{name}' as DataFrame 'df' with {len(df)} rows and {len(df.columns)} columns")
print(f"Columns: {list(df.columns)}")
`)
  }, [pyodide])

  return {
    pyodide,
    isLoading,
    isReady,
    error,
    runPython,
    loadDataset,
  }
}
