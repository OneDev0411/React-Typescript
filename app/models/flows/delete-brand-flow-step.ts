import { SuperAgentRequest } from 'superagent'

import Fetch from '../../services/fetch'

/**
 * Deletes a brand flow step
 */

export function deleteBrandFlowStep(
  brand: UUID,
  flow: UUID,
  step: UUID
): SuperAgentRequest {
  try {
    return new Fetch().delete(`/brands/${brand}/flows/${flow}/steps/${step}`)
  } catch (error) {
    throw error
  }
}
