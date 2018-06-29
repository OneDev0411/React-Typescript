import * as actionTypes from '../../constants/deals'

export function showAttachments(display = true) {
  return {
    type: actionTypes.SHOW_ATTACHMENTS,
    display
  }
}

export function showCompose(display = true) {
  return {
    type: actionTypes.SHOW_COMPOSE,
    display
  }
}

export function addAttachment(attachment) {
  return {
    type: actionTypes.ADD_ATTACHMENT,
    attachment
  }
}

export function addEsignRecipient(recipient) {
  return {
    type: actionTypes.SET_RECIPIENT,
    recipient
  }
}

export function removeEsignRecipient(id) {
  return {
    type: actionTypes.REMOVE_RECIPIENT,
    id
  }
}

export function removeAttachment(attachment) {
  return {
    type: actionTypes.REMOVE_ATTACHMENT,
    attachment
  }
}

export function closeEsignWizard() {
  return {
    type: actionTypes.CLOSE_ESIGN_WIZARD
  }
}
