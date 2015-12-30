// actions/modules/add-contact.js
import _ from 'lodash'
import AppStore from '../../stores/AppStore'
import removeContact from './remove-contact'

export default (contact, module_type) => {
  if (!AppStore.data.contacts_added) {
    AppStore.data.contacts_added = {}
    AppStore.data.contacts_added[module_type] = []
  } else {
    if (!AppStore.data.contacts_added[module_type])
      AppStore.data.contacts_added[module_type] = []
  }
  const contacts_added = AppStore.data.contacts_added[module_type]
  const filtered_contacts = AppStore.data.filtered_contacts
  const in_array = _.findWhere(contacts_added, { id: contact.id })
  const contact_index = _.findIndex(filtered_contacts, { id: contact.id })
  contact.added = true
  if (!in_array) {
    AppStore.data.filtered_contacts[contact_index] = contact
    AppStore.data.contacts_added[module_type].push(contact)
    AppStore.emitChange()
  } else
    removeContact(contact.id, module_type)
}