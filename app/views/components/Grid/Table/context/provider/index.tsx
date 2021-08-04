import React, { useReducer } from 'react'

import { StateContext, DispatchContext } from '..'
import { reducer, initialState } from '../reducers'

interface Props {
  children: React.ReactNode
}

export function GridContextProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}
