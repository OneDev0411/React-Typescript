import { Dispatcher } from './flux'
import getNodifs from '../actions/notifications/get-all'
import deleteNotifs from '../actions/notifications/delete-all'
import deleteRoomNotifs from '../actions/notifications/delete-room-notifications'
import markSeen from '../actions/notifications/mark-seen'

const NotificationDispatcher = new Dispatcher()

// Register callback with ContactDispatcher
NotificationDispatcher.register(async function (payload) {
  const action = payload.action

  switch (action) {

    case 'get-all':
      getNodifs(payload.user)
      break

    case 'delete-all':
      deleteNotifs(payload.user)
      break

    case 'delete-room-notifications':
      deleteRoomNotifs(payload.user, payload.id)
      break

    case 'mark-seen':
      markSeen(payload.user, payload.id)
      break

    default:
      return true
  }
  return true
})

export default NotificationDispatcher
