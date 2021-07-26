import { createContext } from 'react'

import { ActiveSort } from '../types'

import { initialState } from './reducers'

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
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const StateContext = createContext<StateContext>(initialState)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DispatchContext = createContext<DispatchContext>(() => null)
