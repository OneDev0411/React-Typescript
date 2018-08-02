import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function saveSubmission(taskId, formId, state, values) {
  return async dispatch => {
    try {
      const submission = await Deal.saveSubmission(
        taskId,
        formId,
        state,
        values
      )

      dispatch({
        type: actionTypes.UPDATE_SUBMISSION,
        taskId,
        submission
      })
    } catch (e) {
      throw e
    }
  }
}
