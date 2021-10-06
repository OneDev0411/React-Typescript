import {
  IListingUIStates,
  IMapPosition,
  IFormattedCompactListing
} from '../../../types'
import { Actions } from '../actions'

export interface FavoritesState {
  map: IMapPosition
  result: {
    listings: IFormattedCompactListing[]
    info: Nullable<ICompactListingInfo>
  }
  listingStates: IListingUIStates
  isLoading: boolean
}

export const initialState: FavoritesState = {
  map: { center: undefined, zoom: undefined },
  result: { listings: [], info: null },
  listingStates: { hover: null, click: null },
  isLoading: true
}

export function reducer(
  state: FavoritesState,
  action: Actions
): FavoritesState {
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

    case 'SET_MAP_LOCATION': {
      const { center, zoom } = action.payload

      return { ...state, map: { center, zoom } }
    }

    case 'SET_IS_LOADING': {
      const { isLoading } = action.payload

      return { ...state, isLoading }
    }

    default:
      return state
  }
}
