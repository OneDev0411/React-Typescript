// actions/tasks/create-contacts.js
import Task from '../../models/Task'
import AppStore from '../../stores/AppStore'
import User from '../../models/User'
import async from 'async'
import _ from 'lodash'
export default (user, task, contacts) => {
  const locals = {}
  async.series([
    (callback) => {
      const params = {
        access_token: user.access_token,
        contacts
      }
      User.createContacts(params, (err, response) => {
        // Success
        if (response.status === 'success') {
          locals.contacts = response.data
          callback()
        }
      })
    },
    () => {
      let contact_ids
      const new_contacts = locals.contacts
      contact_ids = _.map(new_contacts, 'id')
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
    }
  ])
}