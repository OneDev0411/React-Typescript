import Fetch from '../../../services/fetch'

export async function mergeMultipleContacts(clusters) {
  try {
    const response = await new Fetch().post('/contacts/merge').send({
      clusters
    })

    return response.body
  } catch (error) {
    throw error
  }
}
