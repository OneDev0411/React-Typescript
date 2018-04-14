import { normalize } from 'normalizr'

import { tasksSchema } from '../../../models/tasks/schema'
import * as actionTypes from '../../../constants/tasks'
import { selectTasks } from '../../../reducers/tasks/list'
import { deleteTask as removeTask } from '../../../models/tasks/delete-task'

export function deleteTask(taskId) {
  return async (dispatch, getState) => {
    if (!taskId) {
      const error = new Error('task id is required.')

      dispatch({
        error,
        type: actionTypes.DELETE_TASK_FAILURE
      })
      throw error
    }

    try {
      dispatch({
        type: actionTypes.DELETE_TASK_REQUEST
      })

      await removeTask(taskId)

      const { tasks: { list } } = getState()
      const tasksList = selectTasks(list)
      const tasks = tasksList.filter(({ id }) => id !== taskId)
      const response = normalize({ tasks }, tasksSchema)

      dispatch({
        response,
        type: actionTypes.DELETE_TASK_SUCCESS
      })
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.DELETE_TASK_FAILURE
      })
      throw error
    }
  }
}
