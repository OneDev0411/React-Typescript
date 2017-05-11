import Contact from '../../models/Contact'

// constants
export const types = {
  GET_CONTACTS: 'GET_CONTACTS'
}

const provideContacts = function (contacts) {
  return {
    type: types.GET_CONTACTS,
    contacts
  }
}

export function getContacts(user) {
  const params = {
    access_token: user.access_token
  }

  return async (dispatch) => {
    const response = await Contact.getContacts(params)
    const contacts = response.body.data
    dispatch(provideContacts(contacts))

    return contacts
  }
}
