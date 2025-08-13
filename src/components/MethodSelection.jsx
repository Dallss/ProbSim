import React from 'react'

const SAMPLING_METHODS = [
  {
    id: 'srs',
    name: 'Simple Random Sampling (SRS)',
    description: 'Each item has an equal probability of being selected',
    icon: '🎲',
    tooltip: 'Every member of the population has an equal and independent chance of being selected. This is the most basic form of probability sampling.'
  },
  {
    id: 'systematic',
    name: 'Systematic Sampling (SS)',
    description: 'Select items at regular intervals from a sorted list',
    icon: '📏',
    tooltip: 'Items are selected at regular intervals from a sorted population. The first item is randomly selected, then every kth item is chosen.'
  },
  {
    id: 'stratified',
    name: 'Stratified Sampling',
    description: 'Divide population into strata and sample from each',
    icon: '📊',
    tooltip: 'The population is divided into homogeneous subgroups (strata) and samples are taken from each stratum. Can use equal or proportional allocation.'
  },
  {
    id: 'cluster',
    name: 'Cluster Sampling',
    description: 'Select clusters and sample all items within selected clusters',
    icon: '🏘️',
    tooltip: 'The population is divided into clusters, some clusters are randomly selected, and all items within selected clusters are included in the sample.'
  },
  {
    id: 'multi-stage',
    name: 'Multi-stage Sampling',
    description: 'Two-stage: Stage 1 stratified, Stage 2 SRS',
    icon: '🔄',
    tooltip: 'A complex sampling method where sampling is done in stages. Stage 1 uses stratified sampling to select clusters, Stage 2 uses simple random sampling within selected clusters.'
  }
]

function MethodSelection({ appState, updateAppState }) {
  const handleMethodSelect = (methodId) => {
    updateAppState({ selectedMethod: methodId })
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
      });
    }, 300); 
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Choose Your Sampling Method
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLING_METHODS.map((method) => (
          <div
            key={method.id}
            className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${
              appState.selectedMethod === method.id
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleMethodSelect(method.id)}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{method.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {method.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {method.description}
              </p>
              
              {/* Tooltip */}
              <div className="group relative">
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-sm cursor-help">
                  i
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-normal w-64 z-10">
                  {method.tooltip}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {appState.selectedMethod && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800 text-center">
            <strong>Selected:</strong> {SAMPLING_METHODS.find(m => m.id === appState.selectedMethod)?.name}
          </p>
        </div>
      )}
    </div>
  )
}

export default MethodSelection
