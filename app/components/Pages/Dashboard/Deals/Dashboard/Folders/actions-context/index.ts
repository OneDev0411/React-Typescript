import { createContext } from 'react'

import { initialState } from './reducers'

export type DispatchContext = React.Dispatch<any>

export interface StateContext {
  actions: ActionButtonId[]
  attachments: IDealFile[]
}

export const StateContext = createContext<StateContext>(initialState)
export const DispatchContext = createContext<DispatchContext>(() => null)
