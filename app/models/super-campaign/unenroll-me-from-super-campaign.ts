import Fetch from 'services/fetch'

export async function unenrollMeFromSuperCampaign(
  superCampaignId: UUID
): Promise<void> {
  await new Fetch().delete(
    `/email/super-campaigns/${superCampaignId}/enrollments/self`
  )
}
