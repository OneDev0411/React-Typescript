// actions/acknowledge-transaction.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'

export default (user, transaction) => {
  if (!AppStore.data.notifications)
    return false
  const summary = AppStore.data.notifications.summary
  summary.transaction_notification_count--
  summary.transactions_ids = summary.transaction_ids.splice(transaction, 1)

  AppStore.emitChange()

  const params = {
    transaction,
    access_token: user.access_token
  }
  Transaction.acknowledge(params, () => {})
}