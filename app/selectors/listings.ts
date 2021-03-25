import { IAppState } from 'reducers'
import { getIsFavorite } from 'reducers/listings/favorites'

/**
 * Returns the entire favorited items
 * @param state The app state
 * @returns The favorited list
 */
export const selectFavorites = (state: IAppState) => state.favorites

/**
 * Returns the entire favorited listings
 * @param state The app state
 * @returns The favorited listings list
 */
export const selectFavoriteListings = (state: IAppState) =>
  state.favorites.listings

/**
 * Returns true if listing is favorited and false if it's not
 * @param state The app state
 */

export const selectListingIsFavorited = (state: IAppState, listingId: UUID) => {
  return getIsFavorite(selectFavoriteListings(state), listingId)
}
