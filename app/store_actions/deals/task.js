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

function needsAttention(taskId, status) {
  return {
    type: types.CHANGE_NEEDS_ATTENTION,
    taskId,
    status
  }
}

export function setTasks(tasks) {
  return {
    type: types.GET_TASKS,
    tasks
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
    return task
  }
}

export function addAttachment(deal_id, checklist_id, task_id, file) {
  return {
    type: types.ADD_ATTACHMENT,
    task_id,
    file
  }
}

export function changeTaskStatus(taskId, status) {
  return async (dispatch) => {
    await Deal.changeTaskStatus(taskId, status)
    dispatch(changeStatus(taskId, status))
  }
}

export function changeNeedsAttention(taskId, status) {
  return async (dispatch) => {
    await Deal.needsAttention(taskId, status)
    dispatch(needsAttention(taskId, status))
  }
}
