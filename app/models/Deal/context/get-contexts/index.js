import Fetch from '../../../../services/fetch'

/**
 * get contexts info
 */
export async function getContexts(brandId) {
  try {
    const response = await new Fetch().get(`/brands/${brandId}/contexts`)

    return response.body.data
  } catch (e) {
    return null
  }
}
