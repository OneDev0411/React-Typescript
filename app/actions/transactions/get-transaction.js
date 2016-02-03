// actions/transactions/get-transaction.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'

export default (user, id) => {
  const params = {
    access_token: user.access_token,
    user,
    id
  }
  Transaction.get(params, (err, response) => {
    if (response.status === 'success') {
      const current_transaction = response.data
      AppStore.data.current_transaction = current_transaction
      if (!AppStore.data.transaction_tabs)
        AppStore.data.transaction_tabs = []
      if (!_.find(AppStore.data.transaction_tabs, { id: current_transaction.id }))
        AppStore.data.transaction_tabs.push(current_transaction)
      AppStore.emitChange()
    }
  })
}