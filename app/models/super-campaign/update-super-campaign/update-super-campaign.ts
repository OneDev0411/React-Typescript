import Fetch from 'services/fetch'

import { templateInstanceAssociations } from '../constants'

export async function updateSuperCampaign(
  superCampaignId: UUID,
  data: ISuperCampaignInput
): Promise<ISuperCampaign<'template_instance'>> {
  return (
    await new Fetch()
      .put(`/email/super-campaigns/${superCampaignId}`)
      .query({
        associations: templateInstanceAssociations
      })
      .send(data)
  ).body.data
}
