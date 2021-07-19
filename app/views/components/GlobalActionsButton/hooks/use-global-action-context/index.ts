import { useContext } from 'react'

import {
  StateContext,
  DispatchContext,
  StateContextType,
  DispatchContextType
} from '../../context'

export function useGlobalActionContext(): [
  StateContextType,
  DispatchContextType
] {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  return [state, dispatch]
}
