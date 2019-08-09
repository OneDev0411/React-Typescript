import Fetch from '../../services/fetch'

import { DEFAULT_QUERY } from './contants'

/**
 * Creates a new Flow template
 */

export async function createFlow(
  brand: UUID,
  data: IBrandFlowInput,
  query: object = DEFAULT_QUERY
): Promise<IBrandFlow> {
  try {
    const response = await new Fetch()
      .post(`/brands/${brand}/flows`)
      .query(query)
      .send(data)

    return response.body.data
  } catch (error) {
    throw error
  }
}
