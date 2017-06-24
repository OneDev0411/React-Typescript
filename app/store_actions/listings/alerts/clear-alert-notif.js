import { normalize } from 'normalizr'
import api from '../../../models/listings/alerts'
import * as schema from '../../../models/listings/schema'
import { selectListings } from '../../../reducers/listings'
import * as actionsType from '../../../constants/listings/alerts'

const clearAlertNotification = alert => (dispatch, getState) => {
  const { alerts } = getState()

  const alertsList = selectListings(alerts.list).map(item => {
    if (item.id !== alert.id) {
      return item
    }
    return {
      ...item,
      new_recommendations: '0'
    }
  })

  const response = normalize(alertsList, schema.listingsList)

  dispatch({
    response,
    tabName: 'ALERTS',
    type: actionsType.CLEAR_ALERT_NOTIFICATION
  })

  dispatch({
    type: actionsType.CLEAR_ALERT_NOTIFICATION_REQUEST
  })

  const { id, room } = alert
  const params = {
    id,
    room,
    body: {
      new_recommendations: 0
    }
  }

  return api.updateAlert(params).then(
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
