import { useSelector, useDispatch } from 'react-redux'

import { IAppState } from 'reducers'
import { getIsFavorite } from 'reducers/listings/favorites'
import toggleFavorite from 'actions/listings/favorites/toggle-favorite'

export function useFavorite(listing: IListing | ICompactListing) {
  const dispatch = useDispatch()
  const favorites = useSelector((state: IAppState) => state.favorites)

  const toggleHnadler = () => dispatch(toggleFavorite(listing))
  const isFavorited = getIsFavorite(favorites.listings, listing.id)

  return { isFavorited, toggleFavorite: toggleHnadler }
}
