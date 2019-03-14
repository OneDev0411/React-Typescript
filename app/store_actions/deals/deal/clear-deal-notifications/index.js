import _ from 'underscore'

import * as actionTypes from '../../../../constants/deals'
import { deleteNotifications } from '../../../../models/Deal/notification'

export function clearDealNotifications(deal) {
  return async dispatch => {
    const notifications = Array.isArray(deal.new_notifications)
      ? deal.new_notifications.filter(
          notification => notification.room === null
        )
      : []

    if (notifications.length === 0) {
      return false
    }

    try {
      await deleteNotifications(_.pluck(notifications, 'id'))

      dispatch({
        type: actionTypes.CLEAR_DEAL_NOTIFICATIONS,
        deal_id: deal.id
      })

      console.log('[ + ] Deal notifications cleared.')
    } catch (e) {
      console.log(e)
    }
  }
}
