import { Dispatcher } from './flux'

import addContact from '../actions/contacts/add-contact'
import deleteAttribute from '../actions/contacts/delete-attribute'
import upsertAttributes from '../actions/contacts/upsert-attributes'
import getContacts from '../actions/contacts/get-contacts'
import getTags from '../actions/contacts/get-tags'
import getTimeline from '../actions/contacts/get-timeline'
import addNote from '../actions/contacts/add-note'
import updateUserTimeline from '../actions/contacts/update-user-timeline'

const ContactDispatcher = new Dispatcher()

// Register callback with ContactDispatcher
ContactDispatcher.register(async (payload) => {
  const action = payload.action

  switch (action) {

    case 'add-contact':
      return await addContact(
        payload.user,
        payload.emails,
        payload.phone_numbers,
        payload.first_name,
        payload.last_name,
        payload.stage
      )

    case 'delete-attribute':
      deleteAttribute(payload.user, payload.id, payload.attribute_id)
      break

    case 'upsert-attributes':
      upsertAttributes(payload.user, payload.id, payload.type, payload.attributes)
      break

    case 'get-contacts':
      getContacts(payload.user)
      break

    case 'get-tags':
      getTags(payload.user)
      break

    case 'get-timeline':
      return await getTimeline(payload.id, payload.user)

    case 'add-note':
      return await addNote(payload.id, payload.user, payload.note)

    case 'update-user-timeline':
      updateUserTimeline(payload.user, payload.user_action, payload.object_class, payload.object)
      break

    default:
      return false
  }
  return false
})

export default ContactDispatcher
