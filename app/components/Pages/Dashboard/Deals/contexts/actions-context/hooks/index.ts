import { useContext } from 'react'

import { StateContext, DispatchContext } from '..'

export function useChecklistActionsContext(): [StateContext, DispatchContext] {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  return [state, dispatch]
}
