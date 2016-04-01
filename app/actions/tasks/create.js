// actions/tasks/create.js
import Task from '../../models/Task'
import AppStore from '../../stores/AppStore'

// Dispatcher
import TaskDispatcher from '../../dispatcher/TaskDispatcher'

export default (user, title, due_date, contacts, transaction) => {
  let due_time
  if (due_date)
    due_time = due_date
  else
    due_time = (new Date().getTime()) / 1000
  const params = {
    access_token: user.access_token,
    title,
    due_date: due_time,
    private: false
  }
  Task.create(params, (err, response) => {
    const new_task = response.data
    delete AppStore.data.new_task
    AppStore.data.tasks.unshift(new_task)
    AppStore.data.current_task = new_task
    AppStore.data.current_task.drawer = true
    AppStore.data.current_task.drawer_active = true
    AppStore.emitChange()
    // Then add contacts
    if (contacts) {
      const payload = {
        action: 'add-contacts',
        user,
        task: new_task,
        contacts
      }
      // Add transaction
      if (transaction)
        payload.transaction = transaction
      TaskDispatcher.dispatch(payload)
    }
  })
}