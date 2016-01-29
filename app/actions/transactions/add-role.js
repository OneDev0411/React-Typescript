// actions/transactions/add-role.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'

export default (user, transaction, contact) => {
  let role = 'Other'
  if (contact.role)
    role = contact.role
  const role_object = {
    contact: contact.id,
    role_types: [role]
  }
  const params = {
    user,
    access_token: user.access_token,
    transaction,
    role: role_object
  }
  Transaction.addRole(params, (err, response) => {
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