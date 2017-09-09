import types from '../../constants/deals'
import Deal from '../../models/Deal'

function update(id, checklist) {
  return {
    type: types.UPDATE_CHECKLIST,
    id,
    checklist
  }
}

export function updateChecklist(dealId, checklistId, attributes) {
  return async (dispatch) => {
    await Deal.updateChecklist(dealId, checklistId, attributes)
    dispatch(update(checklistId, attributes))
  }
}
