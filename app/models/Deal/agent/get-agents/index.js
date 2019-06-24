import Fetch from '../../../../services/fetch'

const MIN_LENGTH = 4

/**
 * get all agents of brand
 */
export async function getAgents(brandId, query = '') {
  if (!brandId) {
    throw new Error('This user does not belong to any brand')
  }

  const searchQuery = query &&
    query.length >= MIN_LENGTH && {
      q: query
    }

  try {
    const response = await new Fetch()
      .get(`/brands/${brandId}/agents`)
      .query({ 'associations[]': ['brand.roles'] })
      .query({ 'associations[]': ['brand_role.users'] })
      .query({ 'associations[]': ['agent.office'] })
      .query(searchQuery)

    return response.body.data
  } catch (e) {
    return null
  }
}
