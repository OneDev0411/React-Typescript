import { batchActions } from 'redux-batched-actions'

import * as actionsType from '../../../constants/listings/search'
import api from '../../../models/listings/search'
import { goToPlace } from '../map'

import { setSearchLocation } from './set-search-location'

const getPlace = address => dispatch => {
  if (!address) {
    return
  }

  dispatch({ type: actionsType.GET_PLACE_REQUEST })

  return api.getPlace(address).then(
    response => {
      batchActions([
        dispatch(setSearchLocation(response.center)),
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
