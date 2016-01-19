// actions/transactions/delete.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'

export default (user, id) => {
  const params = {
    id,
    access_token: user.access_token
  }
  Transaction.delete(params, (err, response) => {
    if (response.status === 'success') {
      let transactions = AppStore.data.transactions
      transactions = transactions.filter(transaction => {
        return transaction.id !== id
      })
      delete AppStore.data.deleting_transaction
      delete AppStore.data.current_transaction
      AppStore.data.transactions = transactions
      const transaction_tabs = AppStore.data.transaction_tabs
      const reduced_transaction_tabs = transaction_tabs.filter(transaction => {
        return transaction.id !== id
      })
      AppStore.data.transaction_tabs = reduced_transaction_tabs
      AppStore.emitChange()
    }
  })
}