import Fetch from '../../services/fetch'

import { DEFAULT_QUERY } from './contants'
// import { getStepsWithWaitDays } from './helpers'

export async function getBrandFlows(
  brand: UUID,
  query: object = DEFAULT_QUERY
): Promise<IBrandFlow[]> {
  try {
    const response = await new Fetch()
      .get(`/brands/${brand}/flows`)
      .query(query)

    const flows: IBrandFlow[] = response.body.data

    return flows.map(flow => {
      if (!flow.steps) {
        return flow
      }

      // Calculate steps wait_days and inject it
      return {
        ...flow
        // steps: getStepsWithWaitDays(flow.steps)
      }
    })
  } catch (error) {
    throw error
  }
}
