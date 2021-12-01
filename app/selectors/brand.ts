import { IAppState } from 'reducers'

import { selectActiveTeamUnsafe } from './team'

/**
 * Finds the active brand for current user if exists
 * @param state The app state
 * @returns The current user active brand if available or null
 */
export function selectActiveBrandUnsafe(state: IAppState): Nullable<IBrand> {
  return selectActiveTeamUnsafe(state)?.brand || null
}

/**
 * Returns the active brand or throws and error if it does not exist
 * @param state The app state
 * @returns The active brand for current user
 */
export function selectActiveBrand(state: IAppState): IBrand {
  const brand = selectActiveBrandUnsafe(state)

  if (!brand) {
    throw new Error('There is no active brand for the current user')
  }

  return brand
}

/**
 * Returns the active brand id for current user
 * @param state The app state
 * @returns The active brand id
 */
export function selectActiveBrandId(state: IAppState): UUID {
  return selectActiveBrand(state).id
}
