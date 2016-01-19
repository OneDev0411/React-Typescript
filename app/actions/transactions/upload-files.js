// actions/transactions/upload-files.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'

export default (user, transaction, files) => {
  const params = {
    files,
    id: transaction.id,
    access_token: user.access_token
  }
  Transaction.uploadFiles(params, (err, response) => {
    // console.log(response)
    if (response.status === 200) {
      const data = response.body.data
      const attachments = data.attachments
      AppStore.data.current_transaction.attachments = attachments.reverse()
      AppStore.emitChange()
    } else {
      // console.log('fail')
    }
  })
}