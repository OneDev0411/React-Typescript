import { Actions } from '../actions'

export interface ListingsState {
  search: {
    bounds: Nullable<IBounds>
    office: Nullable<string>
    drawing: IPoint[]
    filters: Nullable<AlertFilters>
  }
  map: { center: Optional<IPoint>; zoom: Optional<number> }
  results: ICompactListingWithUIState[]
  info: Nullable<IListingInfo>
  isLoading: boolean
}

export const initialState: ListingsState = {
  search: { bounds: null, office: null, drawing: [], filters: null },
  map: { center: undefined, zoom: undefined },
  results: [],
  info: null,
  isLoading: false
}

export function reducer(state: ListingsState, action: Actions): ListingsState {
  switch (action.type) {
    case 'SET_LISTINGS': {
      const { listings, info } = action.payload
      const mapReadyListings = listings.map(listing => ({
        ...listing,
        hover: false,
        clicked: false
      }))

      return { ...state, results: mapReadyListings, info }
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
      const { points } = action.payload

      /*
       * We don't clear bounds in this case since we need to
       * have the current bounds in case user clicks on remove
       * drawing and we need to do a general search in that bounds
       * logic for picking up the right model for searching should
       * be defined in hook `useFetchListings`
       */
      return { ...state, search: { ...state.search, drawing: points } }
    }

    case 'SET_MAP_BOUNDS': {
      const { center, zoom, bounds } = action.payload

      return {
        ...state,
        search: { ...state.search, bounds },
        map: { center, zoom }
      }
    }

    case 'SET_MAP_LOCATION': {
      const { center, zoom } = action.payload

      return { ...state, map: { center, zoom } }
    }

    case 'SET_IS_LOADING': {
      const { isLoading } = action.payload

      return { ...state, isLoading }
    }

    case 'REMOVE_MAP_DRAWING': {
      return { ...state, search: { ...state.search, drawing: [] } }
    }

    default:
      return state
  }
}
