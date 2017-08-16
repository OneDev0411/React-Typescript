import types from '../../constants/deals'
import Deal from '../../models/Deal'

function addNewTask(deal_id, list_id, task) {
  return {
    type: types.CREATE_TASK,
    deal_id,
    list_id,
    task
  }
}

function changeStatus(taskId, status) {
  return {
    type: types.CHANGE_TASK_STATUS,
    taskId,
    status
  }
}

export function setIsUploading(taskId, status) {
  return {
    type: types.IS_UPLOADING,
    taskId,
    status
  }
}

export function createTask(deal_id, form, title, status, task_type, list_id) {
  return async (dispatch) => {
    const task = await Deal.createTask(deal_id, form, title, status, task_type, list_id)
    dispatch(addNewTask(deal_id, list_id, task))
  }
}

export function addAttachment(deal_id, checklist_id, task_id, file) {
  return {
    type: types.ADD_ATTACHMENT,
    task_id,
    file
  }
}

export function submitForReview(taskId) {
  return async (dispatch) => {
    await Deal.submitForReview(taskId)
    dispatch(changeStatus(taskId, 'Submitted'))
  }
}

export function cancelTaskReview(taskId) {
  return async (dispatch) => {
    await Deal.cancelTaskReview(taskId)
    dispatch(changeStatus(taskId, 'Incomplete'))
  }
}
