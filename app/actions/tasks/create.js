// actions/tasks/create.js
import Task from '../../models/Task'
import AppStore from '../../stores/AppStore'

export default (user, title) => {
  const params = {
    access_token: user.access_token,
    title
  }
  Task.create(params, (err, response) => {
    const new_task = response.data
    AppStore.data.tasks.unshift(new_task)
    AppStore.emitChange()
  })
}