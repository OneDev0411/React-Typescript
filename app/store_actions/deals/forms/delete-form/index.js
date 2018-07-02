import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function deleteForm(checklist, formId) {
  return async dispatch => {
    try {
      await Deal.deleteForm(checklist, formId)

      dispatch({
        type: actionTypes.DELETE_FORM,
        checklistId: checklist.id,
        formId
      })
    } catch (e) {
      throw e
    }
  }
}
