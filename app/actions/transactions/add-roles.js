// actions/transactions/add-roles.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'

export default (user, transaction, contacts) => {
  const contact_objects = []
  contacts.forEach(contact => {
    let role = 'Other'
    if (contact.role)
      role = contact.role
    const contact_object = {
      id: contact.id,
      role_types: [role]
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
        AppStore.data.current_transaction = edited_transaction
      }
    }
    AppStore.emitChange()
  })
}