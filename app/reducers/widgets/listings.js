import * as actionsType from '../../constants/widgets/listing'

const data = (state = {}, action) => {
  switch (action.type) {
    case actionsType.FETCH_WIDGET_LISTING_REQUEST:
      return {
        ...state,
        [action.widgetOptions.type]: {
          ...state[action.widgetOptions.type],
          isFetching: true,
          errorMessage: undefined
        }
      }
    case actionsType.FETCH_WIDGET_LISTING_SUCCESS: {
      let currentListing = Object.assign({},
        state[action.widgetOptions.type],
        {
          isFetching: false,
          errorMessage: undefined,
          listingsInfo: action.listingResponse.info
        })
      if (currentListing.listings) {
        currentListing.listings = currentListing.listings.concat(action.listingResponse.data)
      } else {
        currentListing.listings = action.listingResponse.data
      }
      return {
        ...state,
        [action.widgetOptions.type]: currentListing
      }
    }
    case actionsType.FETCH_WIDGET_LISTING_FAILURE:
      return {
        ...state,
        [action.widgetOptions.type]: {
          ...state[action.widgetOptions.type],
          isFetching: false,
          errorMessage: action.message
        }
      }
    default:
      return state
  }
}

export default data