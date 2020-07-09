import React, { useReducer } from 'react'

import { reducer, initialState } from '../reducers'
import { StateContext, DispatchContext } from '..'

interface Props {
  children: React.ReactNode
}

export function ActionContextProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}
