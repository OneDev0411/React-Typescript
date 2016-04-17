// actions/notifications/get.js
import Notification from '../../models/Notification'
import AppStore from '../../stores/AppStore'
import AppDispatcher from '../../dispatcher/AppDispatcher'

export default (user) => {
  AppStore.data.notifications = {}
  AppStore.data.notifications.summary = {}
  const params = {
    access_token: user.access_token
  }
  Notification.getSummary(params, (err, response) => {
    const summary = response.data
    // If user added to room
    if (summary.room_notification_summaries && summary.room_notification_summaries.length) {
      let room_id
      if (AppStore.data.current_room)
        room_id = AppStore.data.current_room.id
      AppDispatcher.dispatch({
        action: 'get-rooms',
        user,
        room_id
      })
    }
    AppStore.data.notifications.summary = summary
    AppStore.emitChange()
  })
}