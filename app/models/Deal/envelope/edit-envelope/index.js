import Fetch from '../../../../services/fetch'

export async function editEnvelope(envelope_id) {
  try {
    const response = await new Fetch().get(`/envelopes/${envelope_id}/edit`)

    return response.body.data
  } catch (e) {
    return null
  }
}
