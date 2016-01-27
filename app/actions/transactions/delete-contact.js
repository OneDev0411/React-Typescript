// actions/transactions/delete-contact.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'

export default (user, transaction, contact) => {
  const params = {
    user,
    access_token: user.access_token,
    transaction,
    contact
  }
  Transaction.deleteContact(params, (err, response) => {
    if (response.status === 'success') {
      const edited_transaction = response.data
      if (edited_transaction) {
        edited_transaction.drawer = {
          content: 'contacts',
          open: true
        }
        edited_transaction.drawer_active = true
        delete AppStore.data.current_transaction.deleting_contact
        AppStore.data.current_transaction = edited_transaction
      }
    }
    AppStore.emitChange()
  })
}