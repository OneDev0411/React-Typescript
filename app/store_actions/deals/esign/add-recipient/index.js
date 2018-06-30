import * as actionTypes from '../../../../constants/deals'

export function addEsignRecipient(recipient) {
  return {
    type: actionTypes.SET_RECIPIENT,
    recipient
  }
}
