import { SuperAgentRequest } from 'superagent'

import Fetch from '../../services/fetch'

/**
 * Edit multiple brand flow steps
 */

export function editBrandFlowSteps(
  brand: UUID,
  flow: UUID,
  steps: (IBrandFlowStepInput & { id: UUID })[]
): SuperAgentRequest {
  try {
    return new Fetch()
      .patch(`/brands/${brand}/flows/${flow}/steps`)
      .send({ steps })
  } catch (error) {
    throw error
  }
}
