import * as actionTypes from '../../../../constants/deals'

export function setExpandChecklist(checklistId, isExpanded = false) {
  return {
    type: actionTypes.SET_EXPAND_CHECKLIST,
    checklistId,
    isExpanded
  }
}
