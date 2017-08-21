import types from '../../constants/brandConsole'
import BrandConsole from '../../models/BrandConsole'

function _addTask(checklist) {
  return {
    type: types.ADD_TASK,
    checklist
  }
}

export function addTask(brand_id, checklist_id, task) {
  return async (dispatch) => {
    const response = await BrandConsole.addTask(brand_id, checklist_id, task)
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
