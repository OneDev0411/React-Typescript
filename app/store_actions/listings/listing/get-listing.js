import api from '../../../models/listings/listing'
import * as actionsType from '../../../constants/listings/listing'

const getListing = id => async (dispatch, getState) => {
  dispatch({
    id,
    tabName: 'LISTING',
    type: actionsType.FETCH_LISTING_REQUEST
  })

  try {
    const response = await api.getListing(id)

    dispatch({
      response,
      tabName: 'LISTING',
      type: actionsType.FETCH_LISTING_SUCCESS
    })
  } catch ({ response }) {
    const message = (response && response.body.message) || 'Something went wrong.'

    dispatch({
      tabName: 'LISTING',
      type: actionsType.FETCH_LISTING_FAILURE,
      message
    })
  }
}

export default getListing
