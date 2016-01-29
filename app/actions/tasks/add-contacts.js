// actions/tasks/get.js
import Task from '../../models/Task'
import AppStore from '../../stores/AppStore'

export default (user, task, contacts) => {
  const params = {
    access_token: user.access_token,
    task,
    contacts
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