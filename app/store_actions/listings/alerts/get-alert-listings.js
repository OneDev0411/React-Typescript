import setSelectedAlert from './set-selected-alert'
import { getFetchingStatus } from '../../../reducers/listings'
import * as actionsType from '../../../constants/listings/alerts'
import api from '../../../models/listings/alerts'

const getAlertListings = alert => (dispatch, getState) => {
  const { feed } = getState().alerts
  if (getFetchingStatus(feed)) {
    return Promise.resolve()
  }

  dispatch(setSelectedAlert(alert))

  const feedListings = feed.byAlertId[alert.id] || []
  if (feedListings.length) {
    return Promise.resolve()
  }

  dispatch({
    tabName: 'ALERT_FEED',
    type: actionsType.FETCH_ALERT_LISTINGS_REQUEST
  })

  return api.getAlertListings(alert).then(
    response => {
      dispatch({
        response,
        tabName: 'ALERT_FEED',
        type: actionsType.FETCH_ALERT_LISTINGS_SUCCESS
      })
    },
    ({ message }) => {
      dispatch({
        tabName: 'ALERT_FEED',
        message: message || 'Something went wrong.',
        type: actionsType.FETCH_ALERT_LISTINGS_FAILURE
      })
    }
  )
}

export default getAlertListings
