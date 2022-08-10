import { useEffect, useRef } from 'react'

import useThunkReducer, { Thunk } from 'react-hook-thunk-reducer'
import { useSelector } from 'react-redux'
import { useDebounce } from 'use-debounce'

import {
  createValertOptions,
  createValertQueryString
} from '@app/components/Pages/Dashboard/MLS/helpers/get-listings-helpers'
import useNotify from '@app/hooks/use-notify'
import api from '@app/models/listings/search'
import { IAppState } from 'reducers'

import {
  PROPOSED_AGENT_ZOOM_LEVEL,
  QUERY_LIMIT,
  SEARCH_DEBOUNCE_MS
} from '../../constants'
import { logSearchListings } from '../../helpers/log-search-listings'
import { stringifyFilters } from '../../helpers/stringifyFilters'
import { Actions, setListings, setIsLoading } from '../context/actions'
import { reducer, initialState, ListingsState } from '../context/reducers'

export type ListingsContext = [
  ListingsState,
  React.Dispatch<Actions | Thunk<ListingsState, Actions>>
]

export default function useFetchListings(
  userInitialState: Partial<ListingsState>
): ListingsContext {
  const [state, dispatch] = useThunkReducer(reducer, {
    ...initialState,
    ...userInitialState
  })
  const notify = useNotify()
  const brand = useSelector<IAppState, IBrand>(({ brand }) => brand)

  // TO fix calling GoogleMap onChange at initialization
  // https://github.com/google-map-react/google-map-react/blob/master/DOC.md
  const isInitCall = useRef(true)

  const [debouncedSearch] = useDebounce(state.search, SEARCH_DEBOUNCE_MS)

  // Upon each change in search we fetch new results
  useEffect(() => {
    async function fetchResults() {
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
        brand,
        state.search.sort
      )
      const valertOptions = createValertOptions(state.search, QUERY_LIMIT)

      try {
        const response = await api.getListings.byValert(
          valertOptions,
          valertQueryString
        )

        const listings: ICompactListing[] = response.entities.listings
          ? Object.values(response.entities.listings)
          : []

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

    // Prevent fetchResults on initialCall to fix calling GoogleMap onChange at initialization.
    if (!isInitCall.current) {
      fetchResults()
    } else {
      isInitCall.current = false
    }

    // Because we already has state.search.bounds on the deps list,
    // We don't need to call fetchResults() on every state.map.zoom change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, dispatch, brand])

  useEffect(() => {
    // Log user searching for listings activity when filter is applied
    logSearchListings(stringifyFilters(state.search.filters))
  }, [state.search.filters])

  return [state, dispatch]
}
