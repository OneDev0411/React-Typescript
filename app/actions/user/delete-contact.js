// actions/user/delete-contact.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'

export default (user, contact_id) => {
  const params = {
    access_token: user.access_token,
    contact_id
  }
  User.deleteContact(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      const new_contacts = AppStore.data.contacts.filter(contact => contact.id !== contact_id)
      AppStore.data.contacts = new_contacts
    }
    AppStore.emitChange()
  })
}