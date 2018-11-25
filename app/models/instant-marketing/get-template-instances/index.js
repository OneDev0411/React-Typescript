import Fetch from '../../../services/fetch'

export async function getTemplateInstances(id, data) {
  try {
    const response = await new Fetch()
      .post(`/templates/${id}/instances`)
      .send(data)

    return response.body.data
  } catch (e) {
    throw e
  }
}
