import React, { createContext } from 'react'

import { EmailFormValues } from 'components/EmailCompose'
import { FormValues } from 'deals/Signature/types'

import { initialState } from './reducers'

export type DealTaskActionsDispatchContext = React.Dispatch<any>

export interface DealTaskActionsStateContext {
  type: string
  actions: ActionButtonId[]
  attachments: IDealFile[]
  form?: EmailFormValues | FormValues
  tasks?: IDealTask[]
  buttons?: (state: DealTaskActionsStateContext) => React.ReactNode[]
  isDrawerOpen: boolean
  mode: {
    type: Nullable<'View/Print' | 'Docusign'>
    taskId: Nullable<UUID>
  }
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const StateContext =
  createContext<DealTaskActionsStateContext>(initialState)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DispatchContext = createContext<DealTaskActionsDispatchContext>(
  () => null
)
