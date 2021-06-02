import React from 'react'

export interface IWizardState {
  currentStep: number
  lastVisitedStep: number
  totalSteps: number
  isLoading: boolean
  goto: (step: number) => void
  next: (delay?: number) => void
  setStep: (step: number) => void
  setLoading: (status: boolean) => void
  previous: () => void
  first: () => void
  last: () => void
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

export const SectionErrorContext = React.createContext<string | undefined>(
  undefined
)
