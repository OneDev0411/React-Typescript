import types from '../../constants/brandConsole'
import BrandConsole from '../../models/BrandConsole'
import { addNotification as notify } from 'reapop'

function _addTask(checklist) {
  return {
    type: types.ADD_TASK,
    checklist
  }
}

export function addTask(brand_id, checklist_id, task) {
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.addTask(brand_id, checklist_id, task)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      const { data } = response.body

      dispatch(_addTask(data))
    } else {
      dispatch(
        notify({
          message: `addTask: ${response.error.message}`,
          status: 'error'
        })
      )
    }
  }
}

function _deleteTask(checklistId, taskId) {
  return {
    type: types.DELETE_TASK,
    checklistId,
    taskId
  }
}

export function deleteTask(checklist, taskId) {
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.deleteTask(checklist, taskId)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      dispatch(_deleteTask(checklist.id, taskId))
    } else {
      dispatch(
        notify({
          message: `deleteTask: ${response.error.message}`,
          status: 'error'
        })
      )
    }
  }
}

function _editTask(checklistId, task) {
  return {
    type: types.EDIT_TASK,
    checklistId,
    task
  }
}

export function editTask(checklist, task) {
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.editTask(checklist, task)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      dispatch(_editTask(checklist.id, task))
    } else {
      dispatch(
        notify({
          message: `editTask: ${response.error.message}`,
          status: 'error'
        })
      )
    }
  }
}
