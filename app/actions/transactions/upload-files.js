// actions/transactions/upload-files.js
import Transaction from '../../models/Transaction'
// import AppStore from '../../stores/AppStore'
export default (user, transaction, files) => {
  const params = {
    files,
    id: transaction.id,
    access_token: user.access_token
  }
  Transaction.uploadFiles(params, (err, response) => {
    if (response.status === 'success') {
      // console.log('success')
    } else {
      // console.log('fail')
    }
  })
}