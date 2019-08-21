import { SuperAgentRequest } from 'superagent'

import Fetch from 'services/fetch'

export function deleteEmailCampaign(id: string): SuperAgentRequest {
  return new Fetch().delete(`/emails/${id}`)
}
