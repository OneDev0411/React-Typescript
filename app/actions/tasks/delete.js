// actions/tasks/delete.js
import Task from '../../models/Task'
import AppStore from '../../stores/AppStore'

export default (user, task) => {
  const params = {
    access_token: user.access_token,
    task
  }
  Task.delete(params, () => {
    const tasks = AppStore.data.tasks
    const edited_tasks = tasks.filter(task_loop => {
      return task_loop.id !== task.id
    })
    delete AppStore.data.deleting_task
    AppStore.data.tasks = edited_tasks
    AppStore.emitChange()
  })
}