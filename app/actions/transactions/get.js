// actions/transactions/get.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'

export default (user) => {
  const params = {
    access_token: user.access_token
  }
  AppStore.data.getting_transactions = true
  AppStore.emitChange()
  Transaction.getAll(params, (err, response) => {
    AppStore.data.transactions = response.data
    delete AppStore.data.getting_transactions
    AppStore.data.transactions_loaded = true
    AppStore.emitChange()
  })
}