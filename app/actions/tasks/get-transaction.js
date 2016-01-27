// actions/tasks/get-transaction.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'

export default (user, id) => {
  const params = {
    access_token: user.access_token,
    id
  }
  delete AppStore.data.current_task.transaction_data
  AppStore.data.transaction_loading = true
  AppStore.emitChange()
  Transaction.get(params, (err, response) => {
    if (response.status === 'success') {
      AppStore.data.current_task.transaction_data = response.data
      delete AppStore.data.show_transactions_modal
      delete AppStore.data.transaction_loading
      AppStore.data.current_transaction = response.data
      AppStore.emitChange()
    }
  })
}