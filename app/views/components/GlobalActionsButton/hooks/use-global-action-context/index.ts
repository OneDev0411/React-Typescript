import { useContext } from 'react'

import { StateContext, DispatchContext } from '../../context'

export function useGlobalActionContext(): [StateContext, DispatchContext] {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  return [state, dispatch]
}
