import * as actionsType from '../../../constants/widgets/listing'
import { getBrandByHostname } from '../../../models/brand/get-brand-by-hostname'
import api from '../../../models/widgets/listings'

const getListingsByValert = (options, params) => async (dispatch, getState) => {
  let { user, brand } = getState()

  if (!user && !brand) {
    try {
      brand = await getBrandByHostname(window.location.hostname)
    } catch (error) {
      dispatch({
        type: actionsType.FETCH_WIDGET_LISTING_FAILURE,
        options,
        params,
        message: error.message || 'Something went wrong.'
      })
    }
  }

  try {
    dispatch({
      type: actionsType.FETCH_WIDGET_LISTING_REQUEST,
      options,
      params
    })

    return api.byValert(options, params).then(
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
  }
}

export default getListingsByValert
