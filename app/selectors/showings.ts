import type { IAppState } from 'reducers'
import type { IShowingsState } from 'reducers/showings'

function selectShowings(state: IAppState): IShowingsState {
  return state.showings
}

export function selectShowingsTotalNotificationCount(
  state: IAppState
): Nullable<number> {
  return selectShowings(state).totalNotificationCount
}
