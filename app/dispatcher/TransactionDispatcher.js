// TransactionDispatcher.js
import { Dispatcher } from 'flux'

// Transaction actions
import newTransaction from '../actions/transactions/new'
import deleteTransaction from '../actions/transactions/delete'
import getAllTransactions from '../actions/transactions/get'

const TransactionDispatcher = new Dispatcher()

// Register callback with TransactionDispatcher
TransactionDispatcher.register(payload => {
  const action = payload.action
  switch (action) {
    case 'init':
      newTransaction.init()
      break

    case 'go-to-step':
      newTransaction.goToStep(payload.step)
      break

    case 'set-type':
      newTransaction.setType(payload.type)
      break

    case 'create':
      newTransaction.create(payload.user, payload.new_transaction)
      break

    case 'get-all':
      getAllTransactions(payload.user)
      break

    case 'delete-transaction':
      deleteTransaction(payload.user, payload.id)
      break

    default:
      return true
  }
  return true
})

export default TransactionDispatcher