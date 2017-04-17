import { Dispatcher } from './flux'
import getNodifications from '../actions/notifications/get-all'
import deleteNodifications from '../actions/notifications/delete-all'

const NotificationDispatcher = new Dispatcher()

// Register callback with ContactDispatcher
NotificationDispatcher.register(async function (payload) {
  const action = payload.action

  switch (action) {

    case 'get-all':
      getNodifications(payload.user)
      break

    case 'delete-all':
      deleteNodifications(payload.user)
      break

    default:
      return true
  }
  return true
})

export default NotificationDispatcher
