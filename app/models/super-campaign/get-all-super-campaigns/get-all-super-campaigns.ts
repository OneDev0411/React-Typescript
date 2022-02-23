import Fetch from '@app/services/fetch'

import { templateInstanceAssociations } from '../constants'

export type FetchRange = {
  start: number
  limit: number
}

export async function getAllSuperCampaigns(
  range: FetchRange,
  order?: string[]
): Promise<ISuperCampaign<'template_instance'>[]> {
  const response = await new Fetch({ proxy: false })
    .post('/email/super-campaigns/filter')
    .query({
      associations: templateInstanceAssociations
    })
    .send({ ...range, order })

  return response.body.data
}
