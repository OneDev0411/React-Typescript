import { useContext } from 'react'

import { Context, IContextState } from '../context'

export function useWizardForm(): IContextState {
  return useContext(Context) as IContextState
}
