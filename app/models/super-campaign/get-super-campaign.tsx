import Fetch from 'services/fetch'

async function getSuperCampaign(
  superCampaignId: UUID
): Promise<ISuperCampaign> {
  return (await new Fetch().get(`/email/super-campaigns/${superCampaignId}`))
    .body.data
}

export default getSuperCampaign
