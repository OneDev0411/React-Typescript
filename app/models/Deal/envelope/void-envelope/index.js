import Fetch from '../../../../services/fetch'

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
