// actions/transactions/new.js
import Transaction from '../../models/Transaction'
import AppStore from '../../stores/AppStore'
export default (user, new_transaction) => {
  let title = 'Transaction w/Out Listing'
  if (new_transaction.listing_data)
    title = new_transaction.listing_data.property.address.street_full
  let contract_price
  const listing_added = new_transaction.listing_added
  const listing_data = new_transaction.listing_data
  const contacts_added = new_transaction.contacts_added
  const dates = new_transaction.dates
  const role_objects = []
  if (contacts_added) {
    const clients = contacts_added.client
    clients.forEach((contact) => {
      let role = 'Other'
      if (contact.role)
        role = contact.role
      const contact_object = {
        contact: contact.id,
        role_types: [role]
      }
      role_objects.push(contact_object)
    })
    const others = contacts_added.contact
    if (others) {
      others.forEach((contact) => {
        let role = 'Other'
        if (contact.role)
          role = contact.role
        const contact_object = {
          contact: contact.id,
          role_types: [role]
        }
        role_objects.push(contact_object)
      })
    }
  }
  if (listing_added) {
    if (new_transaction.listing_added.contract_price)
      contract_price = listing_added.contract_price
    else
      contract_price = listing_added.price
  }
  const params = {
    transaction_type: new_transaction.type,
    listing: listing_added,
    listing_data,
    contract_price,
    title,
    roles: role_objects,
    dates,
    access_token: user.access_token
  }
  Transaction.create(params, (err, response) => {
    if (response.status === 'success') {
      delete AppStore.data.new_transaction.saving
      AppStore.data.new_transaction.saved = true
      const transaction = response.data
      AppStore.data.current_transaction = transaction
      if (!AppStore.data.transaction_tabs)
        AppStore.data.transaction_tabs = []
      AppStore.data.transaction_tabs.push(transaction)
      AppStore.data.transactions.push(transaction)
      const history = require('../../utils/history')
      history.replaceState(null, `/dashboard/transactions/${transaction.id}`)
      AppStore.emitChange()
    } else {
      delete AppStore.data.new_transaction.saving
      AppStore.data.new_transaction.save_error = true
      AppStore.emitChange()
      setTimeout(() => {
        delete AppStore.data.new_transaction.save_error
        AppStore.emitChange()
      }, 3000)
    }
  })
}