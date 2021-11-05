import Fetch from 'services/fetch'

async function enrollMeInSuperCampaign(
  superCampaignId: UUID,
  tags: string[]
): Promise<ISuperCampaignEnrollment> {
  return (
    await new Fetch()
      .put(`/email/super-campaigns/${superCampaignId}/enrollments/self`)
      .send({ tags })
  ).body.data
}

export default enrollMeInSuperCampaign
