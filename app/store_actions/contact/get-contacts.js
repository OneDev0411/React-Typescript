import _ from 'underscore'
import Contact from '../../models/Contact'
import types from '../../constants/contact'

function contactsFetched(contacts) {
  return {
    type: types.GET_CONTACTS,
    contacts
  }
}

export function getContacts(user = {}) {
  return async dispatch => {
    try {
      const list = await Contact.getContacts(user)
      const contacts = _.indexBy(list, 'id')

      dispatch(contactsFetched(contacts))
    } catch (e) {}
  }
}
