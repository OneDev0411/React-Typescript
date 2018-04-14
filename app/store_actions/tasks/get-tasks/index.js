import { normalize } from 'normalizr'
import * as actionTypes from '../../../constants/tasks'
import { tasksSchema } from '../../../models/tasks/schema'
import { isFetchingTasks } from '../../../reducers/tasks/list'
import { getTasks as fetchTasks } from '../../../models/tasks/get-tasks'

export function getTasks(query = {}) {
  return async (dispatch, getState) => {
    const { tasks: { list } } = getState()

    if (isFetchingTasks(list)) {
      return Promise.resolve()
    }

    try {
      dispatch({
        type: actionTypes.FETCH_TASKS_REQUEST
      })

      let response = await fetchTasks(query)
      const { data, info } = response
      const tasks = { tasks: data }
      const normalizedData = normalize(tasks, tasksSchema)

      response = {
        info,
        ...normalizedData
      }

      dispatch({
        response,
        type: actionTypes.FETCH_TASKS_SUCCESS
      })
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.FETCH_TASKS_FAILURE
      })
    }
  }
}
