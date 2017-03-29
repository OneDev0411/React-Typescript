// actions/modules/remove-contact.js
import _ from 'lodash'
import AppStore from '../../stores/AppStore'

export default (contact_id, module_type) => {
  const contacts_added = AppStore.data.contacts_added[module_type]
  const filtered_contacts = AppStore.data.filtered_contacts
  if (filtered_contacts) {
    const contact = _.find(contacts_added, { id: contact_id })
    const contact_index = _.findIndex(filtered_contacts, { id: contact_id })
    delete contact.added
    AppStore.data.filtered_contacts[contact_index] = contact
  }
  const contacts_added_edited = contacts_added.filter((contact_loop) => {
    if (contact_loop)
      return contact_loop.id !== contact_id
  })
  AppStore.data.contacts_added[module_type] = contacts_added_edited
  if (AppStore.data.new_transaction)
    AppStore.data.new_transaction.contacts_added = AppStore.data.contacts_added
  AppStore.emitChange()
}