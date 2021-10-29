import Fetch from 'services/fetch'

interface UnenrollUserFromSuperCampaignInput {
  user: UUID
  brand: UUID
}

async function unenrollUserFromSuperCampaign(
  superCampaignId: UUID,
  enrollmentId: UUID,
  data: UnenrollUserFromSuperCampaignInput
): Promise<void> {
  return (
    await new Fetch()
      .delete(
        `/email/super-campaigns/${superCampaignId}/enrollments/${enrollmentId}`
      )
      .send(data)
  ).body.data
}

export default unenrollUserFromSuperCampaign
