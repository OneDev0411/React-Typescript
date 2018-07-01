import * as actionTypes from '../../../../constants/deals'

export function setEnvelopes(envelopes) {
  return {
    type: actionTypes.SET_ENVELOPES,
    envelopes
  }
}
