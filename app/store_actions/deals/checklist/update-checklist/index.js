import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function updateChecklist(dealId, checklistId, attributes) {
  return async dispatch => {
    await Deal.updateChecklist(dealId, checklistId, attributes)

    dispatch({
      type: actionTypes.UPDATE_CHECKLIST,
      id: checklistId,
      checklist: attributes
    })
  }
}
