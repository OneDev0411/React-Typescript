// actions/transactions/delete-file.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'

export default (user, transaction, file) => {
  const params = {
    user,
    access_token: user.access_token,
    transaction,
    file
  }
  Transaction.deleteFile(params, (err, response) => {
    if (response.status === 'success') {
      const current_transaction = response.data
      AppStore.data.current_transaction.attachments = current_transaction.attachments
    }
    AppStore.emitChange()
  })
}