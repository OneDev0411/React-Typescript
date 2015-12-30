// actions/transactions/get.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'

export default (user) => {
  const params = {
    access_token: user.access_token
  }
  Transaction.getAll(params, (err, response) => {
    AppStore.data.transactions = response.data
    AppStore.emitChange()
  })
}