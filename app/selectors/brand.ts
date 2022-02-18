import { IAppState } from 'reducers'
import flattenBrand from 'utils/flatten-brand'

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
 * Returns the active brand or throws an error if it does not exist
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
 * Returns the active brand id for the current user if exists
 * @param state The app state
 * @returns The active brand id
 */
export function selectActiveBrandIdUnsafe(state: IAppState): Nullable<UUID> {
  return selectActiveBrandUnsafe(state)?.id ?? null
}

/**
 * Returns the active brand id for current user or throws an error if it does not exist
 * @param state The app state
 * @returns The active brand id
 */
export function selectActiveBrandId(state: IAppState): UUID {
  const activeBrandId = selectActiveBrandIdUnsafe(state)

  if (!activeBrandId) {
    throw new Error('The current user does not have an active brand')
  }

  return activeBrandId
}

/**
 * Returns the active brand setting for current user
 * @param state The app state
 * @param includesParents indicate that parent setting should be include or not
 * @returns The active brand setting
 */
export function selectActiveBrandSettings(
  state: IAppState,
  includesParents: boolean = false
): StringMap<any> {
  const activeBrand = selectActiveBrandUnsafe(state)

  if (!activeBrand) {
    return {}
  }

  let settings: StringMap<any> | null | undefined = activeBrand.settings

  if (includesParents) {
    let brand = flattenBrand(activeBrand)

    settings = brand?.settings
  }

  return settings || {}
}
