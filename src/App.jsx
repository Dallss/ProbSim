import React, { useState } from 'react'
import MethodSelection from './components/MethodSelection'
import DataInput from './components/DataInput'
import Parameters from './components/Parameters'
import Results from './components/Results'
import StepIndicator from './components/StepIndicator'
import Header from './components/Header'

const STEPS = [
  { id: 1, title: 'Choose Method', component: MethodSelection },
  { id: 2, title: 'Input Data', component: DataInput },
  { id: 3, title: 'Set Parameters', component: Parameters },
  { id: 4, title: 'View Results', component: Results }
]

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [appState, setAppState] = useState({
    selectedMethod: null,
    data: null,
    parameters: {},
    results: null
  })

  const updateAppState = (updates) => {
    setAppState(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetApp = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset the app? This will lose all your current data and return you to the first step.'
    )
    
    if (confirmed) {
      setCurrentStep(1)
      setAppState({
        selectedMethod: null,
        data: null,
        parameters: {},
        results: null
      })
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return appState.selectedMethod !== null
      case 2:
        return appState.data !== null && appState.data.length > 0
      case 3:
        return Object.keys(appState.parameters).length > 0
      default:
        return true
    }
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <Header />

        {/* Step Indicator */}
        <StepIndicator 
          steps={STEPS} 
          currentStep={currentStep} 
          className="mb-8"
        />

        {/* Main Content */}
        <div className="card">
          <CurrentStepComponent
            appState={appState}
            updateAppState={updateAppState}
            onNext={nextStep}
            onPrev={prevStep}
            canProceed={canProceed()}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          
          <button
            onClick={currentStep === STEPS.length ? resetApp : nextStep}
            disabled={currentStep === STEPS.length ? false : !canProceed()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === STEPS.length ? 'Finish' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
