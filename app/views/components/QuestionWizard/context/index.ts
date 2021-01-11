import React from 'react'

export interface IContextState {
  currentStep: number
  lastVisitedStep: number
  totalSteps: number
  goto: (step: number) => void
  next: (
    delay?: number | ((resolve: () => void, reject: () => void) => void)
  ) => void
  previous: () => void
  first: () => void
  last: () => void
}

export const Context = React.createContext<IContextState | undefined>(undefined)
