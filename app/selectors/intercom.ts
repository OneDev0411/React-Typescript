import type { IAppState } from 'reducers'
import type { IIntercomState } from 'reducers/intercom'

export function selectIntercom(state: IAppState): IIntercomState {
  return state.intercom
}
