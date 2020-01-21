import React, { useReducer } from 'react'

import { reducer, initialState } from '../reducers'

import { GridSortingOption } from '../../types'

import { StateContext, DispatchContext } from '..'

interface Props<Row> {
  sorting?: GridSortingOption | null
  children: React.ReactNode
}

export function GridContextProvider<Row>({ children, sorting }: Props<Row>) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}
