import Fetch from '../../services/fetch'

import { DEFAULT_QUERY } from './contants'

/**
 * Creates a new Flow step
 */

export async function createStep(
  brand: UUID,
  flow: UUID,
  step: IBrandFlowStepInput,
  query: object = DEFAULT_QUERY
): Promise<IBrandFlowStep[]> {
  try {
    const response = await new Fetch()
      .post(`/brands/${brand}/flows/${flow}/steps`)
      .query(query)
      .send(step)

    return response.body.data
  } catch (error) {
    throw error
  }
}
