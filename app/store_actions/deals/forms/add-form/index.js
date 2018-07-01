import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function addForm(brandId, checklistId, formId) {
  return async dispatch => {
    const checklist = await Deal.addForm(brandId, checklistId, formId)

    dispatch({
      type: actionTypes.ADD_FORM,
      checklist
    })
  }
}
