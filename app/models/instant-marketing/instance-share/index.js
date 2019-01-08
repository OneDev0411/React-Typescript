import Fetch from '../../../services/fetch'

export async function shareInstance(instanceId, recipients, text) {
  try {
    const response = await new Fetch()
      .post(`/templates/instances/${instanceId}/share`)
      .send({
        text,
        recipients
      })

    return response.body.data
  } catch (e) {
    throw e
  }
}
