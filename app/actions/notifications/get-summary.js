// actions/notifications/get.js
import Notification from '../../models/Notification'
import AppStore from '../../stores/AppStore'

export default (user) => {
  AppStore.data.notifications = {}
  AppStore.data.notifications.summary = {}
  const params = {
    access_token: user.access_token
  }
  Notification.getSummary(params, (err, response) => {
    AppStore.data.notifications.summary = response.data
    AppStore.emitChange()
  })
}