import * as actionTypes from '../../../constants/notifications'
import { deleteNewNotifications as removeNotifications } from '../../../models/notifications'

export function deleteNewNotifications() {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.FETCH_NOTIFICATIONS_REQUEST
      })

      await removeNotifications()

      dispatch({
        type: actionTypes.DELETE_NOTIFICATIONS_SUCCESS
      })
    } catch (error) {
      throw error
    }
  }
}
