import * as actionTypes from '../../constants/deals'
import Deal from '../../models/Deal'

export function updatesTasks(tasks) {
  return {
    type: actionTypes.UPDATE_TASKS,
    tasks
  }
}

export function setTasks(tasks) {
  return {
    type: actionTypes.GET_TASKS,
    tasks
  }
}

export function setSelectedTask(task) {
  return {
    type: actionTypes.SET_SELECTED_TASK,
    task
  }
}

export function deleteTask(checklistId, taskId) {
  return async dispatch => {
    Deal.deleteTask(taskId)

    dispatch({
      type: actionTypes.DELETE_TASK,
      checklistId,
      taskId
    })
  }
}

export function updateTask(taskId, attributes) {
  return async dispatch => {
    const task = await Deal.updateTask(taskId, attributes)

    dispatch({
      type: actionTypes.UPDATE_TASK,
      task
    })
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

    dispatch({
      type: actionTypes.CREATE_TASK,
      deal_id: dealId,
      list_id: checklist,
      task
    })

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

    dispatch({
      type: actionTypes.CREATE_TASK,
      deal_id: dealId,
      list_id: checklist,
      task
    })

    return task
  }
}

export function changeTaskStatus(taskId, status) {
  return async dispatch => {
    await Deal.changeTaskStatus(deal_id, status)

    dispatch({
      type: actionTypes.CHANGE_TASK_STATUS,
      taskId,
      status
    })
  }
}

export function changeNeedsAttention(dealId, taskId, status) {
  return async dispatch => {
    await Deal.needsAttention(dealId, taskId, status)

    dispatch({
      type: actionTypes.CHANGE_ATTENTION_REQUESTED,
      taskId,
      status
    })
  }
}
