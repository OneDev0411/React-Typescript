import Fetch from 'services/fetch'

async function deleteSuperCampaign(superCampaignId: UUID): Promise<void> {
  await new Fetch().delete(`/email/super-campaigns/${superCampaignId}`)
}

export default deleteSuperCampaign
