import React, { createContext, useReducer } from 'react'

interface StateContext {
  selections: []
}

type DispatchContext = React.Dispatch<any>

const StateContext = createContext<StateContext>({
  selections: []
})

const DispatchContext = createContext<DispatchContext>(() => null)

interface Props<T> {
  children: React.ReactNode
}

export function ShareContextProvider<T>({ children }: Props<T>) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}
