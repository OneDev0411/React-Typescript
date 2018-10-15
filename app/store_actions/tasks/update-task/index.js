import { normalize } from 'normalizr'
import * as actionTypes from '../../../constants/tasks'
import { tasksSchema } from '../../../models/tasks/schema'
import { updateTask as postTask } from '../../../models/tasks/update-task'

export function updateTask(task, query = {}) {
  return async dispatch => {
    if (!task || !task.id) {
      error = new Error('Task is required.')

      dispatch({
        error,
        type: actionTypes.UPDATE_TASK_FAILURE
      })
      throw error
    }

    try {
      dispatch({
        type: actionTypes.UPDATE_TASK_REQUEST
      })

      const updatedTask = await postTask(task, query)
      const newTask = {
        ...task,
        ...updatedTask
      }
      const response = normalize({ tasks: [newTask] }, tasksSchema)

      dispatch({
        response,
        type: actionTypes.UPDATE_TASK_SUCCESS
      })

      return newTask
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.UPDATE_TASK_FAILURE
      })
    }
  }
}
