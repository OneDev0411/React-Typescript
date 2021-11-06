import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function saveSubmission(taskId, pdfUrl, formId, values, instructions) {
  return async dispatch => {
    try {
      const submission = await Deal.saveSubmission(
        taskId,
        pdfUrl,
        formId,
        values,
        instructions
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
