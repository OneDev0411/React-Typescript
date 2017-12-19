import types from '../../constants/deals'
import Deal from '../../models/Deal'
import { normalize } from 'normalizr'
import * as schema from './schema'

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

function attachmentDeleted(task, file_id) {
  return {
    type: types.DELETE_ATTACHMENT,
    task_id: task.id,
    file_id
  }
}

function taskDeleted(checklistId, taskId) {
  return {
    type: types.DELETE_TASK,
    checklistId,
    taskId
  }
}

function taskUpdated(task) {
  return {
    type: types.UPDATE_TASK,
    task
  }
}

function tasksUpdated(tasks) {
  return {
    type: types.UPDATE_TASKS,
    tasks
  }
}

export function setTasks(tasks) {
  return {
    type: types.GET_TASKS,
    tasks
  }
}

export function setSelectedTask(task) {
  return {
    type: types.SET_SELECTED_TASK,
    task
  }
}

export function bulkSubmit(dealId, tasksList) {
  return async (dispatch) => {
    const data = await Deal.bulkSubmit(dealId, tasksList)

    const { entities } = normalize(data, schema.taskSchema)

    dispatch(tasksUpdated(entities.tasks))
  }
}

export function deleteTask(checklistId, taskId) {
  return async (dispatch) => {
    Deal.deleteTask(taskId)
    dispatch(taskDeleted(checklistId, taskId))
  }
}

export function updateTask(taskId, attributes) {
  return async (dispatch) => {
    const task = await Deal.updateTask(taskId, attributes)

    dispatch(taskUpdated(task))
  }
}

export function deleteAttachment(task, fileId) {
  return async (dispatch) => {
    await Deal.deleteAttachment(task.room.id, fileId)
    dispatch(attachmentDeleted(task, fileId))
  }
}

export function createFormTask(dealId, form, title, checklist) {
  const task_type = 'Form'
  const status = 'Incomplete'

  return async (dispatch) => {
    const task = await Deal.createTask(dealId, { title, status, task_type, checklist, form })

    dispatch(addNewTask(dealId, checklist, task))

    return task
  }
}

export function createGenericTask(dealId, title, checklist) {
  const status = 'Incomplete'
  const task_type = 'Generic'

  return async (dispatch) => {
    const task = await Deal.createTask(dealId, { title, status, task_type, checklist })

    dispatch(addNewTask(dealId, checklist, task))

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
