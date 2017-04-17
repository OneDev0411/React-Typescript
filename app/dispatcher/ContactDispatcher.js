import { Dispatcher } from './flux'

import getContacts from '../actions/contacts/get-contacts'
import getTimeline from '../actions/contacts/get-timeline'
import addNote from '../actions/contacts/add-note'

const ContactDispatcher = new Dispatcher()

// Register callback with ContactDispatcher
ContactDispatcher.register(async (payload) => {
  const action = payload.action

  switch (action) {

    case 'get-contacts':
      getContacts(payload.user)
      break

    case 'get-timeline':
      return await getTimeline(payload.id, payload.user)
      break

    case 'add-note':
      return await addNote(payload.id, payload.user, payload.note)
      break

    default:
      return true
  }
  return true
})

export default ContactDispatcher
