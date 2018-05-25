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

export function addAttachment(attachment) {
  return {
    type: types.ADD_ATTACHMENT,
    attachment
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

export function removeAttachment(attachment) {
  return {
    type: types.REMOVE_ATTACHMENT,
    attachment
  }
}


export function closeEsignWizard() {
  return {
    type: types.CLOSE_ESIGN_WIZARD
  }
}
