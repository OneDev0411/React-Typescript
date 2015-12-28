// actions/get-contacts.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'

export default (user) => {
  const params = {
    access_token: user.access_token
  }
  User.getContacts(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      const contacts = response.data
      AppStore.data.contacts = contacts
    }
    AppStore.emitChange()
  })
}