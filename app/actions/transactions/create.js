// actions/transactions/create.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'

export default {
  init: () => {
    AppStore.data.new_transaction = {
      step: 0,
      total_steps: 5
    }
    AppStore.emitChange()
  },
  goToStep: (step) => {
    AppStore.data.new_transaction.step = step
    AppStore.emitChange()
  },
  setType: (type) => {
    AppStore.data.new_transaction.type = type
    AppStore.emitChange()
  },
  create: (user, new_transaction) => {
    let title = 'New Transaction w/Out Listing'
    if (new_transaction.listing_added)
      title = 'New Transaction w/Listing'
    let contract_price
    const listing_added = new_transaction.listing_added
    if (listing_added) {
      if (new_transaction.listing_added.contract_price)
        contract_price = listing_added.contract_price
      else
        contract_price = listing_added.price
    }
    const params = {
      transaction_type: new_transaction.type,
      listing: listing_added,
      contract_price,
      title,
      access_token: user.access_token
    }
    Transaction.create(params, (err, response) => {
      if (response.status === 'success') {
        delete AppStore.data.new_transaction.saving
        AppStore.data.new_transaction.saved = true
        AppStore.data.new_transaction.redirect_to = '/dashboard/transactions'
        AppStore.emitChange()
      }
    })
  }
}