import * as actionTypes from '../../../../constants/deals'
import { updateNeedsAttention } from '../../../../models/Deal/task'

export function changeNeedsAttention(dealId, taskId, status) {
  return async dispatch => {
    try {
      await updateNeedsAttention(dealId, taskId, status)

      dispatch({
        type: actionTypes.CHANGE_ATTENTION_REQUESTED,
        taskId,
        status
      })
    } catch (e) {
      throw e
    }
  }
}
