import { normalize } from 'normalizr'
import { browserHistory } from 'react-router'

import * as actionsType from '../../../constants/listings/alerts'
import api from '../../../models/listings/alerts'
import * as schema from '../../../models/listings/schema'
import { selectListings } from '../../../reducers/listings'

import setSelectedAlertId from './set-selected-alert-id'

const deleteAlert = alert => (dispatch, getState) => {
  const { selectedAlertId } = getState().alerts
  const { room: alertRoom, id: alertId } = alert

  const deleteHandler = () => {
    const alertsList = getState().alerts.list
    const alerts = selectListings(alertsList)

    const newAlerts = alerts.filter(a => a.id !== alertId)

    return normalize(newAlerts, schema.listingsList)
  }

  dispatch({
    tabName: 'alerts',
    type: actionsType.DELETE_ALERT_REQUEST
  })

  return api.deleteAlert(alertId, alertRoom).then(
    () => {
      dispatch({
        tabName: 'alerts',
        response: deleteHandler(),
        type: actionsType.DELETE_ALERT_SUCCESS
      })

      if (selectedAlertId === alertId) {
        dispatch(setSelectedAlertId(''))
        browserHistory.push('/dashboard/mls/alerts')
      }
    },
    ({ message }) => {
      dispatch({
        tabName: 'alerts',
        type: actionsType.DELETE_ALERT_FAILURE,
        message: message || 'Something went wrong.'
      })
    }
  )
}

export default deleteAlert
