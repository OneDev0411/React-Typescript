// actions/notifications/mark-seen.js
import { browserHistory } from 'react-router'
import Notification from '../../models/Notification'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'

export default (user, id) => {
  const params = {
    access_token: user.access_token,
    id
  }

  Notification.markSeen(params, (err, response) => {
    const { notifications } = AppStore.data
    const index = _.findIndex(notifications, { id })

    notifications[index].seen = true
    AppStore.data.notifications = notifications
    AppStore.emitChange()
  })
}
