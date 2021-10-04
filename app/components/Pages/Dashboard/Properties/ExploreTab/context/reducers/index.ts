import { FILTERS_INITIAL_VALUES } from '../../../constants/constants'
import {
  parseSortIndex,
  Sort,
  SORT_FIELD_DEFAULT
} from '../../../helpers/sort-utils'
import { Actions } from '../actions'

export interface ListingSearchOptions {
  bounds: Nullable<IBounds>
  office?: Nullable<string>
  drawing: ICoord[]
  filters: Partial<AlertFilters>
  sort: Sort
}

export interface MapPosition {
  center: Optional<ICoord>
  zoom: Optional<number>
}
export interface ListingsState {
  search: ListingSearchOptions
  map: MapPosition
  result: {
    listings: ICompactListing[]
    info: Nullable<ICompactListingInfo>
  }
  listingStates: { hover: Nullable<UUID>; click: Nullable<UUID> }
  isLoading: boolean
}

export const initialState: ListingsState = {
  search: {
    bounds: null,
    drawing: [],
    filters: FILTERS_INITIAL_VALUES,
    sort: parseSortIndex(SORT_FIELD_DEFAULT)
  },
  map: { center: undefined, zoom: undefined },
  result: { listings: [], info: null },
  listingStates: { hover: null, click: null },
  isLoading: true
}

export function reducer(state: ListingsState, action: Actions): ListingsState {
  switch (action.type) {
    case 'SET_LISTINGS': {
      const { listings, info } = action.payload

      return {
        ...state,
        result: { listings, info },
        listingStates: { hover: null, click: null }
      }
    }

    case 'CHANGE_LISTING_HOVER_STATE': {
      const { id } = action.payload

      return {
        ...state,
        listingStates: { ...state.listingStates, hover: id }
      }
    }

    case 'CHANGE_LISTING_CLICKED_STATE': {
      const { id } = action.payload

      return {
        ...state,
        listingStates: { ...state.listingStates, click: id }
      }
    }

    case 'TOGGLE_LISTING_FAVORITE_STATE': {
      const { id } = action.payload

      return {
        ...state,
        result: {
          ...state.result,
          listings: state.result.listings.map(listing => {
            if (listing.id === id) {
              return { ...listing, favorited: !listing.favorited }
            }

            return listing
          })
        }
      }
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

    case 'UPDATE_FILTERS': {
      const { filters } = action.payload

      return {
        ...state,
        search: {
          ...state.search,
          filters: { ...state.search.filters, ...filters }
        }
      }
    }

    case 'CHANGE_SORT': {
      const { sort } = action.payload

      return {
        ...state,
        search: {
          ...state.search,
          sort
        }
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
