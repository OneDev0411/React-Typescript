import { normalize } from 'normalizr'

import * as actionTypes from '../../../constants/tasks'

import { tasksSchema } from '../../../models/tasks/schema'
import { selectTasks } from '../../../reducers/tasks/list'
import { createTask as createNewTask } from '../../../models/tasks'

export function createTask(task, query) {
  return async (dispatch, getState) => {
    if (!task || Object.keys(task).length === 0) {
      const error = new Error('New task has not any data.')

      dispatch({
        error,
        type: actionTypes.CREATE_TASK_FAILURE
      })
      throw error
    }

    try {
      dispatch({
        type: actionTypes.CREATE_TASK_REQUEST
      })

      const newTask = await createNewTask(task, query)
      const { tasks: { list } } = getState()
      const tasks = [newTask, ...selectTasks(list)]
      const response = normalize({ tasks }, tasksSchema)

      dispatch({
        response,
        type: actionTypes.CREATE_TASK_SUCCESS
      })

      return newTask
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.CREATE_TASK_FAILURE
      })
      throw error
    }
  }
}
