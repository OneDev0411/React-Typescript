import { browserHistory } from 'react-router'
import { normalize } from 'normalizr'
import api from '../../../models/listings/alerts'
import setSelectedAlertId from './set-selected-alert-id'
import * as schema from '../../../models/listings/schema'
import { selectListings } from '../../../reducers/listings'
import * as actionsType from '../../../constants/listings/alerts'

const normalizeListings = alerts => {
  const normilizedAlerts = normalize(alerts, schema.listingsList)

  const total = alerts.length
  const info = {
    total,
    count: total
  }

  return {
    ...normilizedAlerts,
    info
  }
}

const deleteAlert = alert => (dispatch, getState) => {
  const { selectedAlertId } = getState().alerts
  const { room: alertRoom, id: alertId } = alert

  const deleteHandler = () => {
    const alerts = selectListings(getState().alerts.list)
    const newAlerts = alerts.filter(a => a.id !== alertId)

    return normalizeListings(newAlerts)
  }

  const addHandler = () => {
    const alerts = selectListings(getState().alerts.list)
    const newAlerts = [...listings, alert]

    return normalizeListings(newAlerts)
  }

  dispatch({
    tabName: 'ALERTS',
    type: actionsType.DELETE_ALERT_REQUEST
  })

  return api.deleteAlert(alertId, alertRoom).then(
    response => {
      if (selectedAlertId === alertId) {
        dispatch(setSelectedAlertId(''))
        browserHistory.push('/dashboard/mls/alerts')
      }

      dispatch({
        tabName: 'ALERTS',
        response: deleteHandler(),
        type: actionsType.DELETE_ALERT_SUCCESS
      })
    },
    ({ message }) => {
      dispatch({
        tabName: 'ALERTS',
        type: actionsType.DELETE_ALERT_FAILURE,
        message: message || 'Something went wrong.'
      })
    }
  )
}

export default deleteAlert
