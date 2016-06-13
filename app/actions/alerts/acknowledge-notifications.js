// actions/alerts/acknowledge-notifications.js
import Alert from '../../models/Alert'
import AppStore from '../../stores/AppStore'

export default (user, alert_id) => {
  const summary = AppStore.data.notifications.summary
  summary.room_notification_count--
  summary.room_notification_summaries = summary.room_notification_summaries.filter(s => {
    if (s.user_created_alert_ids.indexOf(alert_id) !== -1)
      return false
    return true
  })

  AppStore.emitChange()
  const params = {
    alert: alert_id,
    access_token: user.access_token
  }
  Alert.acknowledgeNotifications(params, () => {})
}