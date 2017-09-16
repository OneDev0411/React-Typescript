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
    try {
      const list = await Contact.getContacts(user)
      const contacts = _.indexBy(list, 'id')
      dispatch(getContacts(contacts))
    } catch(e) {
      console.log(e)
    }
  }
}
