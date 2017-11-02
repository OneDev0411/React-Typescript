import _ from 'underscore'
import types from '../../constants/deals'
import Deal from '../../models/Deal'

function setEnvelopeStatus(deal_id, envelope_id, status) {
  return {
    type: types.SET_ENVELOPE_STATUS,
    deal_id,
    envelope_id,
    status
  }
}

export function showAttachments(attachments, { showCompose }) {
  return {
    type: types.SHOW_ATTACHMENTS,
    attachments,
    showCompose: showCompose || false
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

export function closeAttachments() {
  return {
    type: types.CLOSE_ATTACHMENTS,
  }
}

export function closeEsign() {
  return {
    type: types.CLOSE_ESIGN,
  }
}

export function setEnvelopes(deal_id, envelopes) {
  return {
    type: types.SET_ENVELOPES,
    deal_id,
    envelopes
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
