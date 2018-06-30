import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function changeTaskStatus(taskId, status) {
  return async dispatch => {
    try {
      await Deal.changeTaskStatus(deal_id, status)

      dispatch({
        type: actionTypes.CHANGE_TASK_STATUS,
        taskId,
        status
      })
    } catch (e) {
      throw e
    }
  }
}
