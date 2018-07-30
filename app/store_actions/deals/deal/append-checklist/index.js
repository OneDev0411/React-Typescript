import * as actionTypes from '../../../../constants/deals'

export function appendChecklist(deal_id, checklist_id) {
  return {
    type: actionTypes.APPEND_CHECKLIST,
    deal_id,
    checklist_id
  }
}
