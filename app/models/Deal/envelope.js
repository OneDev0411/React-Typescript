import Fetch from '../../services/fetch'
import _ from 'underscore'

/**
 * resend specific envelope
 */
export async function resendEnvelope(id) {
  try {
    const response = await new Fetch().post(`/envelopes/${id}/resend`)

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
 * send envelope
 */
export async function sendEnvelope(
  deal_id,
  subject,
  message,
  attachments,
  recipients
) {
  const data = {
    deal: deal_id,
    title: subject,
    body: message,
    documents: attachments,
    recipients: _.map(recipients, recipient => recipient)
  }

  try {
    const response = await new Fetch().post('/envelopes').send(data)

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
 * void envelope
 */
export async function voidEnvelope(envelope_id) {
  try {
    const response = await new Fetch()
      .patch(`/envelopes/${envelope_id}/status`)
      .send({ status: 'Voided' })

    return response.body.data
  } catch (e) {
    return null
  }
}

export async function editEnvelope(envelope_id) {
  try {
    const response = await new Fetch()
      .get(`/envelopes/${envelope_id}/edit`)

    return response.body.data
  } catch (e) {
    return null
  }
}

export function getEnvelopeEditLink(envelope_id, token) {
  return `/api/deals/envelope/${envelope_id}/edit?access_token=${token}`
}

export function getEnvelopeSignLink(envelope_id, recipient_id, token) {
  return `/api/deals/envelope/${envelope_id}/sign/${recipient_id}\
?access_token=${token}`
}

export default {
  sendEnvelope,
  resendEnvelope,
  voidEnvelope,
  editEnvelope,
  getEnvelopeEditLink,
  getEnvelopeSignLink
}
