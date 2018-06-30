import * as actionTypes from '../../../../constants/deals'

export function setSelectedTask(task) {
  return {
    type: actionTypes.SET_SELECTED_TASK,
    task
  }
}
