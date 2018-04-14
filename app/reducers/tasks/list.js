import { combineReducers } from 'redux'
import * as actionTypes from '../../constants/tasks'

const byId = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TASK_SUCCESS:
    case actionTypes.UPDATE_TASK_SUCCESS:
    case actionTypes.FETCH_TASKS_SUCCESS:
      return {
        ...state,
        ...action.response.entities.tasks
      }

    case actionTypes.CREATE_TASK_SUCCESS:
      return action.response.entities.tasks

    case actionTypes.DELETE_TASK_SUCCESS:
      const { tasks } = action.response.entities

      if (!tasks) {
        return {}
      }

      return tasks
    default:
      return state
  }
}

const ids = (state = [], action) => {
  switch (action.type) {
    case actionTypes.FETCH_TASK_SUCCESS:
    case actionTypes.UPDATE_TASK_SUCCESS:
    case actionTypes.FETCH_TASKS_SUCCESS:
      const newState = [...state, ...action.response.result.tasks]

      // removing duplicates
      return [...new Set(newState)]

    case actionTypes.CREATE_TASK_SUCCESS:
    case actionTypes.DELETE_TASK_SUCCESS:
      return action.response.result.tasks
    default:
      return state
  }
}

export const info = (state = { total: 0, count: 0 }, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TASKS_SUCCESS:
      return action.response.info
    default:
      return state
  }
}

const isFetching = (state = false, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TASKS_REQUEST:
      return true
    case actionTypes.FETCH_TASKS_SUCCESS:
    case actionTypes.FETCH_TASKS_FAILURE:
      return false
    default:
      return state
  }
}

const error = (state = null, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TASKS_FAILURE:
      return action.error
    case actionTypes.FETCH_TASKS_SUCCESS:
      return null
    default:
      return state
  }
}

export const list = combineReducers({
  ids,
  byId,
  info,
  error,
  isFetching
})

export const selectTask = (state, taskId) => state.byId[taskId]

export const selectTasks = state => state.ids.map(id => state.byId[id])

export const getTasksInfo = state => state.info

export const isFetchingTasks = state => state.isFetching

export const getFetchTasksError = state => state.errorMessage
