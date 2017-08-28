import _ from 'underscore'
import types from '../../constants/deals'
import Deal from '../../models/Deal'

export function showAttachments(attachments) {
  return {
    type: types.SHOW_ATTACHMENTS,
    attachments
  }
}

export function updateAttachments(attachments) {
  return {
    type: types.UPDATE_ATTACHMENTS,
    attachments
  }
}

export function removeAttachment(id) {
  return {
    type: types.REMOVE_ATTACHMENT,
    id
  }
}

export function closeEsign() {
  return {
    type: types.CLOSE_ESIGN,
  }
}
