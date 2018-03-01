import setSelectedAlertId from './set-selected-alert-id'
import { getFetchingStatus } from '../../../reducers/listings'
import * as actionsType from '../../../constants/listings/alerts'
import api from '../../../models/listings/alerts'

const getAlertFeed = (alertId, roomId) => (dispatch, getState) => {
  const { feed } = getState().alerts

  if (getFetchingStatus(feed)) {
    return Promise.resolve()
  }

  dispatch(setSelectedAlertId(alertId))

  const feedListings = feed.byAlertId[alertId]

  if (Array.isArray(feedListings) && feedListings.length > 0) {
    return Promise.resolve()
  }

  dispatch({
    tabName: 'ALERT_FEED',
    type: actionsType.FETCH_ALERT_FEED_REQUEST
  })

  return api.getAlertFeed(alertId, roomId).then(
    response => {
      dispatch({
        response,
        tabName: 'ALERT_FEED',
        type: actionsType.FETCH_ALERT_FEED_SUCCESS
      })
    },
    ({ message }) => {
      dispatch({
        tabName: 'ALERT_FEED',
        message: message || 'Something went wrong.',
        type: actionsType.FETCH_ALERT_FEED_FAILURE
      })
    }
  )
}

export default getAlertFeed
