import api from '../../../models/listings/search'
import * as actionsType from '../../../constants/widgets/listing'

const getListingsByValert = options => (dispatch) => {
  try {
    dispatch({
      tabName: 'SEARCH',
      type: actionsType.FETCH_WIDGET_LISTING_REQUEST
    })

    return api.getListings.byValert(options).then(
      response => {
        dispatch({
          response,
          tabName: 'SEARCH',
          type: actionsType.FETCH_WIDGET_LISTING_SUCCESS
        })
      },
      ({ message }) => {
        dispatch({
          tabName: 'SEARCH',
          type: actionsType.FETCH_WIDGET_LISTING_FAILURE,
          message: message || 'Something went wrong.'
        })
      }
    )
  } catch (error) {
    dispatch({
      tabName: 'SEARCH',
      type: actionsType.FETCH_WIDGET_LISTING_FAILURE,
      message: error.message || 'Something went wrong.'
    })
    throw error
  }
}

export default getListingsByValert
