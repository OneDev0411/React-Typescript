import { Dispatcher } from './flux'

import getContacts from '../actions/contacts/get-contacts'
import getTimeline from '../actions/contacts/get-timeline'
import addNote from '../actions/contacts/add-note'
import updateUserTimeline from '../actions/contacts/update-user-timeline'

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

    case 'update-user-timeline':
      updateUserTimeline(payload.user, payload.user_action, payload.object_class, payload.object)
      break

    default:
      return true
  }
  return true
})

export default ContactDispatcher
