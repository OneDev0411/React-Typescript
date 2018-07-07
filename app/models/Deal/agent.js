import Fetch from '../../services/fetch'

/**
 * get all agents of brand
 */
export async function getAgents(brandId) {
  if (!brandId) {
    throw new Error('This user does not belong to any brand')
  }

  try {
    const response = await new Fetch().get(`/brands/${brandId}/agents`)

    return response.body.data
  } catch (e) {
    return null
  }
}

export default {
  getAgents
}
