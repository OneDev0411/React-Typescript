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
      AppStore.data.transactions = transactions
      AppStore.emitChange()
    }
  })
}