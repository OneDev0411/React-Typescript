import { Actions } from '../actions'

export interface ListingsState {
  search: {
    bounds: Nullable<{
      ne: IPoint
      sw: IPoint
    }>
    drawing: Nullable<IPoint[]>
    filters: Nullable<AlertFilters>
  }
  map: { center: Optional<IPoint>; zoom: Optional<number> }
  results: ICompactListingWithUIState[]
  isLoading: boolean
}

export const initialState: ListingsState = {
  search: { bounds: null, drawing: null, filters: null },
  map: { center: undefined, zoom: undefined },
  results: [],
  isLoading: false
}

export function reducer(state: ListingsState, action: Actions) {
  switch (action.type) {
    case 'SET_LISTINGS': {
      const { listings } = action.payload
      const mapReadyListings = listings.map(listing => ({
        ...listing,
        hover: false,
        clicked: false
      }))

      return { ...state, results: mapReadyListings }
    }

    case 'TOGGLE_LISTING_HOVER_STATE': {
      const { id } = action.payload

      const newResults = state.results.map(listing => {
        if (listing.id === id) {
          return { ...listing, hover: !listing.hover }
        }

        return listing
      })

      return { ...state, results: newResults }
    }

    case 'TOGGLE_LISTING_CLICKED_STATE': {
      const { id } = action.payload

      const newResults = state.results.map(listing => {
        if (listing.id === id) {
          return { ...listing, clicked: !listing.clicked }
        }

        return { ...listing, clicked: false }
      })

      return { ...state, results: newResults }
    }

    case 'SET_OFF_ALL_CLICKED_STATES': {
      const newResults = state.results.map(listing => {
        return { ...listing, clicked: false }
      })

      return { ...state, results: newResults }
    }

    case 'SET_MAP_DRAWING': {
      const { filters, bounds } = state.search
      const { points } = action.payload

      const search = {
        // We don't clear bounds in this case since we need to
        // have the current bounds in case user clicks on remove
        // drawing and we need to do a general search in that bounds
        // logic for picking up the right model for searching should
        // be defined in hook `useFetchListings`
        bounds,
        drawing: points,
        filters
      }

      return { ...state, search }
    }

    case 'SET_MAP_BOUNDS': {
      const { filters, drawing } = state.search
      const { ne, sw } = action.payload

      const search = {
        bounds: { ne, sw },
        drawing,
        filters
      }

      return { ...state, search }
    }

    case 'SET_MAP_PROPS': {
      const { center, zoom } = action.payload

      return { ...state, map: { center, zoom } }
    }

    case 'SET_IS_LOADING': {
      const { isLoading } = action.payload

      return { ...state, isLoading }
    }

    case 'REMOVE_MAP_DRAWING': {
      const { bounds, filters } = state.search

      const search = {
        bounds,
        filters,
        drawing: null
      }

      return { ...state, search }
    }

    default:
      return state
  }
}
