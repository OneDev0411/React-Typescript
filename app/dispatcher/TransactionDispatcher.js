// TransactionDispatcher.js
import { Dispatcher } from 'flux'

// Transaction actions
import newTransaction from '../actions/transactions/new'
import createTransaction from '../actions/transactions/create'
import deleteTransaction from '../actions/transactions/delete'
import getAllTransactions from '../actions/transactions/get'
import uploadFiles from '../actions/transactions/upload-files'
import editTransaction from '../actions/transactions/edit'
import addContacts from '../actions/transactions/add-contacts'
import deleteContact from '../actions/transactions/delete-contact'

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
      createTransaction(payload.user, payload.new_transaction)
      break

    case 'get-all':
      getAllTransactions(payload.user)
      break
    case 'edit-transaction':
      editTransaction(payload.user, payload.transaction, payload.listing_data)
      break

    case 'delete-transaction':
      deleteTransaction(payload.user, payload.id)
      break

    case 'upload-files':
      uploadFiles(payload.user, payload.transaction, payload.files)
      break

    case 'add-contacts':
      addContacts(payload.user, payload.transaction, payload.contacts)
      break

    case 'delete-contact':
      deleteContact(payload.user, payload.transaction, payload.contact)
      break

    default:
      return true
  }
  return true
})

export default TransactionDispatcher