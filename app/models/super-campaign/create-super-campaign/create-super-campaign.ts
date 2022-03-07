import Fetch from '@app/services/fetch'

import { templateInstanceAssociations } from '../constants'

export async function createSuperCampaign(
  data: ISuperCampaignInput
): Promise<ISuperCampaign<'template_instance'>> {
  return (
    await new Fetch()
      .post('/email/super-campaigns')
      .query({
        associations: templateInstanceAssociations
      })
      .send(data)
  ).body.data
}
