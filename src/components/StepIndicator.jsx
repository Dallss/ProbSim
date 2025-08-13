import React from 'react'

function StepIndicator({ steps, currentStep, className = '' }) {
  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isCompleted = step.id < currentStep
        const isPending = step.id > currentStep
        
        let stepClass = 'step-pending'
        if (isActive) stepClass = 'step-active'
        else if (isCompleted) stepClass = 'step-completed'
        
        return (
          <div key={step.id} className="flex items-center">
            <div className={`step-indicator ${stepClass}`}>
              {isCompleted ? '✓' : step.id}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              isActive ? 'text-blue-600' : 
              isCompleted ? 'text-green-600' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className="w-8 h-px bg-gray-300 mx-4"></div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default StepIndicator
