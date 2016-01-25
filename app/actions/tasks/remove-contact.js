// actions/tasks/remote-contact.js
import Task from '../../models/Task'
import AppStore from '../../stores/AppStore'

export default (user, task, contact) => {
  const params = {
    access_token: user.access_token,
    task,
    contact
  }
  Task.removeContact(params, (err, response) => {
    if (response.status === 'success') {
      const contacts = response.data.contacts
      AppStore.data.current_task.contacts = contacts
    }
    AppStore.emitChange()
  })
}