import * as actionTypes from '../../../../constants/deals'

export function setTasks(tasks) {
  return {
    type: actionTypes.GET_TASKS,
    tasks
  }
}
