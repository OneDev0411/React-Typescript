import api from '../../../models/listings/listing'
import * as actionsType from '../../../constants/listings/listing'

const getListing = id => (dispatch, getState) => {
  dispatch({
    id,
    type: actionsType.FETCH_LISTING_REQUEST
  })

  return api.getListing(id).then(
    (response) => {
      dispatch({
        response,
        type: actionsType.FETCH_LISTING_SUCCESS
      })
    },
    ({ message }) => {
      dispatch({
        name: 'SEARCH',
        type: actionsType.FETCH_LISTING_FAILURE,
        message: message || 'Something went wrong.'
      })
    }
  )
}

export default getListing