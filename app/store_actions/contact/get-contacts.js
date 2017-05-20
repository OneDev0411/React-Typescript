import _ from 'underscore'
import Contact from '../../models/Contact'
import types from '../../constants/contact'

function getContacts (contacts) {
  return {
    type: types.GET_CONTACTS,
    contacts
  }
}

export default function (user = {}) {
  return async (dispatch) => {
    const response = await Contact.getContacts(user)
    const contacts = _.indexBy(response.body.data, 'id')
    dispatch(getContacts(contacts))
  }
}
