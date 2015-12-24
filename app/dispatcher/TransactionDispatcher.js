// TransactionDispatcher.js
import { Dispatcher } from 'flux'

// New transaction actions
import createTransaction from '../actions/transactions/create'

const TransactionDispatcher = new Dispatcher()

// Register callback with TransactionDispatcher
TransactionDispatcher.register(payload => {
  const action = payload.action
  switch (action) {
    case 'init':
      createTransaction.init()
      break

    case 'go-to-step':
      createTransaction.goToStep(payload.step)
      break

    case 'set-type':
      createTransaction.setType(payload.type)
      break

    default:
      return true
  }
  return true
})

export default TransactionDispatcher