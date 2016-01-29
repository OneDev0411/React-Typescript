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
  AppStore.emitChange()
  Task.editStatus(params, () => {
  })
}