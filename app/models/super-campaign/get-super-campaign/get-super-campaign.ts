import Fetch from '@app/services/fetch'

import { templateInstanceAssociations } from '../constants'

export async function getSuperCampaign(
  superCampaignId: UUID
): Promise<ISuperCampaign<'template_instance'>> {
  return (
    await new Fetch().get(`/email/super-campaigns/${superCampaignId}`).query({
      associations: templateInstanceAssociations
    })
  ).body.data
}
