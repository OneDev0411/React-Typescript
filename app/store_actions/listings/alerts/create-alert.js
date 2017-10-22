import { normalize } from 'normalizr'
import api from '../../../models/listings/alerts'
import * as schema from '../../../models/listings/schema'
import { selectListings } from '../../../reducers/listings'
import * as actionsType from '../../../constants/listings/alerts'

const createAlert = alertOptions => (dispatch, getState) => {
  const addHandler = alert => {
    const alertsList = getState().alerts.list
    const alerts = selectListings(alertsList)

    return normalize([alert, ...alerts], schema.listingsList)
  }

  dispatch({
    tabName: 'ALERTS',
    type: actionsType.ADD_ALERT_REQUEST
  })

  return api.createAlert(alertOptions).then(
    response => {
      dispatch({
        tabName: 'ALERTS',
        response: addHandler(response),
        type: actionsType.ADD_ALERT_SUCCESS
      })
      return response
    },
    error => {
      dispatch({
        tabName: 'ALERTS',
        type: actionsType.ADD_ALERT_FAILURE,
        message: error.message || 'Something went wrong.'
      })
    }
  )
}

export default createAlert
