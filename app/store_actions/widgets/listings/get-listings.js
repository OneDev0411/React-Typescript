import api from '../../../models/widgets/listings'
import { getBrandByHostname } from '../../../models/brand/get-brand-by-hostname'
import * as actionsType from '../../../constants/widgets/listing'

const getListingsByValert = (options, params) => async (dispatch, getState) => {
  try {
    let { user, brand } = getState()

    if (!user && !brand) {
      brand = await getBrandByHostname(window.location.hostname)
    }

    dispatch({
      type: actionsType.FETCH_WIDGET_LISTING_REQUEST,
      options,
      params
    })

    return api.byValert(options, params, brand).then(
      response => {
        dispatch({
          type: actionsType.FETCH_WIDGET_LISTING_SUCCESS,
          listingResponse: response,
          options,
          params
        })
      },
      ({ message }) => {
        dispatch({
          type: actionsType.FETCH_WIDGET_LISTING_FAILURE,
          options,
          params,
          message: message || 'Something went wrong.'
        })
      }
    )
  } catch (error) {
    dispatch({
      type: actionsType.FETCH_WIDGET_LISTING_FAILURE,
      options,
      params,
      message: error.message || 'Something went wrong.'
    })
    throw error
  }
}

export default getListingsByValert
