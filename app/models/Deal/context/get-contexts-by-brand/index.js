import Fetch from '../../../../services/fetch'

/**
 * get contexts list by brand id
 */
export async function getContextsByBrandId(brandId) {
  try {
    const response = await new Fetch().get(`/brands/${brandId}/contexts`)

    return response.body.data
  } catch (e) {
    return null
  }
}
