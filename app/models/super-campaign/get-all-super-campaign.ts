import { SuperAgentRequest } from 'superagent'

import Fetch from 'services/fetch'

export type FetchRange = {
  start: number
  limit: number
}

export function getAllSuperCampaign(
  range: FetchRange,
  order?: string[]
): SuperAgentRequest {
  return new Fetch()
    .post('/email/super-campaigns/filter')
    .send({ ...range, order })
}
