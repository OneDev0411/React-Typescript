import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function saveSubmission(taskId, pdfUrl, formId, values) {
  return async dispatch => {
    try {
      const submission = await Deal.saveSubmission(
        taskId,
        pdfUrl,
        formId,
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
