import Fetch from '../../../../services/fetch'

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
