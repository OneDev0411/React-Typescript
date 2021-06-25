import { SuperAgentRequest } from 'superagent'

import Fetch from '../../services/fetch'

/**
 * Edit a brand flow step
 */

export function editBrandFlowStepOrder(
  brand: UUID,
  flow: UUID,
  step: UUID,
  destination: number
): SuperAgentRequest {
  try {
    return new Fetch()
      .put(`/brands/${brand}/flows/${flow}/steps/${step}`)
      .send({
        order: destination
      })
  } catch (error) {
    throw error
  }
}
