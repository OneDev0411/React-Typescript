import Fetch from 'services/fetch'

interface UnenrollUserFromSuperCampaignInput {
  user: UUID
  brand: UUID
}

export async function unenrollUserFromSuperCampaign(
  superCampaignId: UUID,
  data: UnenrollUserFromSuperCampaignInput
): Promise<void> {
  await new Fetch()
    .delete(`/email/super-campaigns/${superCampaignId}/enrollments`)
    .send(data)
}
