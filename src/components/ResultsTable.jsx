import React, { useState } from 'react'

function ResultsTable({ data, columns, parameters, getStratumColor, getClusterColor }) {
  const [isFullScreen, setIsFullScreen] = useState(false)

  return (
    <div
      className={`${
        isFullScreen
          ? 'fixed inset-0 bg-white z-50 p-6 overflow-auto'
          : 'relative'
      }`}
    >
      {/* Header + Controls */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-900">Sampled Data</h3>
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="btn-secondary"
        >
          {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
        </button>
      </div>

      {/* Table */}
      <div
        className={`overflow-x-auto ${
          isFullScreen ? 'max-h-[80vh]' : 'max-h-[400px]'
        } border border-gray-300 rounded-lg`}
      >
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                #
              </th>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-blue-50 animate-fade-in"
                style={{ animationDelay: `${rowIndex * 50}ms` }}
              >
                <td className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">
                  {rowIndex + 1}
                </td>
                {columns.map((col, colIndex) => {
                  const value = row[col]
                  let cellClasses =
                    'border border-gray-300 px-3 py-2 text-sm text-gray-900'

                  if (col === parameters.strataColumn && parameters.strataColumn) {
                    cellClasses += ` ${getStratumColor(value)} border-2 font-medium`
                  } else if (col === parameters.clusterColumn && parameters.clusterColumn) {
                    cellClasses += ` ${getClusterColor(value)} border-2 font-medium`
                  }

                  return (
                    <td key={colIndex} className={cellClasses}>
                      {value}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResultsTable
