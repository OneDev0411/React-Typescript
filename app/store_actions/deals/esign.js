import _ from 'underscore'
import types from '../../constants/deals'
import Deal from '../../models/Deal'

export function showAttachments(display = true) {
  return {
    type: types.SHOW_ATTACHMENTS,
    display
  }
}

export function showCompose(display = true) {
  return {
    type: types.SHOW_COMPOSE,
    display
  }
}

export function updateAttachments(attachments) {
  return {
    type: types.UPDATE_ATTACHMENTS,
    attachments
  }
}

export function addEsignRecipient(recipient) {
  return {
    type: types.SET_RECIPIENT,
    recipient
  }
}

export function removeEsignRecipient(id) {
  return {
    type: types.REMOVE_RECIPIENT,
    id
  }
}

export function removeAttachment(id) {
  return {
    type: types.REMOVE_ATTACHMENT,
    id
  }
}


export function closeEsignWizard() {
  return {
    type: types.CLOSE_ESIGN_WIZARD
  }
}
