import Fetch from '../../../services/fetch'

export async function getTemplates(types, mediums) {
  try {
    const response = await new Fetch()
      .get('/templates')
      .query({ 'mediums[]': mediums, 'types[]': types })

    return response.body.data
  } catch (e) {
    throw e
  }
}
