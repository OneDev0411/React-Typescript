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
export const selectDealsList = (state: IAppState) => selectDeals(state).list
