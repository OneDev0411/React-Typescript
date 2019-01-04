import * as actionTypes from '../../../../constants/deals'

export function setExpandTask(taskId, isExpanded = false) {
  return {
    type: actionTypes.SET_EXPAND_TASK,
    taskId,
    isExpanded
  }
}
