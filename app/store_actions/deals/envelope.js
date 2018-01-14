import _ from 'underscore'
import { batchActions } from 'redux-batched-actions'
import types from '../../constants/deals'
import Deal from '../../models/Deal'

export function envelopeCreated(deal_id, envelope) {
  return {
    type: types.CREATE_ENVELOPE,
    deal_id,
    envelope
  }
}

export function createEnvelope(deal_id, subject, message, attachments, recipients) {
  return async (dispatch) => {
    try {
      const envelope = await Deal.sendEnvelope(
        deal_id,
        subject,
        message,
        attachments,
        recipients
      )

      // create indexed envelops
      const indexedEnvelops = _.indexBy([envelope], 'id')

      batchActions([
        dispatch(setEnvelopes(indexedEnvelops)),
        dispatch(envelopeCreated(deal_id, envelope))
      ])

    } catch (e) {
      throw e
    }
  }
}

export function setEnvelopes(envelopes) {
  return {
    type: types.SET_ENVELOPES,
    envelopes
  }
}

function setEnvelopeStatus(envelope_id, status) {
  return {
    type: types.SET_ENVELOPE_STATUS,
    envelope_id,
    status
  }
}

export function voidEnvelope(deal_id, envelope_id) {
  return async (dispatch) => {
    try {
      dispatch(setEnvelopeStatus(envelope_id, 'Voided'))
      await Deal.voidEnvelope(envelope_id)
    } catch (e) {
      throw e
    }
  }
}
