// actions/tasks/acknowledge-notifications.js
import Task from '../../models/Task'
import AppStore from '../../stores/AppStore'

export default (user) => {
  const params = {
    access_token: user.access_token
  }

  Task.acknowledgeNotifications(params, () => {
    // At this point we have practically set the notification count to 0 by
    // acknowleding all notifications. We dont have to get summary from server
    // once more. We know its supposed to be 0 now.
    if (AppStore.data.notifications && AppStore.data.notifications.summary)
      AppStore.data.notifications.summary.task_notification_count = 0
    AppStore.emitChange()
  })
}