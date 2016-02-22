// actions/user/edit-contact.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'
import AppDispatcher from '../../dispatcher/AppDispatcher'

export default (user, contact, module_type) => {
  const params = {
    access_token: user.access_token,
    contact
  }
  User.editContact(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      let edited_contact = response.data
      // If on contacts page
      if (module_type === 'contacts') {
        AppStore.data.current_contact = edited_contact
        delete AppStore.data.saving_contact
        AppStore.emitChange()
        return
      }
      // Else add contact to other object
      // If creating transaction
      if (contact.role) {
        edited_contact = {
          ...response.data,
          role: contact.role
        }
      }
      AppDispatcher.dispatch({
        action: 'add-contact',
        contact: edited_contact,
        module_type
      })
      AppStore.emitChange()
    }
  })
}