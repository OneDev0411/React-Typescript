import { useEffect, useRef } from 'react'

import useThunkReducer, { Thunk } from 'react-hook-thunk-reducer'
import { useSelector } from 'react-redux'

import useNotify from '@app/hooks/use-notify'
import api from '@app/models/listings/search'
import { normalizeListingLocation } from '@app/utils/map'
import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'

import { PROPOSED_AGENT_ZOOM_LEVEL, QUERY_LIMIT } from '../../helpers/constants'
import { formatListing } from '../../helpers/format-listing'
import {
  createValertOptions,
  createValertQueryString
} from '../../helpers/get-listings-helpers'
import { Actions, setListings, setIsLoading } from '../context/actions'
import { reducer, initialState, ListingsState } from '../context/reducers'

export type ListingsContext = [
  ListingsState,
  React.Dispatch<Actions | Thunk<ListingsState, Actions>>
]

export default function useFetchListings(
  userInitialState: Partial<ListingsState>
): ListingsContext {
  const notify = useNotify()

  const [state, dispatch] = useThunkReducer(reducer, {
    ...initialState,
    ...userInitialState
  })

  const brand = useSelector<IAppState, IBrand>(({ brand }) => brand)
  const user = useSelector(selectUser)

  // TO fix calling GoogleMap onChange at initialization
  // https://github.com/google-map-react/google-map-react/blob/master/DOC.md
  const isInitCall = useRef(true)

  // Upon each change in search we fetch new results
  useEffect(() => {
    async function fetchResults() {
      // TODO: remove this log
      console.log(
        "Some params in search changed. Let's fetch new results!",
        state.search
      )

      /* if state.search.drawing is present
       *  it means user has drawn a polygon, so we search in that area only
       *  having a drawing always takes precedence over `bounds` if they're both set.
       *  Consider the case where user has set a drawing on map and search results
       *  are shown for that area, then user pans/zooms map, we should not search
       *  for the newly set `bounds` and instead should wait until user clicks on
       *  `remove drawing` then we can use latest `bounds` that are set.
       */
      dispatch(setIsLoading(true))

      const valertQueryString = createValertQueryString(
        state.map.zoom,
        PROPOSED_AGENT_ZOOM_LEVEL,
        brand
      )
      const valertOptions = createValertOptions(state.search, null, QUERY_LIMIT)

      const response = await api.getListings.byValert(
        valertOptions,
        valertQueryString
      )

      const listings = response.entities.listings
        ? Object.values(response.entities.listings).map(listing =>
            formatListing(
              normalizeListingLocation(listing) as ICompactListing,
              user
            )
          )
        : []

      // Display a warning if there are too many results
      if (response.info?.total > QUERY_LIMIT) {
        notify({
          status: 'warning',
          message: `We can show max ${QUERY_LIMIT} listings. Please zoom in or set more filters.`,
          options: { id: 'properties-too-much-response-warning' }
        })
      }

      dispatch(setListings(listings, response.info))
      dispatch(setIsLoading(false))
    }

    // Prevent fetchResults on initialCall to fix calling GoogleMap onChange at initialization.
    if (!isInitCall.current) {
      fetchResults()
    } else {
      isInitCall.current = false
    }

    // Because we already has state.search.bounds on the deps list,
    // We don't need to call fetchResults() on every state.map.zoom change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.search, dispatch, brand])

  return [state, dispatch]
}
