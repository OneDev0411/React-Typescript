import * as actionTypes from '../../../../constants/deals'

export function showAttachments(display = true) {
  return {
    type: actionTypes.SHOW_ATTACHMENTS,
    display
  }
}
