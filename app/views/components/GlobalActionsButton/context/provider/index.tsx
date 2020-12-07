import React, { useReducer, ReactNode } from 'react'

import { reducer, initialState } from '../reducers'

import { StateContext, DispatchContext } from '..'

interface Props {
  children: ReactNode
}

export const GlobalActionProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}
