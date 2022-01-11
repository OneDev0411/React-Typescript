import Fetch from 'services/fetch'

export async function deleteSuperCampaign(
  superCampaignId: UUID
): Promise<void> {
  await new Fetch().delete(`/email/super-campaigns/${superCampaignId}`)
}
