import React, { useState, useEffect } from 'react'

function Parameters({ appState, updateAppState }) {
  const [parameters, setParameters] = useState({
    sampleSize: '',
    samplePercentage: '',
    usePercentage: false,
    strataColumn: '',
    allocationType: 'proportional',
    clusterColumn: '',
    stepSize: '',
    randomSeed: Math.floor(Math.random() * 10000)
  })

  const columns = appState.data ? Object.keys(appState.data[0]) : []

  useEffect(() => {
    // Set default strata/cluster columns if they exist
    if (columns.length > 0) {
      const defaultStrata = columns.find(col => 
        col.toLowerCase().includes('strata') || 
        col.toLowerCase().includes('stratum') ||
        col.toLowerCase().includes('group')
      )
      const defaultCluster = columns.find(col => 
        col.toLowerCase().includes('cluster') || 
        col.toLowerCase().includes('region') ||
        col.toLowerCase().includes('city')
      )
      
      setParameters(prev => ({
        ...prev,
        strataColumn: defaultStrata || columns[0],
        clusterColumn: defaultCluster || columns[0]
      }))
    }
  }, [columns])

  const handleParameterChange = (key, value) => {
    const newParams = { ...parameters, [key]: value }
    setParameters(newParams)
    
    // Update app state with valid parameters
    const validParams = {}
    if (newParams.sampleSize || newParams.samplePercentage) {
      validParams.sampleSize = newParams.sampleSize
      validParams.samplePercentage = newParams.samplePercentage
      validParams.usePercentage = newParams.usePercentage
    }
    
    if (['stratified', 'multi-stage'].includes(appState.selectedMethod)) {
      validParams.strataColumn = newParams.strataColumn
      validParams.allocationType = newParams.allocationType
    }
    
    if (['cluster', 'multi-stage'].includes(appState.selectedMethod)) {
      validParams.clusterColumn = newParams.clusterColumn
    }
    
    if (appState.selectedMethod === 'systematic') {
      validParams.stepSize = newParams.stepSize
    }
    
    validParams.randomSeed = newParams.randomSeed
    
    updateAppState({ parameters: validParams })
  }

  const calculateSampleSize = () => {
    if (parameters.usePercentage && parameters.samplePercentage) {
      const percentage = parseFloat(parameters.samplePercentage) / 100
      return Math.ceil(appState.data.length * percentage)
    }
    return parameters.sampleSize ? parseInt(parameters.sampleSize) : null
  }

  const renderSampleSizeInput = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Size</h3>
  
      {/* Radio buttons */}
      <div className="flex items-center space-x-4 mb-4">
        <label className="flex items-center">
          <input
            type="radio"
            checked={!parameters.usePercentage}
            onChange={() => handleParameterChange("usePercentage", false)}
            className="mr-2"
          />
          Sample Size (count)
        </label>
  
        <label className="flex items-center">
          <input
            type="radio"
            checked={parameters.usePercentage}
            onChange={() => handleParameterChange("usePercentage", true)}
            className="mr-2"
          />
          Sample Percentage
        </label>
      </div>
  
      {/* Count Input */}
      {!parameters.usePercentage ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sample Size:
          </label>
  
          <input
            type="number"
            min={1}
            max={appState.data?.length || 1}
            value={parameters.sampleSize}
            onChange={(e) => {
              const raw = e.target.value
  
              // Allow deletion (empty string)
              if (raw === "") {
                handleParameterChange("sampleSize", "")
                return
              }
  
              const max = appState.data?.length || 1
              const num = Math.min(Number(raw), max)
  
              handleParameterChange("sampleSize", num)
            }}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Max: ${appState.data?.length || 0}`}
          />
        </div>
      ) : (
        // Percentage Input
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sample Percentage (%):
          </label>
  
          <input
            type="number"
            min={0.1}
            max={100}
            step={0.1}
            value={parameters.samplePercentage}
            onChange={(e) => {
              const raw = e.target.value
  
              // Allow deletion
              if (raw === "") {
                handleParameterChange("samplePercentage", "")
                return
              }
  
              const num = Math.min(Number(raw), 100)
              handleParameterChange("samplePercentage", num)
            }}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 20"
          />
        </div>
      )}
  
      {/* Preview */}
      {calculateSampleSize() > 0 && (
        <p className="text-sm text-gray-600 mt-2">
          Actual sample size: <strong>{calculateSampleSize()}</strong> items
        </p>
      )}
    </div>
  )  

  const renderStratifiedParams = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Stratified Sampling Parameters</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Strata Column:
        </label>
        <select
          value={parameters.strataColumn}
          onChange={(e) => handleParameterChange('strataColumn', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {columns.map(col => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Allocation Type:
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              checked={parameters.allocationType === 'proportional'}
              onChange={() => handleParameterChange('allocationType', 'proportional')}
              className="mr-2"
            />
            Proportional (sample size proportional to stratum size)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={parameters.allocationType === 'equal'}
              onChange={() => handleParameterChange('allocationType', 'equal')}
              className="mr-2"
            />
            Equal (equal sample size from each stratum)
          </label>
        </div>
      </div>
    </div>
  )

  const renderClusterParams = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cluster Sampling Parameters</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cluster Column:
        </label>
        <select
          value={parameters.clusterColumn}
          onChange={(e) => handleParameterChange('clusterColumn', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {columns.map(col => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      </div>
    </div>
  )

  const renderSystematicParams = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Systematic Sampling Parameters</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Step Size (k):
        </label>
        <input
          type="number"
          min="1"
          value={parameters.stepSize}
          onChange={(e) => handleParameterChange('stepSize', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., 5 (every 5th item)"
        />
        <p className="text-sm text-gray-600 mt-1">
          Leave empty to calculate automatically based on sample size
        </p>
      </div>
    </div>
  )

  const renderRandomSeed = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Randomization</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Random Seed (for reproducibility):
        </label>
        <input
          type="number"
          value={parameters.randomSeed}
          onChange={(e) => handleParameterChange('randomSeed', parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-600 mt-1">
          Use the same seed to get reproducible results
        </p>
      </div>
    </div>
  )

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Set Sampling Parameters
      </h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 text-center">
          <strong>Method:</strong> {appState.selectedMethod?.toUpperCase()} | 
          <strong> Population Size:</strong> {appState.data?.length || 0} items
        </p>
      </div>

      {/* Sample Size Input */}
      {renderSampleSizeInput()}

      {/* Method-specific Parameters */}
      {['stratified', 'multi-stage'].includes(appState.selectedMethod) && renderStratifiedParams()}
      {['cluster', 'multi-stage'].includes(appState.selectedMethod) && renderClusterParams()}
      {appState.selectedMethod === 'systematic' && renderSystematicParams()}

      {/* Random Seed */}
      {renderRandomSeed()}

      {/* Summary */}
      {calculateSampleSize() && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Ready to Sample!</h3>
          <p className="text-green-700">
            Will select <strong>{calculateSampleSize()}</strong> items from a population of{' '}
            <strong>{appState.data?.length || 0}</strong> using {appState.selectedMethod} method.
          </p>
        </div>
      )}
    </div>
  )
}

export default Parameters
