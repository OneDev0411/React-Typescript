import Fetch from '../../services/fetch'

import { DEFAULT_QUERY } from './contants'
// import { getStepsWithWaitDays } from './helpers'

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

    // Calculate steps wait_days and inject it
    return {
      ...flowData
      // steps: getStepsWithWaitDays(flowData.steps)
    }
  } catch (error) {
    throw error
  }
}
