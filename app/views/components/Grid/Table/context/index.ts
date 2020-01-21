import { createContext } from 'react'

import { initialState } from './reducers'
import { ActiveSort } from '../types'

export interface StateContext {
  selection: {
    selectedRowIds: string[]
    excludedRows: string[]
    isAllRowsSelected: boolean
    isEntireRowsSelected: boolean
  }
  sorting: {
    columns: string[]
    defaultIndex: null
    activeSort: ActiveSort | null
  }
}

export type DispatchContext = React.Dispatch<any>
export const StateContext = createContext<StateContext>(initialState)
export const DispatchContext = createContext<DispatchContext>(() => null)
