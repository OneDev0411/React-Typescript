// actions/notifications/delete-all.js
import Notification from '../../models/Notification'
import AppStore from '../../stores/AppStore'

export default user => {
  const params = {
    access_token: user.access_token
  }

  Notification.deleteAll(params, err => {
    if (!err) {
      AppStore.data.new_notifications_count = 0
      AppStore.emitChange()
    }
  })
}
