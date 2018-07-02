import * as actionTypes from '../../../../constants/deals'

export function addAttachment(attachment) {
  return {
    type: actionTypes.ADD_ATTACHMENT,
    attachment
  }
}
