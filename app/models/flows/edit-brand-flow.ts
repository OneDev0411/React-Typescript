import Fetch from '../../services/fetch'

/**
 * Edit Flow template
 */

export async function editBrandFlow(
  brand: UUID,
  flow: UUID,
  data: { name?: string; description?: string }
): Promise<IBrandFlow> {
  try {
    const response = await new Fetch()
      .put(`/brands/${brand}/flows/${flow}`)
      .send(data)

    return response.body.data
  } catch (error) {
    throw error
  }
}
