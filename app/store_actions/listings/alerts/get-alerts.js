import { getFetchingStatus } from '../../../reducers/listings'
import * as actionsType from '../../../constants/listings/alerts'
import api from '../../../models/listings/alerts'

const getAlerts = params => (dispatch, getState) => {
  if (getFetchingStatus(getState().alerts.list)) {
    return Promise.resolve()
  }

  dispatch({
    tabName: 'alerts',
    type: actionsType.FETCH_ALERTS_REQUEST
  })

  return api.getAlerts(params).then(
    response => {
      dispatch({
        response,
        tabName: 'alerts',
        type: actionsType.FETCH_ALERTS_SUCCESS
      })

      return response
    },
    ({ message }) => {
      dispatch({
        tabName: 'alerts',
        type: actionsType.FETCH_ALERTS_FAILURE,
        message: message || 'Something went wrong.'
      })
    }
  )
}

export default getAlerts
