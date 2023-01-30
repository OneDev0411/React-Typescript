import * as actionTypes from '../../../constants/notifications'
import {
  markNotificationAsSeen as fetchNotificationAsSeen,
  ackNotification
} from '../../../models/notifications'

export function markNotificationAsSeen(notificationId) {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.FETCH_NOTIFICATIONS_REQUEST
      })

      await Promise.all([
        fetchNotificationAsSeen(notificationId),
        ackNotification(notificationId)
      ])

      dispatch({
        notificationId,
        type: actionTypes.MARK_NOTIFICATION_SEEN_SUCCESS
      })
    } catch (error) {
      throw error
    }
  }
}
