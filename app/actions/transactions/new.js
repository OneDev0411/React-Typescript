// actions/transactions/new.js
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
  setType: (transaction_type) => {
    AppStore.data.new_transaction.type = transaction_type
    AppStore.emitChange()
  }
}