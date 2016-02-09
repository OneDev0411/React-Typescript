// actions/transactions/upload-files.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'

export default (user, transaction, files) => {
  const params = {
    files,
    id: transaction.id,
    access_token: user.access_token
  }
  Transaction.uploadFiles(params, request => {
    request.on('progress', e => {
      const upload_percent = e.percent
      const uploading_file = _.find(AppStore.data.current_transaction.attachments, { name: files[0].name })
      if (uploading_file) {
        uploading_file.upload_percent = upload_percent
        const uploading_file_index = _.indexOf(AppStore.data.current_transaction.attachments, uploading_file)
        AppStore.data.current_transaction.attachments[uploading_file_index] = uploading_file
        AppStore.emitChange()
      }
    })
    request.end((err, res) => {
      if (err)
        return err
      const data = res.body.data
      const attachments = data.attachments
      AppStore.data.current_transaction.attachments = attachments.reverse()
      AppStore.emitChange()
    })
  })
}