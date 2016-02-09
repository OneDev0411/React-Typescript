// actions/tasks/get.js
import Task from '../../models/Task'

export default (user, task, title) => {
  const params = {
    access_token: user.access_token,
    id: task.id,
    title
  }
  Task.editTitle(params, () => {
  })
}