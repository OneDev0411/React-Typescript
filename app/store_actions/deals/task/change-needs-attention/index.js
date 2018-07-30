import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function changeNeedsAttention(dealId, taskId, status) {
  return async dispatch => {
    try {
      await Deal.needsAttention(dealId, taskId, status)

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
