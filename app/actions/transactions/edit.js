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
      AppStore.data.current_transaction = edited_transaction
      const transactions = AppStore.data.transactions
      const new_transactions = transactions.filter(transaction_loop => transaction_loop.id !== edited_transaction.id)
      new_transactions.push(edited_transaction)
      AppStore.data.transactions = new_transactions
    }
    delete AppStore.data.current_transaction.editing
    delete AppStore.data.current_transaction.show_edit_modal
    AppStore.emitChange()
  })
}