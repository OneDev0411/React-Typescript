// actions/tasks/get.js
import Task from '../../models/Task'
import AppStore from '../../stores/AppStore'
import TaskDispatcher from '../../dispatcher/TaskDispatcher'

export default (user, task, transaction) => {
  const params = {
    access_token: user.access_token,
    task: task.id,
    transaction: transaction.id
  }
  delete AppStore.data.show_transactions_modal
  delete AppStore.data.current_task.transaction_data
  AppStore.data.transaction_loading = true
  AppStore.emitChange()
  Task.addTransaction(params, (err, response) => {
    if (response.status === 'success') {
      const transaction_id = response.data.transaction
      AppStore.data.current_task.transaction = response.data.transaction
      AppStore.emitChange()
      // Get transaction
      TaskDispatcher.dispatch({
        action: 'get-transaction',
        user,
        id: transaction_id
      })
    }
  })
}