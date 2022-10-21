import { useContext } from 'react'

import {
  StateContext,
  DispatchContext,
  DealTaskActionsDispatchContext,
  DealTaskActionsStateContext
} from '..'

export function useChecklistActionsContext(): [
  DealTaskActionsStateContext,
  DealTaskActionsDispatchContext
] {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  return [state, dispatch]
}
