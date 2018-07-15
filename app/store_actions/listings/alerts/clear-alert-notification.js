import { normalize } from 'normalizr'
import api from '../../../models/listings/alerts'
import * as schema from '../../../models/listings/schema'
import { selectListings } from '../../../reducers/listings'
import * as actionsType from '../../../constants/listings/alerts'

const clearAlertNotification = (alertId, roomId) => (dispatch, getState) => {
  const { alerts } = getState()

  const alertsList = selectListings(alerts.list).map(alert => {
    if (alert.id !== alertId) {
      return alert
    }
    return {
      ...alert,
      new_recommendations: '0'
    }
  })

  const response = normalize(alertsList, schema.listingsList)

  dispatch({
    response,
    tabName: 'alerts',
    type: actionsType.CLEAR_ALERT_NOTIFICATION
  })

  dispatch({
    type: actionsType.CLEAR_ALERT_NOTIFICATION_REQUEST
  })

  return api.clearAlertNotification(alertId, roomId).then(
    response => {
      dispatch({
        type: actionsType.CLEAR_ALERT_NOTIFICATION_SUCCESS
      })
    },
    ({ message }) => {
      dispatch({
        type: actionsType.CLEAR_ALERT_NOTIFICATION_FAILURE,
        message: message || 'Something went wrong.'
      })
    }
  )
}

export default clearAlertNotification
