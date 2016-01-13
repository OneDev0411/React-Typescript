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
      const edited_contact = response.data
      AppDispatcher.dispatch({
        action: 'add-contact',
        contact: edited_contact,
        module_type
      })
      AppStore.emitChange()
    }
  })
}