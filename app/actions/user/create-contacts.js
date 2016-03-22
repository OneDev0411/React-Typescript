// actions/user/create-contacts.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'
import AppDispatcher from '../../dispatcher/AppDispatcher'

export default (user, contacts, module_type) => {
  const params = {
    access_token: user.access_token,
    contacts
  }
  User.createContacts(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      const new_contacts = [...AppStore.data.contacts, ...response.data]
      AppStore.data.contacts = new_contacts
      const add_contacts = response.data
      // Send to add-contact action
      if (module_type) {
        AppDispatcher.dispatch({
          action: 'add-contacts',
          contacts: add_contacts,
          module_type
        })
      }
      AppStore.emitChange()
    }
  })
}