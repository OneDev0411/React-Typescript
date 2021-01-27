import React from 'react'

export interface IWizardState {
  currentStep: number
  lastVisitedStep: number
  totalSteps: number
  goto: (step: number) => void
  next: (delay?: number) => void
  previous: () => void
  first: () => void
  last: () => void
  setShowLoading: (state: boolean) => void
}

export interface IWizardSectionState {
  step: number
}

export const WizardContext = React.createContext<IWizardState | undefined>(
  undefined
)

export const SectionContext = React.createContext<
  IWizardSectionState | undefined
>(undefined)
