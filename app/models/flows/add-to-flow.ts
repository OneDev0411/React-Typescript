import { SuperAgentRequest } from 'superagent'

import Fetch from '../../services/fetch'

/**
 * Adds contacts to a CRM flow
 */

export function addToFlow(data: IFlowEnrollInput): SuperAgentRequest {
  try {
    return new Fetch().post('/crm/flows').send(data)
  } catch (error) {
    throw error
  }
}
