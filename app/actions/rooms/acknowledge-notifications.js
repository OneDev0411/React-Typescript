// actions/acknowledge-notifications.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'

export default (user, room) => {
  const summary = AppStore.data.notifications.summary
  summary.room_notification_count--
  summary.room_notification_summaries = summary.room_notification_summaries.filter(s => {
    if (s.room_id === room)
      return false

    return true
  });

  AppStore.emitChange()

  const params = {
    room,
    access_token: user.access_token
  }
  Room.acknowledgeNotifications(params, () => {})
}