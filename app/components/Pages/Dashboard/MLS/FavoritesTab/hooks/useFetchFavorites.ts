import useThunkReducer, { Thunk } from 'react-hook-thunk-reducer'
import { useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'

import useNotify from '@app/hooks/use-notify'
import { getFavoritesCompactListings } from '@app/models/listings/favorites/getFavoritesCompactListings'
import { selectUser } from '@app/selectors/user'

import { Actions, setListings, setIsLoading } from '../context/actions'
import { reducer, initialState, FavoritesState } from '../context/reducers'

export type FavoritesContext = [
  FavoritesState,
  React.Dispatch<Actions | Thunk<FavoritesState, Actions>>
]

export default function useFetchFavorites(
  userInitialState: Partial<FavoritesState> = {}
): FavoritesContext {
  const [state, dispatch] = useThunkReducer(reducer, {
    ...initialState,
    ...userInitialState
  })

  const notify = useNotify()
  const user = useSelector(selectUser)

  // Get favorites from the server on mount
  useEffectOnce(() => {
    async function fetchResults() {
      dispatch(setIsLoading(true))

      try {
        const response = await getFavoritesCompactListings(user)

        const listings = response.entities.listings
          ? Object.values(response.entities.listings)
          : []

        // TODO: Calculate zoom and center of the map based on the listings using fitBounds

        dispatch(setListings(listings, response.info))
      } catch (error) {
        notify({
          message: 'A server error occurred and admin has been notified.',
          status: 'error'
        })
        console.log(error)
        dispatch(setListings([], { count: 0, proposed_title: '', total: 0 }))
      }

      dispatch(setIsLoading(false))
    }

    fetchResults()
  })

  return [state, dispatch]
}
