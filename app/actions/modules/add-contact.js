// actions/modules/add-contact.js
import _ from 'lodash'
import AppStore from '../../stores/AppStore'
import TransactionDispatcher from '../../dispatcher/TransactionDispatcher'

export default (contact, module_type) => {
  if (!AppStore.data.contacts_added) {
    AppStore.data.contacts_added = {}
    AppStore.data.contacts_added[module_type] = []
  } else {
    if (!AppStore.data.contacts_added[module_type])
      AppStore.data.contacts_added[module_type] = []
  }
  const filtered_contacts = AppStore.data.filtered_contacts
  const contact_index = _.findIndex(filtered_contacts, { id: contact.id })
  contact.added = true
  delete AppStore.data.show_contact_modal
  delete AppStore.data.creating_contacts
  delete AppStore.data.new_contact_modal

  // Global add contacts
  if (AppStore.data.filtered_contacts)
    AppStore.data.filtered_contacts[contact_index] = contact
  const added_already = _.findWhere(AppStore.data.contacts_added[module_type], { id: contact.id })
  if (!added_already)
    AppStore.data.contacts_added[module_type].push(contact)

  // New transaction
  if (AppStore.data.new_transaction)
    AppStore.data.new_transaction.contacts_added = AppStore.data.contacts_added

  // Editing a transaction
  if (module_type === 'transaction') {
    const user = AppStore.data.user
    const transaction = AppStore.data.current_transaction
    const contacts = transaction.contacts
    contacts.push(contact)
    TransactionDispatcher.dispatch({
      action: 'add-contacts',
      user,
      transaction,
      contacts
    })
  }
  delete AppStore.data.filtered_contacts
  AppStore.emitChange()
}