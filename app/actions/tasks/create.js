// actions/tasks/create.js
import Task from '../../models/Task'
import AppStore from '../../stores/AppStore'

// Dispatcher
import TaskDispatcher from '../../dispatcher/TaskDispatcher'

export default (user, title, due_date, contacts, transaction) => {
  const params = {
    access_token: user.access_token,
    title,
    due_date
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
    TaskDispatcher.dispatch({
      action: 'add-contacts',
      user,
      task: new_task,
      contacts
    })
    // Add transaction
    if (transaction) {
      TaskDispatcher.dispatch({
        action: 'add-transaction',
        user,
        transaction,
        task: new_task
      })
    }
  })
}