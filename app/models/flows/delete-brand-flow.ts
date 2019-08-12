import { SuperAgentRequest } from 'superagent'

import Fetch from '../../services/fetch'

/**
 * Deletes a brand flow
 */

export function deleteBrandFlow(brand: UUID, flow: UUID): SuperAgentRequest {
  try {
    return new Fetch().delete(`/brands/${brand}/flows/${flow}`)
  } catch (error) {
    throw error
  }
}
