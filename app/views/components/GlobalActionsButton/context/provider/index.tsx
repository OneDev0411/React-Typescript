import React, { useReducer, ReactNode } from 'react'

import { StateContext, DispatchContext } from '..'
import { reducer, initialState } from '../reducers'

interface Props {
  children: ReactNode
}

export const GlobalActionsProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}
