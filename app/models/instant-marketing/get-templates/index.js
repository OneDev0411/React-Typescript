import Fetch from '../../../services/fetch'

export async function getTemplates(types) {
  try {
    const response = await new Fetch()
      .get('/templates')
      .query({ 'types[]': types })

    return response.body.data
  } catch (e) {
    throw e
  }
}
