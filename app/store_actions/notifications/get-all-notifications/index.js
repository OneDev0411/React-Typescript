import * as actionTypes from '../../../constants/notifications'
import { getAllNotifications as fetchAllNotifications } from '../../../models/notifications'

export function getAllNotifications() {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.FETCH_NOTIFICATIONS_REQUEST
      })

      const response = await fetchAllNotifications()

      dispatch({
        response,
        type: actionTypes.FETCH_NOTIFICATIONS_SUCCESS
      })
    } catch (error) {
      throw error
    }
  }
}
