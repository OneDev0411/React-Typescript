import { useContext } from 'react'

import { WizardContext, IWizardState } from '../context'

export function useWizardContext(): IWizardState {
  return useContext(WizardContext) as IWizardState
}
