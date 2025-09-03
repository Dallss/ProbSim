import React, { useState, useEffect } from 'react'
import { performSampling } from '../utils/samplingMethods'
import { saveAs } from 'file-saver'
import ResultsTable from './ResultsTable' // <-- import the new table component

function Results({ appState, updateAppState }) {
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (appState.data && appState.parameters && appState.selectedMethod) {
      performSamplingAndUpdate()
    }
  }, [])

  const performSamplingAndUpdate = () => {
    try {
      setIsLoading(true)
      setError(null)

      const sampledData = performSampling(
        appState.data,
        appState.selectedMethod,
        appState.parameters
      )

      const resultsData = {
        method: appState.selectedMethod,
        populationSize: appState.data.length,
        sampleSize: sampledData.length,
        parameters: appState.parameters,
        sampledData,
        timestamp: new Date().toISOString(),
      }

      setResults(resultsData)
      updateAppState({ results: resultsData })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadResults = () => {
    if (!results) return

    const csvContent = convertToCSV(results.sampledData)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
    saveAs(
      blob,
      `sampling_results_${results.method}_${new Date()
        .toISOString()
        .split('T')[0]}.csv`
    )
  }

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return ''

    const headers = Object.keys(data[0])
    const csvRows = [headers.join(',')]

    data.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header]
        return typeof value === 'string' && value.includes(',')
          ? `"${value}"`
          : value
      })
      csvRows.push(values.join(','))
    })

    return csvRows.join('\n')
  }

  const printResults = () => {
    if (!results) return

    const csvContent = convertToCSV(results.sampledData)

    const printWindow = window.open('', '_blank', 'width=800,height=600')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sampling Results - ${results.method.toUpperCase()}</title>
          <style>
            body { font-family: monospace; font-size: 12px; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .summary { margin-bottom: 20px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Sampling Results</h1>
            <p><strong>Method:</strong> ${results.method.toUpperCase()}</p>
            <p><strong>Population Size:</strong> ${results.populationSize}</p>
            <p><strong>Sample Size:</strong> ${results.sampleSize}</p>
            <p><strong>Sampling Rate:</strong> ${(
              (results.sampleSize / results.populationSize) *
              100
            ).toFixed(1)}%</p>
            <p><strong>Timestamp:</strong> ${new Date(
              results.timestamp
            ).toLocaleString()}</p>
          </div>

          <div class="summary">
            <h2>Sampled Data</h2>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                ${Object.keys(results.sampledData[0] || {})
                  .map((col) => `<th>${col}</th>`)
                  .join('')}
              </tr>
            </thead>
            <tbody>
              ${results.sampledData
                .map(
                  (row, index) => `
                <tr>
                  <td>${index + 1}</td>
                  ${Object.keys(row)
                    .map((col) => `<td>${row[col]}</td>`)
                    .join('')}
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()">Print Results</button>
            <button onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  const getStratumColor = (stratum) => {
    const colors = {
      A: 'bg-blue-100 text-blue-800 border-blue-200',
      B: 'bg-green-100 text-green-800 border-green-200',
      C: 'bg-purple-100 text-purple-800 border-purple-200',
    }
    return colors[stratum] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getClusterColor = (cluster) => {
    const colors = [
      'bg-red-100 text-red-800 border-red-200',
      'bg-yellow-100 text-yellow-800 border-yellow-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-teal-100 text-teal-800 border-teal-200',
    ]
    const index = cluster.toString().charCodeAt(0) % colors.length
    return colors[index]
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Performing sampling...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-red-800 mb-2">Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={performSamplingAndUpdate} className="btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No results available</p>
      </div>
    )
  }

  const columns = Object.keys(results.sampledData[0] || {})

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Sampling Results
      </h2>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {results.populationSize}
            </div>
            <div className="text-sm text-blue-800">Population Size</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-600">
              {results.sampleSize}
            </div>
            <div className="text-sm text-indigo-800">Sample Size</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {(
                (results.sampleSize / results.populationSize) *
                100
              ).toFixed(1)}
              %
            </div>
            <div className="text-sm text-purple-800">Sampling Rate</div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-blue-200">
            Method: {results.method.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <button onClick={downloadResults} className="btn-primary flex items-center">
          📥 Download CSV
        </button>
        <button onClick={printResults} className="btn-secondary flex items-center">
          🖨️ Print Results
        </button>
      </div>

      {/* Results Table (now abstracted) */}
      <ResultsTable
        data={results.sampledData}
        columns={columns}
        parameters={results.parameters}
        getStratumColor={getStratumColor}
        getClusterColor={getClusterColor}
      />

      {/* Pagination Info */}
      {(
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing 1–10 of {results.sampledData.length} results.
        </div>
      )}

      {/* Color Legend */}
      {(results.parameters.strataColumn || results.parameters.clusterColumn) && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Color Legend
          </h3>
          <div className="flex flex-wrap gap-4">
            {results.parameters.strataColumn && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Strata ({results.parameters.strataColumn})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Set(
                      results.sampledData.map(
                        (item) => item[results.parameters.strataColumn]
                      )
                    )
                  ).map((stratum) => (
                    <span
                      key={stratum}
                      className={`px-2 py-1 rounded text-xs font-medium border ${getStratumColor(
                        stratum
                      )}`}
                    >
                      {stratum}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {results.parameters.clusterColumn && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Clusters ({results.parameters.clusterColumn})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Set(
                      results.sampledData.map(
                        (item) => item[results.parameters.clusterColumn]
                      )
                    )
                  ).map((cluster) => (
                    <span
                      key={cluster}
                      className={`px-2 py-1 rounded text-xs font-medium border ${getClusterColor(
                        cluster
                      )}`}
                    >
                      {cluster}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Method Details */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Sampling Method Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Method:</strong> {results.method.toUpperCase()}
          </div>
          <div>
            <strong>Random Seed:</strong> {results.parameters.randomSeed}
          </div>
          {results.parameters.strataColumn && (
            <div>
              <strong>Strata Column:</strong> {results.parameters.strataColumn}
            </div>
          )}
          {results.parameters.clusterColumn && (
            <div>
              <strong>Cluster Column:</strong> {results.parameters.clusterColumn}
            </div>
          )}
          {results.parameters.allocationType && (
            <div>
              <strong>Allocation:</strong> {results.parameters.allocationType}
            </div>
          )}
          <div>
            <strong>Timestamp:</strong>{' '}
            {new Date(results.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results
