import { useContext } from 'react'

import { StateContext, DispatchContext } from '../../context'

export function useGridContext(): [StateContext, DispatchContext] {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  return [state, dispatch]
}
