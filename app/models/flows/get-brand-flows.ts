import Fetch from '../../services/fetch'

import { DEFAULT_QUERY } from './contants'

export async function getBrandFlows(
  brand: UUID,
  query: object = DEFAULT_QUERY
): Promise<IBrandFlow[]> {
  try {
    const response = await new Fetch()
      .get(`/brands/${brand}/flows`)
      .query(query)

    return response.body.data
  } catch (error) {
    throw error
  }
}
