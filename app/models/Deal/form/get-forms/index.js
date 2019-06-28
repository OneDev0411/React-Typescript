import Fetch from '../../../../services/fetch'

/**
 * get forms list
 */
export async function getForms(brandId) {
  try {
    const response = await new Fetch().get(`/brands/${brandId}/forms`)

    return response.body.data
  } catch (e) {
    console.log(e)
  }
}
