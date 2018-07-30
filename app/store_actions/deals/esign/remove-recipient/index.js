import * as actionTypes from '../../../../constants/deals'

export function removeEsignRecipient(id) {
  return {
    type: actionTypes.REMOVE_RECIPIENT,
    id
  }
}
