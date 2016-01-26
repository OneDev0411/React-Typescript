// actions/transactions/add-roles.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'

export default (user, transaction, contacts) => {
  const contact_objects = []
  contacts.forEach(contact => {
    const contact_object = {
      id: contact.id,
      roles: [contact.role] || ['Other']
    }
    contact_objects.push(contact_object)
  })
  const params = {
    user,
    access_token: user.access_token,
    transaction,
    roles: contact_objects
  }
  Transaction.addRoles(params, (err, response) => {
    if (response.status === 'success') {
      const edited_transaction = response.data
      if (edited_transaction) {
        edited_transaction.drawer = {
          content: 'contacts',
          open: true
        }
        edited_transaction.drawer_active = true
        // console.log(edited_transaction.contacts)
        AppStore.data.current_transaction = edited_transaction
      }
    }
    AppStore.emitChange()
  })
}