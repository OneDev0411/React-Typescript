import { batchActions } from 'redux-batched-actions'
import setSelectedAlertId from './set-selected-alert-id'
import { getFetchingStatus } from '../../../reducers/listings'
import { logUserActivity } from '../../user/log-user-activity'
import * as actionsType from '../../../constants/listings/alerts'
import api from '../../../models/listings/alerts'
import { selectAlert } from '../../../reducers/listings/alerts/list'

const getAlertFeed = (alertId, roomId) => (dispatch, getState) => {
  const { feed, list } = getState().alerts

  if (getFetchingStatus(feed)) {
    return Promise.resolve()
  }

  dispatch(setSelectedAlertId(alertId))

  const feedListings = feed.byAlertId[alertId]

  if (feedListings && Array.isArray(feedListings)) {
    return Promise.resolve()
  }

  dispatch({
    tabName: 'ALERT_FEED',
    type: actionsType.FETCH_ALERT_FEED_REQUEST
  })

  return api.getAlertFeed(alertId, roomId).then(
    response => {
      const alert = selectAlert(list, alertId)

      batchActions([
        dispatch({
          response,
          tabName: 'ALERT_FEED',
          type: actionsType.FETCH_ALERT_FEED_SUCCESS
        }),
        dispatch(
          logUserActivity({
            action: 'UserViewedAlert',
            object_class: 'alert',
            object: alert
          })
        )
      ])
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
