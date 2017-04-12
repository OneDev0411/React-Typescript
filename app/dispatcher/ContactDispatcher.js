import { Dispatcher } from './flux'

import getContacts from '../actions/contacts/get-contacts'
import getTimeline from '../actions/contacts/get-timeline'

const ContactDispatcher = new Dispatcher()

// Register callback with ContactDispatcher
ContactDispatcher.register(async function (payload) {
  const action = payload.action

  switch (action) {

    case 'get-contacts':
      getContacts(payload.user)
      break

    case 'get-timeline':
      getTimeline(payload.id, payload.user)
      break

    default:
      return true
  }
  return true
})

export default ContactDispatcher
