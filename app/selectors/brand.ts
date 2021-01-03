import { IAppState } from 'reducers'
import { getActiveBrand } from 'utils/user-teams'

import { selectUser } from './user'

/**
 * Finds the active brand for current user if exists
 * @param state The app state
 * @returns The current user active brand if available or null
 */
export const selectActiveBrandUnsafe = (state: IAppState) =>
  getActiveBrand(selectUser(state))

/**
 * Returns the active brand or throws and error if it does not exist
 * @param state The app state
 * @returns The active brand for current user
 */
export const selectActiveBrand = (state: IAppState) => {
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
export const selectActiveBrandId = (state: IAppState) =>
  selectActiveBrand(state).id
