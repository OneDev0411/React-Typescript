// actions/transactions/edit.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'

export default (user, transaction, listing_data) => {
  const params = {
    id: transaction.id,
    access_token: user.access_token,
    listing_data
  }
  Transaction.edit(params, (err, response) => {
    // console.log(response)
    // TODO
    if (response.status === 'success') {
      const edited_transaction = response.data
      if (edited_transaction)
        AppStore.data.current_transaction = edited_transaction
    }
    delete AppStore.data.current_transaction.editing
    delete AppStore.data.current_transaction.show_edit_modal
    AppStore.emitChange()
  })
}