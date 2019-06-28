import api from '../../../models/widgets/listings'
import { getBrandByHostname } from '../../../models/brand/get-brand-by-hostname'
import * as actionsType from '../../../constants/widgets/listing'

const getListingsByValert = (options, widgetOptions) => async (
  dispatch,
  getState
) => {
  try {
    let { user, brand } = getState()

    if (!user && !brand) {
      brand = await getBrandByHostname(window.location.hostname)
    }

    dispatch({
      type: actionsType.FETCH_WIDGET_LISTING_REQUEST,
      options,
      widgetOptions
    })

    return api.byValert(options, widgetOptions, brand).then(
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
