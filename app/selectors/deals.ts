import { IAppState } from 'reducers'

/**
 * Returns the entire deals object from store
 * @param state The app state
 */
export const selectDeals = (state: IAppState) => state.deals

/**
 * Returns the deals list
 * @param state The app state
 */
export function selectDealsList(state: IAppState): Record<UUID, IDeal> {
  return selectDeals(state).list
}

/**
 * Get the deal roles object
 * @param state The app state
 * @param deal The deal
 * @returns the deal roles
 */
export function selectDealRoles(state: IAppState): Record<UUID, IDealRole> {
  return selectDeals(state).roles
}
