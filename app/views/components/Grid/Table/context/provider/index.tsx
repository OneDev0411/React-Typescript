import React, { useReducer } from 'react'

import { reducer, initialState } from '../reducers'

import { StateContext, DispatchContext } from '..'

interface Props<Row> {
  children: React.ReactNode
}

export function GridContextProvider<Row>({ children }: Props<Row>) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}
