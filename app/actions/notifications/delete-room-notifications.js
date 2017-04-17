// actions/notifications/delete-room-notifications.js
import { browserHistory } from 'react-router'
import Notification from '../../models/Notification'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'
export default (user, id) => {
  const params = {
    id,
    access_token: user.access_token
  }
  Notification.deleteRoomNotifs(params, (err, response) => {
    // Delete room notifs
    const index = _.findIndex(AppStore.data.rooms, { id: id })
    AppStore.data.rooms[index].new_notifications = 0
    AppStore.emitChange()
  })
}
