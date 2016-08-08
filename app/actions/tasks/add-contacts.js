// actions/tasks/add-contacts.js
import Task from '../../models/Task'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'
import createContacts from './create-contacts'

export default (user, task, contacts) => {
  let contact_ids
  let new_contacts
  contact_ids = _.map(contacts, 'id')
  // Remove placeholder ids
  contact_ids = contact_ids.filter(contact_id => {
    return typeof contact_id === 'string'
  })
  new_contacts = contacts.filter(contact => {
    return contact.type === 'email' || contact.type === 'phone_number'
  })
  const params = {
    access_token: user.access_token,
    task,
    contacts: contact_ids
  }
  Task.addContacts(params, (err, response) => {
    if (response.status === 'success') {
      delete AppStore.data.adding_contacts
      delete AppStore.data.show_contacts_modal
      delete AppStore.data.contacts_added
      AppStore.data.current_task.contacts = response.data.contacts
    }
    AppStore.emitChange()
  })
  // Create contacts then add
  if (new_contacts && new_contacts.length)
    createContacts(user, task, new_contacts)
}