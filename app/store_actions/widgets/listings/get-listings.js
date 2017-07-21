import api from '../../../models/widgets/listings'
import * as actionsType from '../../../constants/widgets/listing'

const getListingsByValert = (options, widgetOptions) => (dispatch) => {
  try {
    dispatch({
      type: actionsType.FETCH_WIDGET_LISTING_REQUEST,
      options,
      widgetOptions
    })

    return api.byValert(options, widgetOptions).then(
      response => {
        dispatch({
          type: actionsType.FETCH_WIDGET_LISTING_SUCCESS,
          listingResponse: response,
          options,
          widgetOptions
        })
      },
      ({ message }) => {
        dispatch({
          type: actionsType.FETCH_WIDGET_LISTING_FAILURE,
          options,
          widgetOptions,
          message: message || 'Something went wrong.'
        })
      }
    )
  } catch (error) {
    dispatch({
      type: actionsType.FETCH_WIDGET_LISTING_FAILURE,
      options,
      widgetOptions,
      message: error.message || 'Something went wrong.'
    })
    throw error
  }
}

export default getListingsByValert
