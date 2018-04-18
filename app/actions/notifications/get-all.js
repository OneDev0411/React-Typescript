// actions/notifications/get-all.js
import Notification from '../../models/Notification'
import AppStore from '../../stores/AppStore'

export default user => {
  if (!user || !user.access_token) {
    return false
  }

  const params = {
    access_token: user.access_token
  }

  Notification.getAll(params, (err, response) => {
    if (user.access_token && err && err.response.status === 401) {
      window.location.href = '/signout'

      return
    }

    AppStore.data.notifications = response.data
    AppStore.data.new_notifications_count = response.info.new
    AppStore.data.notifications_retrieved = true
    AppStore.emitChange()
  })
}
