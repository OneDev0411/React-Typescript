import * as actionTypes from '../../../../constants/deals'

export function removeAttachment(attachment) {
  return {
    type: actionTypes.REMOVE_ATTACHMENT,
    attachment
  }
}
