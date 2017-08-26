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

function _deleteTask(checklistId, taskId) {
  return {
    type: types.DELETE_TASK,
    checklistId,
    taskId
  }
}

export function deleteTask(checklist, taskId) {
  return async (dispatch) => {
    const response = await BrandConsole.deleteTask(checklist, taskId)
    if (response &&
      response.body.status === 'success') {
      dispatch(_deleteTask(checklist.id, taskId))
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
  return async (dispatch) => {
    const response = await BrandConsole.editTask(checklist, task)
    if (response &&
      response.body.status === 'success') {
      dispatch(_editTask(checklist.id, task))
    }
  }
}