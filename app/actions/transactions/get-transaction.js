// actions/transactions/get-transaction.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'

export default (user, id) => {
  const params = {
    access_token: user.access_token,
    user,
    id
  }
  Transaction.get(params, (err, response) => {
    if (response.status === 'success') {
      AppStore.data.current_transaction = response.data
      AppStore.emitChange()
    }
  })
}