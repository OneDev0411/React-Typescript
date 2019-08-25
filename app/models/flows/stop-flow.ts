import { SuperAgentRequest } from 'superagent'

import Fetch from '../../services/fetch'

/**
 * Stops a CRM flow instance for a contact
 */

export function stopFlow(flowInstanceId: UUID): SuperAgentRequest {
  try {
    return new Fetch().delete(`/crm/flows/${flowInstanceId}`)
  } catch (error) {
    throw error
  }
}
