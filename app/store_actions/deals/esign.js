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
    type: types.CLOSE_ESIGN_WIZARD,
  }
}

export function setEnvelopes(deal_id, envelopes) {
  return {
    type: types.SET_ENVELOPES,
    deal_id,
    envelopes
  }
}

function setEnvelopeStatus(deal_id, envelope_id, status) {
  return {
    type: types.SET_ENVELOPE_STATUS,
    deal_id,
    envelope_id,
    status
  }
}

export function getEnvelopes(deal_id) {
  return async (dispatch) => {
    const envelopes = await Deal.getEnvelopes(deal_id)
    dispatch(setEnvelopes(deal_id, _.indexBy(envelopes, 'id')))
  }
}

export function voidEnvelope(dealId, envelopeId) {
  return async (dispatch) => {
    try {
      dispatch(setEnvelopeStatus(dealId, envelopeId, 'Voided'))
      await Deal.voidEnvelope(envelopeId)
    } catch(e) {
      throw e
    }
  }
}
