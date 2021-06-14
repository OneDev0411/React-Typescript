import Fetch from '../../services/fetch'

import { DEFAULT_QUERY } from './contants'
// import { getStepsWithWaitDays } from './helpers'

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

    const flow: IBrandFlow = response.body.data

    if (!flow.steps) {
      return flow
    }

    // Calculate steps wait_days and inject it
    return {
      ...flow
      // steps: getStepsWithWaitDays(flow.steps)
    }
  } catch (error) {
    throw error
  }
}
