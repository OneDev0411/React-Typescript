import * as actionTypes from '../../../constants/notifications'

export function receivedANotification(notification) {
  return {
    notification,
    type: actionTypes.RECEIVED_A_NOTIFICATION
  }
}
