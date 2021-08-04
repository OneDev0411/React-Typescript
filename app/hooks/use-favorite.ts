import { useSelector, useDispatch } from 'react-redux'

import toggleFavorite from 'actions/listings/favorites/toggle-favorite'
import { useListSelection } from 'components/ListSelection/use-list-selection'
import { IAppState } from 'reducers'
import { getIsFavorite } from 'reducers/listings/favorites'

export function useFavorite(listing: IListing | ICompactListing) {
  const dispatch = useDispatch()
  const favorites = useSelector((state: IAppState) => state.favorites)
  const { selections, toggleItem } = useListSelection()

  const toggleHnadler = () => dispatch(toggleFavorite(listing))
  const selected = selections.some(
    (item: ICompactListing) => item.id === listing.id
  )

  const isFavorited = getIsFavorite(favorites.listings, listing.id)

  if (selected && isFavorited) {
    toggleItem(listing)
  }

  return { isFavorited, toggleFavorite: toggleHnadler }
}
