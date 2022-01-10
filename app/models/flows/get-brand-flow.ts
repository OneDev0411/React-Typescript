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

    const flowData: IBrandFlow = response.body.data

    if (!flowData.steps) {
      return flowData
    }

    return flowData
  } catch (error) {
    throw error
  }
}
