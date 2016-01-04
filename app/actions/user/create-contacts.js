// actions/user/create-contacts.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'

export default (user, contacts) => {
  const params = {
    access_token: user.access_token,
    contacts
  }
  User.createContacts(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      const new_contacts = [...AppStore.data.contacts, ...response.data]
      AppStore.data.contacts = new_contacts
    }
    AppStore.data.new_contact_created = true
    delete AppStore.data.creating_contacts
    AppStore.emitChange()
    setTimeout(() => {
      delete AppStore.data.new_contact_created
      AppStore.emitChange()
    }, 5000)
  })
}