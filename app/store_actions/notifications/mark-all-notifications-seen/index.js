import * as actionTypes from '../../../constants/notifications'
import { markAllNotificationsAsSeen as fetchAllNotificationsAsSeen } from '../../../models/notifications'

export function markAllNotificationsAsSeen() {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.FETCH_NOTIFICATIONS_REQUEST
      })

      await fetchAllNotificationsAsSeen()

      dispatch({
        type: actionTypes.MARK_ALL_NOTIFICATIONS_SEEN_SUCCESS
      })
    } catch (error) {
      throw error
    }
  }
}
