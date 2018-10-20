import { batchActions } from 'redux-batched-actions'

import { goToPlace } from '../map'
import api from '../../../models/listings/search'
import * as actionsType from '../../../constants/listings/search'

const getPlace = address => dispatch => {
  if (!address) {
    return
  }

  dispatch({ type: actionsType.GET_PLACE_REQUEST })

  return api.getPlace(address).then(
    response => {
      batchActions([
        dispatch({ type: actionsType.GET_PLACE_SUCCESS }),
        dispatch(goToPlace(response))
      ])
    },
    ({ message }) => {
      dispatch({
        type: actionsType.GET_PLACE_FAILURE,
        message: message || 'google can not find your place.'
      })
    }
  )
}

export default getPlace
