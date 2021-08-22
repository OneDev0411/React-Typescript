import { useEffect } from 'react'

import useThunkReducer from 'react-hook-thunk-reducer'

import { setListings, setIsLoading } from '../context/actions'
import { reducer, initialState } from '../context/reducers'

export default function useFetchListings() {
  // Instead of using `useReducer` which doesn't support thunks
  const [state, dispatch] = useThunkReducer(reducer, initialState)

  // Upon each change in search we fetch new results
  useEffect(() => {
    async function fetchResults() {
      // 1. if state.search.drawing is changed
      //    it means user has drawn a polygon, so we search in that area only
      //    having a drawing always takes precedence over `bounds` if they're both set.
      //    Consider the case where user has set a drawing on map and search results
      //    are shown for that area, then user pans/zooms map, we should not search
      //    for the newly set `bounds` and instead should wait until user clicks on
      //    `remove drawing` then we can use latest `bounds` that are set.
      //
      // 2. if state.search.bounds is changed
      //    it means map is moved (by zooming or panning), so we do search again
      //    NOTE: consider case 1
      //
      // 3. if state.search.filter changed
      //    ...

      console.log("Some params in search changed. Let's fetch new results!")

      dispatch(setIsLoading(true))

      // TODO: Load listings from model
      // const results = await listings // await fetch
      const results = []

      dispatch(setListings(results))
      dispatch(setIsLoading(false))
    }
    fetchResults()
  }, [state.search, dispatch])

  return [state, dispatch]
}
