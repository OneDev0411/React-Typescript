// actions/transactions/edit.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'

export default (user, transaction, listing_data) => {
  const params = {
    user,
    access_token: user.access_token,
    transaction,
    listing_data
  }
  Transaction.edit(params, (err, response) => {
    // TODO
    if (response.status === 'success') {
      const edited_transaction = response.data
      if (edited_transaction)
        AppStore.data.current_transaction = edited_transaction
    }
    delete AppStore.data.current_transaction.editing
    delete AppStore.data.current_transaction.show_edit_modal
    AppStore.emitChange()
  })
}