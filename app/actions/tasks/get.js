// actions/transactions/get.js
import Task from '../../models/Task'
import AppStore from '../../stores/AppStore'

export default (user) => {
  const params = {
    access_token: user.access_token
  }
  Task.getAll(params, (err, response) => {
    AppStore.data.tasks = response.data
    delete AppStore.data.getting_tasks
    AppStore.emitChange()
  })
}