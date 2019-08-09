import { SuperAgentRequest } from 'superagent'

import Fetch from '../../services/fetch'

/**
 * Edit a brand flow step
 */

export function editBrandFlowStep(
  brand: UUID,
  flow: UUID,
  step: UUID,
  data: IBrandFlowStepInput
): SuperAgentRequest {
  try {
    return new Fetch()
      .put(`/brands/${brand}/flows/${flow}/steps/${step}`)
      .send(data)
  } catch (error) {
    throw error
  }
}
