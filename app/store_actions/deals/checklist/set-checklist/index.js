import * as actionTypes from '../../../../constants/deals'

export function setChecklists(checklists) {
  return {
    type: actionTypes.GET_CHECKLISTS,
    checklists
  }
}
