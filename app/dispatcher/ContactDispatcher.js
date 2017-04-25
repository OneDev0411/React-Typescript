import { Dispatcher } from './flux'

import addContact from '../actions/contacts/add-contact'
import updateStage from '../actions/contacts/update-stage'
import updateTags from '../actions/contacts/update-tags'
import getContacts from '../actions/contacts/get-contacts'
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

    case 'update-tags':
      updateTags(payload.user, payload.id, payload.new_tags, payload.remove_tags)
      break

    case 'update-stage':
      updateStage(payload.user, payload.id, payload.stage_id, payload.stage)
      break

    case 'get-contacts':
      getContacts(payload.user)
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
