// actions/tasks/create.js
import Task from '../../models/Task'
import AppStore from '../../stores/AppStore'

export default (user, title, due_date) => {
  const params = {
    access_token: user.access_token,
    title,
    due_date
  }
  Task.create(params, (err, response) => {
    const new_task = response.data
    delete AppStore.data.new_task
    AppStore.data.tasks.unshift(new_task)
    AppStore.emitChange()
  })
}