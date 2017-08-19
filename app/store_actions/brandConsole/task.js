import types from '../../constants/brandConsole'
import BrandConsole from '../../models/BrandConsole'

function _addTask(task) {
  return {
    type: types.ADD_TASK,
    task
  }
}

export function addTask(user, task) {
  return async (dispatch) => {
    const response = await BrandConsole.addTask(user, task)
    if (response) {
      const { data } = response.body
      dispatch(_addTask(data))
    }
  }
}

function _deleteTask(task_id) {
  return {
    type: types.DELETE_TASK,
    task_id
  }
}

export function deleteTask(task) {
  return async (dispatch) => {
    const response = await BrandConsole.deleteTask(task)
    if (response &&
      response.body.status === 'success') {
      dispatch(_deleteTask(task.id))
    }
  }
}
