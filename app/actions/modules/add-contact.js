// actions/modules/add-contact.js
import _ from 'lodash'
import AppStore from '../../stores/AppStore'

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
  if (AppStore.data.filtered_contacts)
    AppStore.data.filtered_contacts[contact_index] = contact
  AppStore.data.contacts_added[module_type].push(contact)
  if (AppStore.data.new_transaction)
    AppStore.data.new_transaction.contacts_added = AppStore.data.contacts_added
  AppStore.emitChange()
}