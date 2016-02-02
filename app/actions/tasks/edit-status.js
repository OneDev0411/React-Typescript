// actions/tasks/get.js
import Task from '../../models/Task'
import AppStore from '../../stores/AppStore'

export default (user, task, status) => {
  const params = {
    access_token: user.access_token,
    task,
    status
  }
  // show instantly
  const tasks = AppStore.data.tasks
  tasks.forEach((task_loop, i) => {
    if (task_loop.id === task.id)
      tasks[i].status = status
  })
  AppStore.data.tasks = tasks
  const path = AppStore.data.path
  // If on transaction page
  if (path.indexOf('transactions') !== -1) {
    const transaction_tasks = AppStore.data.current_transaction.tasks
    transaction_tasks.forEach((task_loop, i) => {
      if (task_loop.id === task.id)
        transaction_tasks[i].status = status
    })
    AppStore.data.current_transaction.tasks = transaction_tasks
  }
  AppStore.emitChange()
  Task.editStatus(params, () => {
  })
}