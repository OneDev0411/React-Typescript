import Fetch from '../../../services/fetch'

export async function getBrandMembers(brandId) {
  try {
    const response = await new Fetch()
      .get(`/brands/${brandId}`)
      .query({ 'associations[]': ['brand.roles'] })
      .query({ 'associations[]': ['brand_role.members'] })

    return response.body && response.body.data
  } catch (e) {
    console.log(e)
  }
}
