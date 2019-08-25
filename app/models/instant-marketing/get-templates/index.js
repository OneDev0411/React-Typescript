import Fetch from '../../../services/fetch'

export async function getTemplates(brandId, types, mediums) {
  try {
    const response = await new Fetch()
      .get(`/brands/${brandId}/templates`)
      .query({ 'mediums[]': mediums, 'types[]': types })

    return response.body.data
  } catch (e) {
    throw e
  }
}
