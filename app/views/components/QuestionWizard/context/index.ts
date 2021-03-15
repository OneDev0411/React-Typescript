import React from 'react'

export interface IContextState {
  currentStep: number
  lastVisitedStep: number
  totalSteps: number
  goto: (step: number) => void
  next: (delay?: number) => void
  previous: () => void
  first: () => void
  last: () => void
  setShowLoading: (state: boolean) => void
  formWidth: number | string
}

export const Context = React.createContext<IContextState | undefined>(undefined)
