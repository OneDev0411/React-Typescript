import type { IAppState } from 'reducers'
import type { IGlobalTriggerState } from 'reducers/global-triggers'

export function selectGlobalTriggers(state: IAppState): IGlobalTriggerState {
  return state.globalTriggers
}

export function selectIsGlobalTriggersLoading(state: IAppState): boolean {
  return selectGlobalTriggers(state).isLoading
}

export function selectGlobalTriggersAttributes(
  state: IAppState
): IGlobalTriggerState['attrs'] {
  return selectGlobalTriggers(state).attrs
}
