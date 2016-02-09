// actions/tasks/edit-date.js
import Task from '../../models/Task'

export default (user, task, due_date) => {
  const params = {
    access_token: user.access_token,
    id: task.id,
    due_date
  }
  Task.editDate(params, () => {
  })
}