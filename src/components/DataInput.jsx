import React, { useState } from 'react'
import Papa from 'papaparse'

// Example dataset for demonstration
const EXAMPLE_DATASET = [
  { id: 1, name: 'Alice Johnson', age: 25, city: 'New York', income: 45000, stratum: 'A' },
  { id: 2, name: 'Bob Smith', age: 32, city: 'Los Angeles', income: 62000, stratum: 'B' },
  { id: 3, name: 'Carol Davis', age: 28, city: 'Chicago', income: 38000, stratum: 'A' },
  { id: 4, name: 'David Wilson', age: 35, city: 'Houston', income: 75000, stratum: 'C' },
  { id: 5, name: 'Eva Brown', age: 29, city: 'Phoenix', income: 52000, stratum: 'B' },
  { id: 6, name: 'Frank Miller', age: 41, city: 'Philadelphia', income: 68000, stratum: 'C' },
  { id: 7, name: 'Grace Lee', age: 26, city: 'San Antonio', income: 41000, stratum: 'A' },
  { id: 8, name: 'Henry Taylor', age: 33, city: 'San Diego', income: 71000, stratum: 'B' },
  { id: 9, name: 'Ivy Garcia', age: 31, city: 'Dallas', income: 58000, stratum: 'B' },
  { id: 10, name: 'Jack Martinez', age: 27, city: 'San Jose', income: 49000, stratum: 'A' },
  { id: 11, name: 'Kate Anderson', age: 38, city: 'Austin', income: 82000, stratum: 'C' },
  { id: 12, name: 'Liam Thomas', age: 24, city: 'Jacksonville', income: 36000, stratum: 'A' },
  { id: 13, name: 'Mia Jackson', age: 36, city: 'Fort Worth', income: 67000, stratum: 'B' },
  { id: 14, name: 'Noah White', age: 30, city: 'Columbus', income: 54000, stratum: 'B' },
  { id: 15, name: 'Olivia Harris', age: 34, city: 'Charlotte', income: 73000, stratum: 'C' },
  { id: 16, name: 'Paul Clark', age: 29, city: 'San Francisco', income: 95000, stratum: 'C' },
  { id: 17, name: 'Quinn Lewis', age: 25, city: 'Indianapolis', income: 42000, stratum: 'A' },
  { id: 18, name: 'Ruby Walker', age: 37, city: 'Seattle', income: 78000, stratum: 'B' },
  { id: 19, name: 'Sam Hall', age: 28, city: 'Denver', income: 51000, stratum: 'A' },
  { id: 20, name: 'Tina Young', age: 33, city: 'Washington', income: 69000, stratum: 'B' }
]

function DataInput({ appState, updateAppState }) {
  const [inputMethod, setInputMethod] = useState('example')
  const [csvFile, setCsvFile] = useState(null)
  const [manualData, setManualData] = useState('')
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const validateData = (data) => {
    if (!data || data.length === 0) {
      return 'Data must contain at least one row'
    }
    if (data.length < 2) {
      return 'Data must contain at least 2 rows'
    }
    if (!data[0] || Object.keys(data[0]).length === 0) {
      return 'Data must contain at least one column'
    }
    return null
  }

  const processData = (data) => {
    const error = validateData(data)
    if (error) {
      setError(error)
      return false
    }
    
    setError('')
    setPreview(data.slice(0, 5)) // Show first 5 rows as preview
    updateAppState({ data })
    return true
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setCsvFile(file)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error parsing CSV file: ' + results.errors[0].message)
          return
        }
        processData(results.data)
      },
      error: (error) => {
        setError('Error reading file: ' + error.message)
      }
    })
  }

  const handleManualInput = () => {
    try {
      // Try to parse as JSON first
      let data
      if (manualData.trim().startsWith('[')) {
        data = JSON.parse(manualData)
      } else {
        // Try to parse as CSV-like format
        const lines = manualData.trim().split('\n')
        const headers = lines[0].split(',').map(h => h.trim())
        data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim())
          const row = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          return row
        })
      }
      processData(data)
    } catch (err) {
      setError('Invalid data format. Please use JSON array or CSV format with headers.')
    }
  }

  const useExampleData = () => {
    processData(EXAMPLE_DATASET)
  }

  const renderPreview = () => {
    if (!preview) return null

    const columns = Object.keys(preview[0])
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Data Preview (First 5 rows)
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {columns.map((col, index) => (
                  <th key={index} className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                      {row[col] || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Total rows: {appState.data?.length || 0} | Columns: {columns.length}
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Input Your Data
      </h2>

      {/* Input Method Selection */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <button
          onClick={() => setInputMethod('example')}
          className={`px-4 py-2 rounded-lg border-2 transition-colors ${
            inputMethod === 'example'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          📊 Use Example Dataset
        </button>
        <button
          onClick={() => setInputMethod('upload')}
          className={`px-4 py-2 rounded-lg border-2 transition-colors ${
            inputMethod === 'upload'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          📁 Upload CSV File
        </button>
        <button
          onClick={() => setInputMethod('manual')}
          className={`px-4 py-2 rounded-lg border-2 transition-colors ${
            inputMethod === 'manual'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          ✏️ Manual Input
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Input Methods */}
      {inputMethod === 'example' && (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Use our built-in example dataset with 20 sample records including demographic information.
          </p>
          <button
            onClick={useExampleData}
            className="btn-primary"
          >
            Load Example Dataset
          </button>
        </div>
      )}

      {inputMethod === 'upload' && (
        <div className="text-center">
          <div
            className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0]
                if (!file.name.endsWith('.csv')) {
                  setError('Only CSV files are supported.')
                  return
                }
                const fakeEvent = { target: { files: [file] } }
                handleFileUpload(fakeEvent)
              }
            }}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer block">
              <div className="text-4xl mb-4">📁</div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Click to upload CSV file
              </p>
              <p className="text-sm text-gray-500">
                or drag and drop your CSV file here
              </p>
            </label>
          </div>
          {csvFile && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {csvFile.name}
            </p>
          )}
        </div>
      )}

      {inputMethod === 'manual' && (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your data (JSON array or CSV format with headers):
            </label>
            <textarea
              value={manualData}
              onChange={(e) => setManualData(e.target.value)}
              placeholder={`JSON format:
[
  {"id": 1, "name": "John", "age": 30},
  {"id": 2, "name": "Jane", "age": 25}
]

Or CSV format:
id,name,age
1,John,30
2,Jane,25`}
              className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-center">
            <button
              onClick={handleManualInput}
              className="btn-primary"
            >
              Process Data
            </button>
          </div>
        </div>
      )}

      {/* Data Preview */}
      {renderPreview()}
    </div>
  )
}

export default DataInput
