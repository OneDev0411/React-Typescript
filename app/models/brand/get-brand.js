import Fetch from '../../services/fetch'

export async function getBrand(id, query) {
  if (!id) {
    throw new Error(`The brand id must be a UUID. ${id}`)
  }

  try {
    const response = await new Fetch().get(`/brands/${id}`).query(query)

    return response.body.data
  } catch (error) {
    throw error
  }
}

export default getBrand
