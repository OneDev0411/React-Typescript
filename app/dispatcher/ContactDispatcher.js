import { Dispatcher } from './flux'

import getContacts from '../actions/contacts/get-contacts'

const ContactDispatcher = new Dispatcher()

// Register callback with ContactDispatcher
ContactDispatcher.register(async (payload) => {
  const action = payload.action

  switch (action) {

    case 'get-contacts':
      getContacts(payload.user)
      break

    default:
      return true
  }
  return true
})

export default ContactDispatcher
