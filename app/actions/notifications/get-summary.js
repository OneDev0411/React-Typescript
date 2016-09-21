// actions/notifications/get.js
import Notification from '../../models/Notification'
import AppStore from '../../stores/AppStore'
import AppDispatcher from '../../dispatcher/AppDispatcher'
import _ from 'lodash'
export default (user) => {
  AppStore.data.notifications = {}
  AppStore.data.notifications.summary = {}
  const params = {
    access_token: user.access_token
  }
  Notification.getSummary(params, (err, response) => {
    const summary = response.data
    AppStore.data.notifications.summary = summary
    // If room notification on new room, refresh room
    if (!summary)
      return
    if (summary.room_notification_summaries && summary.room_notification_summaries.length) {
      let refresh_room = true
      // Search for room
      summary.room_notification_summaries.forEach(summary_loop => {
        if (_.find(AppStore.data.rooms, { id: summary_loop.room_id }))
          refresh_room = false
      })
      if (refresh_room) {
        // If new room refresh with get-rooms
        const current_room = AppStore.data.current_room
        let room_id
        if (current_room)
          room_id = current_room.id
        AppDispatcher.dispatch({
          action: 'get-rooms',
          user,
          room_id
        })
      }
    }
    AppStore.emitChange()
  })
}