import * as actionsType from '../../constants/widgets/listing'

const data = (state = {}, action) => {
  switch (action.type) {
    case actionsType.FETCH_WIDGET_LISTING_REQUEST:
      return {
        ...state,
        [action.widgetOptions.type]: {
          isFetching: true,
          errorMessage: undefined
        }
      }
    case actionsType.FETCH_WIDGET_LISTING_SUCCESS: {
      return {
        ...state,
        [action.widgetOptions.type]: {
          isFetching: false,
          errorMessage: undefined,
          listings: action.listingResponse.data,
          listingsInfo: action.listingResponse.info
        }
      }
    }
    case actionsType.FETCH_WIDGET_LISTING_FAILURE:
      return {
        ...state,
        [action.widgetOptions.type]: {
          errorMessage: action.message
        }
      }
    default:
      return state
  }
}

export default data