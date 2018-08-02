import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function deleteTask(checklistId, taskId) {
  return async dispatch => {
    try {
      Deal.deleteTask(taskId)

      dispatch({
        type: actionTypes.DELETE_TASK,
        checklistId,
        taskId
      })
    } catch (e) {
      throw e
    }
  }
}
