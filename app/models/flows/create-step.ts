import Fetch from '../../services/fetch'

import { DEFAULT_QUERY } from './contants'

/**
 * Creates a new Flow step
 */

export async function createStep(
  brand: UUID,
  flow: UUID,
  steps: IBrandFlowStepInput[],
  query: object = DEFAULT_QUERY
): Promise<IBrandFlowStep[]> {
  try {
    const response = await new Fetch()
      .post(`/brands/${brand}/flows/${flow}/steps`)
      .query(query)
      .send({ steps })

    return response.body.data
  } catch (error) {
    throw error
  }
}
