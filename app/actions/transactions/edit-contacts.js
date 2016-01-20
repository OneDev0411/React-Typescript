// actions/transactions/edit-contacts.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'

export default (user, transaction, contacts) => {
  const params = {
    id: transaction.id,
    access_token: user.access_token,
    contacts
  }
  Transaction.edit(params, (err, response) => {
    // TODO
    if (response.status === 'success') {
      const edited_transaction = response.data
      if (edited_transaction)
        AppStore.data.current_transaction = edited_transaction
    }
    AppStore.emitChange()
  })
}