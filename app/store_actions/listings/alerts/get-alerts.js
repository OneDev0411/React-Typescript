import { getFetchingStatus } from '../../../reducers/listings'
import * as actionsType from '../../../constants/listings/alerts'
import api from '../../../models/listings/alerts'

const getAlerts = maxValue => (dispatch, getState) => {
  if (getFetchingStatus(getState().alerts.list)) {
    return Promise.resolve()
  }

  dispatch({
    tabName: 'ALERTS',
    type: actionsType.FETCH_ALERTS_REQUEST
  })

  return api.getAlerts(maxValue).then(
    response => {
      dispatch({
        response,
        tabName: 'ALERTS',
        type: actionsType.FETCH_ALERTS_SUCCESS
      })
      return response
    },
    ({ message }) => {
      dispatch({
        tabName: 'ALERTS',
        type: actionsType.FETCH_ALERTS_FAILURE,
        message: message || 'Something went wrong.'
      })
    }
  )
}

export default getAlerts
