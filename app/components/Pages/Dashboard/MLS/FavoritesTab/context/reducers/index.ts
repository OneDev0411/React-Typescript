import { IMapPosition } from '../../../types'
import { Actions } from '../actions'

export interface FavoritesState {
  map: IMapPosition
  result: {
    listings: ICompactListing[]
    info: Nullable<ICompactListingInfo>
  }
  isLoading: boolean
}

export const initialState: FavoritesState = {
  map: { center: undefined, zoom: undefined },
  result: { listings: [], info: null },
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
        result: { listings, info }
      }
    }

    case 'REMOVE_LISTING': {
      const { id } = action.payload

      // remove the listing from listings list
      const newListings = state.result.listings.filter(listing => {
        return !(listing.id === id && listing.favorited)
      })

      const isListtingAltered =
        newListings.length !== state.result.listings.length

      // reduce the number of listings by 1 if the listing was found
      const newInfo = isListtingAltered
        ? {
            proposed_title: state.result.info
              ? state.result.info.proposed_title
              : '',
            count: newListings.length,
            total: state.result.info ? state.result.info.total - 1 : 0
          }
        : state.result.info

      return {
        ...state,
        result: {
          info: newInfo,
          listings: newListings
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
