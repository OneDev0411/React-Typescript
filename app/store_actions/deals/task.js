import { normalize } from 'normalizr'
import _ from 'underscore'
import types from '../../constants/deals'
import Deal from '../../models/Deal'
import { uploadAttachment } from '../../models/Chatroom'
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
    type: types.CHANGE_ATTENTION_REQUESTED,
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

export function updatesTasks(tasks) {
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
  return async () => {
    const tasks = await Deal.bulkSubmit(dealId, tasksList)

    if (!tasks) {
      return false
    }

    const { entities } = normalize(tasks, schema.taskSchema)

    return entities.tasks
  }
}

export function deleteTask(checklistId, taskId) {
  return async dispatch => {
    Deal.deleteTask(taskId)
    dispatch(taskDeleted(checklistId, taskId))
  }
}

export function updateTask(taskId, attributes) {
  return async dispatch => {
    const task = await Deal.updateTask(taskId, attributes)

    dispatch(taskUpdated(task))
  }
}

export function deleteAttachment(dealId, list) {
  return async dispatch => {
    await Deal.deleteAttachment(dealId, _.keys(list))
    _.each(list, (task, fileId) => dispatch(attachmentDeleted(task, fileId)))
  }
}

export function createFormTask(dealId, form, title, checklist) {
  const task_type = 'Form'
  const status = 'Incomplete'

  return async dispatch => {
    const task = await Deal.createTask(dealId, {
      title,
      status,
      task_type,
      checklist,
      form
    })

    dispatch(addNewTask(dealId, checklist, task))

    return task
  }
}

export function createGenericTask(dealId, title, checklist) {
  const status = 'Incomplete'
  const task_type = 'Generic'

  return async dispatch => {
    const task = await Deal.createTask(dealId, {
      title,
      status,
      task_type,
      checklist
    })

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

export function uploadFile(user, task, file, fileName = null) {
  return async dispatch => {
    try {
      const response = await uploadAttachment(
        task.room.id,
        file,
        fileName || file.name
      )

      const fileData = response.body.data

      Deal.createTaskMessage(task.id, {
        author: user.id,
        room: task.room.id,
        attachments: [fileData.id]
      }).then(() => null)

      // add files to attachments list
      dispatch(addAttachment(task.deal, task.checklist, task.id, fileData))

      return fileData
    } catch (e) {
      return null
    }
  }
}

export function changeTaskStatus(deal_id, status) {
  return async dispatch => {
    await Deal.changeTaskStatus(deal_id, status)
    dispatch(changeStatus(deal_id, status))
  }
}

export function changeNeedsAttention(deal_id, task_id, status) {
  return async dispatch => {
    await Deal.needsAttention(deal_id, task_id, status)
    dispatch(needsAttention(task_id, status))
  }
}
