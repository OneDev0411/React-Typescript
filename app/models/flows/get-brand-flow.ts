import Fetch from '../../services/fetch'

import { DEFAULT_QUERY } from './contants'

export async function getBrandFlow(
  brand: UUID,
  flow: UUID,
  query: object = DEFAULT_QUERY
): Promise<IBrandFlow> {
  try {
    const response = await new Fetch()
      .get(`/brands/${brand}/flows/${flow}`)
      .query(query)

    return response.body.data
  } catch (error) {
    throw error
  }
}
